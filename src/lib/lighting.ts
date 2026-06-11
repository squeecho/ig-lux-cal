/* ───────── iggg-lux 조도 계산 로직 ─────────
   순수 함수만. UI 의존성 없음. 단위 테스트 가능.

   공식:
     E = (Σlm × adj) × UF × MF / A
     UF = baseUF(K) × interiorTone
     K  = √A / (2h)              (정사각형 가정)
     adj = 0.7 if 간접조명 else 1
*/

import type { Light, InteriorTone, SpaceType } from '../types'
import { INTERIOR_TONES } from '../data/lights'

/** 실지수 K 계산 (정사각형 공간 가정).
 *  @param area_m2 면적 (m²)
 *  @param height_mm 천장 높이 (mm)
 */
export function calcRoomIndex(area_m2: number, height_mm: number): number {
  if (area_m2 <= 0 || height_mm <= 0) return 0
  const h = height_mm / 1000
  return Math.sqrt(area_m2) / (2 * h)
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

/** 커스텀 조명 종류별 lm/W 효율 조회 ('기타'는 기본값 80, 호출부에서 직접 입력값 처리) */
export function getLumensPerWatt(typeValue: string): number {
  if (typeValue === '기타') return 80
  const map: Record<string, number> = {
    '매립조명': 90,
    '직부조명': 90,
    '간접조명': 100,
    '레일조명': 85,
    '전구형 조명': 100,
  }
  return map[typeValue] ?? 90
}

/** 입력 필드 앞 0 제거 */
export function stripLeadingZeros(v: string): string {
  return v.replace(/^0+(?=\d)/, '')
}
