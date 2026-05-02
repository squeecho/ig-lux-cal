import { useState } from 'react'
import type { SavedResult } from '../types'

interface Props {
  results: SavedResult[]
  onLoad: (r: SavedResult) => void
  onDelete: (id: string) => void
}

export function SavedResults({ results, onLoad, onDelete }: Props) {
  const [open, setOpen] = useState(false)

  if (results.length === 0) return null

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-4">
      <h2 className="text-xl font-semibold text-center">저장된 조도 결과</h2>

      <div className="flex justify-center mb-4">
        <button type="button"
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-lg bg-green-600 text-white transition hover:bg-green-700">
          저장된 결과 {open ? '닫기' : '목록 보기'} ({results.length})
        </button>
      </div>

      {open && (
        <div className="space-y-4">
          {results.map(r => (
            <div key={r.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col space-y-2">
                <p className="text-center font-semibold bg-amber-50 border border-amber-200 rounded-lg py-2 px-4 mx-auto mb-2">
                  {r.name}
                </p>
                <div className="flex justify-between text-sm">
                  <span>면적: <span className="number-font">{r.area}</span> m²</span>
                  <span>높이: <span className="number-font">{r.height}</span> mm</span>
                  <span>목표: <span className="number-font">{r.desiredLux}</span> lx</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-center font-medium">
                  예상 조도: <span className="text-lg font-bold number-font">{r.expectedLux}</span> lx
                </p>
                <div className="flex justify-center gap-6 text-sm mt-1">
                  <span>총 <span className="number-font">{r.totalLumen.toLocaleString()}</span> lm</span>
                  <span>총 <span className="number-font">{r.totalWatt.toLocaleString()}</span> W</span>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto border-t pt-2 scrollbar-thin">
                <p className="text-sm font-medium mb-1">선택된 조명</p>
                {r.lights.map(l => (
                  <div key={l.id} className="text-xs flex justify-between py-1 border-b">
                    <span className="truncate max-w-[60%]">{l.name} ({l.colorTemp})</span>
                    <span className="number-font">{l.quantity}개</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => onLoad(r)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                  불러오기
                </button>
                <button type="button" onClick={() => onDelete(r.id)}
                  className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
