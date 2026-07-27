import { useState } from 'react'
import type { Light, SavedCustomLight } from '../types'

interface Props {
  saved: SavedCustomLight[]
  onLoad: (light: Light) => void
  onDelete: (id: string) => void
}

export function SavedLights({ saved, onLoad, onDelete }: Props) {
  const [open, setOpen] = useState(false)

  if (saved.length === 0) return null

  const handleLoad = (light: SavedCustomLight) => {
    onLoad({
      id: crypto.randomUUID(),
      name: light.name,
      lumen: light.lumen,
      watt: light.watt,
      colorTemp: '커스텀',
      size: '커스텀',
      quantity: 1,
      // 저장 시점의 계산 카테고리를 그대로 복원 — 구 저장분(category 없음)만 type 폴백
      category: light.category ?? (light.type === '기타' ? '루멘 기준 커스텀' : light.type),
      type: '커스텀',
    })
    setOpen(false)
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-semibold text-center">저장된 조명 불러오기</h2>

      <div className="flex justify-center mb-4">
        <button type="button"
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-lg bg-green-600 text-white transition hover:bg-green-700">
          저장된 조명 {open ? '닫기' : '목록 보기'} ({saved.length})
        </button>
      </div>

      {open && (
        <div className="border rounded-lg p-3 max-h-80 overflow-y-auto">
          <p className="text-center text-sm font-medium mb-2">저장된 조명 목록</p>
          <div className="space-y-2">
            {saved.map(light => (
              <div key={light.id}
                onClick={() => handleLoad(light)}
                className="flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium">{light.name}</p>
                  <p className="text-xs text-gray-500 number-font">
                    {light.lumen} lm | {light.watt} W | <span style={{fontFamily:'inherit'}}>{light.type}</span>
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(light.id) }}
                  className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50">
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
