import { describe, it, expect } from 'vitest'
import {
  calcRoomIndex, baseUF, calcSummary, getLumensPerWatt, WORK_PLANE_M,
} from './lighting'
import { CUSTOM_LIGHT_TYPES, INTERIOR_TONES } from '../data/lights'
import type { Light } from '../types'

describe('getLumensPerWatt — 카탈로그가 유일한 정본 (감사 #191)', () => {
  it('전 종이 카탈로그 lmPerW 와 일치한다 — 리터럴 맵이 부활하면 여기서 어긋난다', () => {
    for (const t of CUSTOM_LIGHT_TYPES) {
      expect(getLumensPerWatt(t.value), t.value).toBe(t.lmPerW)
    }
  })
  it("'기타' 도 카탈로그 값(80)", () => {
    expect(getLumensPerWatt('기타')).toBe(80)
  })
  it('미지 종류는 90 폴백', () => {
    expect(getLumensPerWatt('없는종류')).toBe(90)
  })
})

describe('calcRoomIndex — 작업면 0.8m 보정 (사장 결정 2026-07-31)', () => {
  it('K = √A / (2·(h−0.8)) — 천장고 그대로 쓰던 구식과 다르다', () => {
    // 25㎡ · 천장 3000mm → √25 / (2 × 2.2)
    expect(calcRoomIndex(25, 3000)).toBeCloseTo(5 / 4.4, 10)
  })
  it('천장고가 작업면(0.8m) 이하면 0 — 입력 오류', () => {
    expect(calcRoomIndex(25, 800)).toBe(0)
    expect(calcRoomIndex(25, 500)).toBe(0)
  })
  it('0.8m 상수가 화면 캡션(App.tsx)과 같은 값', () => {
    expect(WORK_PLANE_M).toBe(0.8)
  })
})

describe('calcSummary — 회귀 앵커', () => {
  it('대표 케이스 고정: 33㎡·2700mm·보통톤·간접 포함', () => {
    const lights: Light[] = [
      { id: 1, name: '다운라이트', category: '매립조명', watt: 10, lumen: 900, quantity: 10 },
      { id: 2, name: 'T5', category: '간접조명', watt: 20, lumen: 2000, quantity: 5 },
    ] as unknown as Light[]
    const s = calcSummary({
      lights, area_m2: 33, height_mm: 2700,
      tone: 'normal', spaceType: { value: '카페', label: '카페', mf: 0.8, targetLux: 300 } as never,
    })
    // K = √33 / (2 × 1.9) = 1.5117… → baseUF 0.74 · tone 0.85
    expect(s.K).toBeCloseTo(Math.sqrt(33) / 3.8, 10)
    expect(s.baseUFValue).toBe(baseUF(s.K))
    expect(s.uf).toBeCloseTo(0.74 * 0.85, 10)
    // Σlm = 9000 + 2000×5×0.7 = 16000 → E = 16000 × uf × 0.8 / 33
    expect(s.totalLumen).toBe(16000)
    expect(s.expectedLux).toBe(Math.round((16000 * 0.74 * 0.85 * 0.8) / 33))
  })
  it('톤 계수는 카탈로그(INTERIOR_TONES)에서 온다', () => {
    const dark = INTERIOR_TONES.find(t => t.value === 'dark')!
    expect(dark.factor).toBe(0.70)
  })
})
