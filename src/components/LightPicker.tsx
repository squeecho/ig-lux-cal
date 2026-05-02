import { useEffect, useState } from 'react'
import { LIGHT_CATALOG, LIGHT_CATEGORIES, T20_TYPES } from '../data/lights'
import type { Light, LightData } from '../types'

interface Props {
  onAdd: (light: Light) => void
}

export function LightPicker({ onAdd }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('다운라이트')
  const [selectedT20Type, setSelectedT20Type] = useState<string>('')
  const [colorTempByName, setColorTempByName] = useState<Record<string, string>>({})
  const [qtyByName, setQtyByName] = useState<Record<string, number | string>>({})

  // 카테고리 변경 시 T20/선택 초기화
  useEffect(() => {
    setSelectedT20Type('')
    setColorTempByName({})
    setQtyByName({})
  }, [selectedCategory])

  // T20 타입 변경 시 선택 초기화
  useEffect(() => {
    if (selectedCategory === 'T20 마그네틱') {
      setColorTempByName({})
      setQtyByName({})
    }
  }, [selectedT20Type, selectedCategory])

  const filtered = LIGHT_CATALOG.filter(l => l.category === selectedCategory)
  const visible = selectedCategory === 'T20 마그네틱'
    ? (selectedT20Type ? filtered.filter(l => l.type === selectedT20Type) : [])
    : filtered

  const handleAdd = (light: LightData) => {
    const ct = colorTempByName[light.name]
    if (!ct || !light.lumenByColorTemp[ct]) return
    const qty = Number(qtyByName[light.name] || 1)
    if (qty <= 0) return
    onAdd({
      id: `${light.name}-${ct}-${Date.now()}`,
      name: light.name,
      lumen: light.lumenByColorTemp[ct],
      watt: light.watt,
      colorTemp: ct,
      size: light.size,
      quantity: qty,
      category: light.category,
      type: light.type,
      thumbnail: light.thumbnail,
    })
    setColorTempByName(p => { const n = { ...p }; delete n[light.name]; return n })
    setQtyByName(p => { const n = { ...p }; delete n[light.name]; return n })
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-semibold text-center">조명 선택</h2>

      {/* 카테고리 */}
      <div className="flex flex-wrap gap-3 justify-center">
        {LIGHT_CATEGORIES.map(cat => (
          <button key={cat} type="button"
            onClick={(e) => { e.preventDefault(); setSelectedCategory(cat) }}
            className={`px-3 py-1.5 rounded-lg text-sm transition
              ${selectedCategory === cat
                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* T20 타입 */}
      {selectedCategory === 'T20 마그네틱' && (
        <div className="pt-2">
          <p className="text-center font-medium mb-3">타입 선택</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {T20_TYPES.map(type => (
              <button key={type} type="button"
                onClick={(e) => { e.preventDefault(); setSelectedT20Type(type) }}
                className={`px-3 py-1.5 rounded-lg text-sm transition
                  ${selectedT20Type === type
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 조명 카드 */}
      <div className="space-y-6">
        {visible.map(light => {
          const selectedCT = colorTempByName[light.name]
          const qty = qtyByName[light.name] ?? 1
          return (
            <div key={light.name} className="border rounded-xl p-4 space-y-4">
              {/* 썸네일 + 이름 */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-2 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                  {light.thumbnail
                    ? <img src={light.thumbnail} alt={light.name} className="w-full h-auto object-contain" />
                    : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">이미지 없음</div>}
                </div>
                <p className="text-center font-medium">{light.name}</p>
                <p className="text-center text-sm text-gray-500">{light.watt}W / {light.size}</p>
              </div>

              {/* 색온도 선택 */}
              <div className="flex flex-wrap gap-2 justify-center">
                {light.colorTemps.map(ct => {
                  const sel = selectedCT === ct
                  return (
                    <button key={ct} type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setColorTempByName(p => ({ ...p, [light.name]: ct }))
                        setQtyByName(p => ({ ...p, [light.name]: 1 }))
                      }}
                      className={`w-20 px-2 py-1 rounded-lg text-xs leading-snug transition
                        ${sel
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'}`}>
                      {ct}<br/>{light.lumenByColorTemp[ct]} lm
                    </button>
                  )
                })}
              </div>

              {/* 수량 + 추가 버튼 */}
              {selectedCT && (
                <div className="flex flex-col items-center gap-2 pt-4 border-t">
                  <div className="flex items-center">
                    <button type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setQtyByName(p => {
                          const cur = Number(p[light.name] || 1)
                          return { ...p, [light.name]: Math.max(1, cur - 1) }
                        })
                      }}
                      className="w-9 h-9 border rounded-l text-gray-700">−</button>
                    <input
                      value={qty}
                      inputMode="numeric"
                      onChange={e => {
                        const v = e.target.value.replace(/[^0-9]/g, '')
                        setQtyByName({ ...qtyByName, [light.name]: v ? Number(v) : 1 })
                      }}
                      onFocus={e => e.target.select()}
                      className="w-12 h-9 border-y text-center number-font"
                    />
                    <button type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setQtyByName(p => {
                          const cur = Number(p[light.name] || 1)
                          return { ...p, [light.name]: cur + 1 }
                        })
                      }}
                      className="w-9 h-9 border rounded-r text-gray-700">＋</button>
                  </div>

                  <button type="button"
                    onClick={(e) => { e.preventDefault(); handleAdd(light) }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    추가
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
