/* ───────── 타입 정의 (iggg-lux) ───────── */

/** 카탈로그 조명 데이터 (정적 마스터) */
export interface LightData {
  name: string
  lumenByColorTemp: Record<string, number>
  watt: number
  colorTemps: string[]
  size: string
  category: string
  type?: string
  thumbnail?: string
}

/** 선택된 조명 (계산용) */
export interface Light {
  id: string
  name: string
  lumen: number
  watt: number
  colorTemp: string
  size: string
  quantity: number
  category: string
  type?: string
  thumbnail?: string
}

/** 사용자가 저장한 커스텀 조명 */
export interface SavedCustomLight {
  id: string
  name: string
  lumen: number
  watt: number
  type: string
  efficiency?: number
  /** 추가 시와 동일한 계산 카테고리 — 구 저장분은 없음(불러오기에서 type 폴백) */
  category?: string
}

/** 저장된 조도 결과 (스냅샷) */
export interface SavedResult {
  id: string
  name: string
  area: string
  height: string
  desiredLux: number
  expectedLux: number
  totalLumen: number
  totalWatt: number
  interiorTone: InteriorTone
  spaceTypeName: string
  lights: Light[]
}

/** 공간 유형 (목표 조도 + MF 자동 매핑) */
export interface SpaceType {
  name: string
  lux: number
  mf: number
}

/** 인테리어 톤 (UF 보정) */
export type InteriorTone = 'bright' | 'normal' | 'dark'

export interface InteriorToneOption {
  value: InteriorTone
  label: string
  desc: string
  factor: number
}
