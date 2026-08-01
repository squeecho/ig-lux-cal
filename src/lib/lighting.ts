/* ───────── iggg-lux 조도 계산 로직 ─────────
   순수 함수만. UI 의존성 없음. 단위 테스트 가능.

   공식:
     E = (Σlm × adj) × UF × MF / A
     UF = baseUF(K) × interiorTone
     K  = √A / (2·(h−0.8))       (정사각형 가정, 작업면 0.8m — 사장 결정 2026-07-31)
     adj = 0.7 if 간접조명 else 1
*/

import type { Light, InteriorTone, SpaceType } from '../types'
import { INTERIOR_TONES, CUSTOM_LIGHT_TYPES } from '../data/lights'

/** 작업면 높이(m) — 실지수는 **작업면에서 조명까지의 높이(Hm)** 로 계산한다.
 *  KS·IES 관행값 0.8m(테이블 상면). 사장 결정 2026-07-31로 적용.
 */
export const WORK_PLANE_M = 0.8

/** 실지수 K 계산 (정사각형 공간 가정).
 *
 *  ⚠**작업면 보정**(사장 결정 2026-07-31, 감사 백로그 #54): 예전엔 천장고를 그대로
 *    써서 Hm 을 과대평가했고, 그만큼 K 가 작게 나와 조명률(UF)이 낮게 잡혔다
 *    — 필요 조도를 맞추려면 등기구가 실제보다 더 많이 필요하다고 계산된다.
 *    실지수는 바닥이 아니라 **작업면 기준**이 표준이다(Hm = 천장고 − 0.8m).
 *    ⓘ 이 변경으로 **기존 계산서와 숫자가 달라진다**(K↑ → UF↑ → 예상 조도↑).
 *
 *  @param area_m2 면적 (m²)
 *  @param height_mm 천장 높이 (mm)
 */
export function calcRoomIndex(area_m2: number, height_mm: number): number {
  if (area_m2 <= 0 || height_mm <= 0) return 0
  const hm = height_mm / 1000 - WORK_PLANE_M
  if (hm <= 0) return 0        // 천장고가 작업면 이하 — 계산 불가(입력 오류)
  return Math.sqrt(area_m2) / (2 * hm)
}

/** 실지수 K → 기본 조명률 (반사율 70/50/30 가정, IES 표 근사) */
export function baseUF(K: number): number {
  if (K <= 0.6)  return 0.40
  if (K <= 0.8)  return 0.48
  if (K <= 1.0)  return 0.55
  if (K <= 1.25) return 0.62
  if (K <= 1.5)  return 0.68
  if (K <= 2.0)  return 0.74
  if (K <= 2.5)  return 0.78
  if (K <= 3.0)  return 0.81
  return 0.84
}

/** 인테리어 톤 → 보정 계수 */
export function toneFactor(tone: InteriorTone): number {
  return INTERIOR_TONES.find(t => t.value === tone)?.factor ?? 0.85
}

/** UF 단계 라벨 (UI 표시용) */
export function ufLabel(K: number): string {
  if (K <= 0.6)  return '좁고 높음 (K≤0.6)'
  if (K <= 0.8)  return 'K≤0.8'
  if (K <= 1.0)  return 'K≤1.0'
  if (K <= 1.25) return '표준 (K≤1.25)'
  if (K <= 1.5)  return 'K≤1.5'
  if (K <= 2.0)  return 'K≤2.0'
  if (K <= 2.5)  return 'K≤2.5'
  if (K <= 3.0)  return 'K≤3.0'
  return '넓고 낮음 (K>3.0)'
}

/** 광원 합산 (간접조명은 0.7 보정) */
export function sumLumen(lights: Light[]): number {
  return lights.reduce((sum, l) => {
    const adj = l.category === '간접조명' ? 0.7 : 1
    return sum + l.lumen * adj * l.quantity
  }, 0)
}

/** 총 와트 합산 */
export function sumWatt(lights: Light[]): number {
  return lights.reduce((sum, l) => sum + l.watt * l.quantity, 0)
}

/** 종합 결과 (UI에서 한 번에 가져가도록 묶음) */
export interface CalcSummary {
  expectedLux: number
  totalLumen: number
  totalWatt: number
  K: number
  uf: number
  mf: number
  baseUFValue: number
  toneFactorValue: number
}

export function calcSummary(params: {
  lights: Light[]
  area_m2: number
  height_mm: number
  tone: InteriorTone
  spaceType: SpaceType
}): CalcSummary {
  const { lights, area_m2, height_mm, tone, spaceType } = params
  const K = calcRoomIndex(area_m2, height_mm)
  const baseUFValue = baseUF(K)
  const toneFactorValue = toneFactor(tone)
  const uf = baseUFValue * toneFactorValue
  const mf = spaceType.mf
  const totalLumen = sumLumen(lights)
  const totalWatt = sumWatt(lights)
  const expectedLux = area_m2 > 0
    ? Math.round((totalLumen * uf * mf) / area_m2)
    : 0
  return {
    expectedLux,
    totalLumen: Math.round(totalLumen),
    totalWatt,
    K,
    uf,
    mf,
    baseUFValue,
    toneFactorValue,
  }
}

/** 커스텀 조명 종류별 lm/W 효율 조회 — 정본은 카탈로그(data/lights.ts 의
 *  CUSTOM_LIGHT_TYPES.lmPerW) 하나다. 예전엔 여기 리터럴 맵이 중복 정의돼
 *  카탈로그를 고쳐도 계산이 안 바뀌었다(감사 #191). '기타'(80)도 카탈로그 값,
 *  호출부에서 직접 입력값으로 대체한다. */
export function getLumensPerWatt(typeValue: string): number {
  return CUSTOM_LIGHT_TYPES.find(t => t.value === typeValue)?.lmPerW ?? 90
}

/** 입력 필드 앞 0 제거 */
export function stripLeadingZeros(v: string): string {
  return v.replace(/^0+(?=\d)/, '')
}
