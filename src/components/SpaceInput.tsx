import { NumberInput } from './NumberInput'
import {
  SPACE_TYPES, SPACE_FIRST_ROW, SPACE_SECOND_ROW, INTERIOR_TONES,
} from '../data/lights'
import { calcRoomIndex, baseUF, ufLabel } from '../lib/lighting'
import type { SpaceType, InteriorTone } from '../types'

interface Props {
  area: string
  height: string
  desiredLux: number
  spaceType: SpaceType
  tone: InteriorTone
  onAreaChange: (v: string) => void
  onHeightChange: (v: string) => void
  onDesiredLuxChange: (v: number) => void
  onSpaceTypeChange: (st: SpaceType) => void
  onToneChange: (t: InteriorTone) => void
}

export function SpaceInput({
  area, height, desiredLux, spaceType, tone,
  onAreaChange, onHeightChange, onDesiredLuxChange, onSpaceTypeChange, onToneChange,
}: Props) {
  const K = calcRoomIndex(Number(area) || 0, Number(height) || 0)
  const baseUFValue = baseUF(K)

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-5">
      <h2 className="text-xl font-semibold text-center">공간 정보 입력</h2>
      <p className="text-center text-[0.65rem] text-gray-500 -mt-1 mb-1">(바닥면적, 조명높이)</p>

      {/* 면적 / 높이 */}
      <NumberInput label="면적" unit="m²"  value={area}   onChange={onAreaChange} />
      <NumberInput label="높이" unit="mm"  value={height} onChange={onHeightChange} step={50} />

      {/* 실지수 + UF 정보 */}
      <p className="text-center text-xs text-gray-500">
        실지수 K = {K.toFixed(2)} ({ufLabel(K)}) · 기본 UF {baseUFValue.toFixed(2)}
      </p>

      {/* 인테리어 톤 (신규) */}
      <div className="space-y-1">
        <p className="text-center font-medium">인테리어 톤</p>
        <div className="grid grid-cols-3 gap-2">
          {INTERIOR_TONES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={(e) => { e.preventDefault(); onToneChange(t.value) }}
              className={`px-1.5 py-2 rounded-lg text-xs leading-snug transition
                ${tone === t.value
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}
            >
              {t.label}<br/>
              <span className="text-[0.6rem] opacity-70">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 목표 조도 */}
      <div className="relative">
        <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">목표 조도</span>
        <select
          value={desiredLux}
          onChange={e => { onDesiredLuxChange(+e.target.value); e.target.blur() }}
          className="w-full pl-24 pr-10 py-2.5 border rounded-lg text-center"
          style={{textAlignLast: 'center'}}
        >
          {Array.from({length:(1000-50)/50+1},(_,i)=>50+i*50).map(v=>(
            <option key={v} value={v}>{v} lx</option>
          ))}
        </select>
      </div>

      {/* 공간 유형 */}
      <div className="space-y-1">
        <p className="text-center font-medium">공간 유형</p>
        <div className="grid grid-cols-4 gap-2">
          {SPACE_FIRST_ROW.map(n => {
            const t = SPACE_TYPES.find(s => s.name === n)!
            return (
              <button key={n} type="button"
                onClick={(e) => { e.preventDefault(); onSpaceTypeChange(t); onDesiredLuxChange(t.lux) }}
                className={`px-1.5 py-1 rounded-lg text-xs transition
                  ${spaceType.name === n
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}>
                {n}<br/>( {t.lux} )
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SPACE_SECOND_ROW.map(n => {
            const t = SPACE_TYPES.find(s => s.name === n)!
            return (
              <button key={n} type="button"
                onClick={(e) => { e.preventDefault(); onSpaceTypeChange(t); onDesiredLuxChange(t.lux) }}
                className={`px-1.5 py-1 rounded-lg text-xs transition
                  ${spaceType.name === n
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}>
                {n}<br/>( {t.lux} )
              </button>
            )
          })}
        </div>
        <p className="text-[0.65rem] text-gray-500 text-center pt-1">
          공간별 MF 자동 적용 (주방 0.70 · 일반 F&B 0.80 · 청결 0.85)
        </p>
      </div>

      <p className="text-center text-[0.65rem] text-gray-500 leading-relaxed">
        참고: 거실(200~300), 주방(500~700), 침실(150~250), 욕실(500~700),<br/>
        서재(300~500), 현관/복도(100~200), 드레스룸(300~500), 다이닝룸(300~500)
      </p>
    </section>
  )
}
