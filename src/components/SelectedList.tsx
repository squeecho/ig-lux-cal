import { QtyAdjust } from './NumberInput'
import type { Light } from '../types'

interface Props {
  lights: Light[]
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

export function SelectedList({ lights, onUpdateQty, onRemove }: Props) {
  const total = lights.reduce((s, l) => s + l.quantity, 0)

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-semibold text-center">선택된 조명</h2>

      {lights.length === 0 ? (
        <p className="text-center text-gray-500">없음</p>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin">
            {lights.map(l => (
              <div key={l.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4 border-b py-3">
                <button type="button"
                  onClick={(e) => { e.preventDefault(); onRemove(l.id) }}
                  className="px-2 sm:px-3 py-1 rounded text-red-600 border border-red-200 hover:bg-red-50 whitespace-nowrap">
                  삭제
                </button>

                <div className="min-w-0 pr-1">
                  <p className="font-medium truncate max-w-[120px] sm:max-w-full">{l.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {l.colorTemp === '커스텀'
                      ? <><span className="number-font">{l.lumen}</span> lm | <span className="number-font">{l.watt}</span> W</>
                      : <>{l.colorTemp} | <span className="number-font">{l.watt}</span> W</>}
                  </p>
                </div>

                <div className="w-[90px] sm:w-32">
                  <QtyAdjust
                    value={l.quantity}
                    onChange={(v) => v < 1 ? onRemove(l.id) : onUpdateQty(l.id, v)}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-right text-sm text-gray-600">
            총 <span className="number-font">{total}</span>개
          </p>
        </>
      )}
    </section>
  )
}
