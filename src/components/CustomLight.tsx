import { useState } from 'react'
import { CUSTOM_LIGHT_TYPES } from '../data/lights'
import { getLumensPerWatt } from '../lib/lighting'
import type { Light, SavedCustomLight } from '../types'

interface Props {
  onAdd: (light: Light) => void
  onSaveCustom: (light: SavedCustomLight) => void
}

type Mode = 'lumen' | 'watt'

export function CustomLight({ onAdd, onSaveCustom }: Props) {
  const [mode, setMode] = useState<Mode>('lumen')
  const [name, setName] = useState('')
  const [lumen, setLumen] = useState(0)
  const [watt, setWatt] = useState(0)
  const [type, setType] = useState('매립조명')
  const [efficiency, setEfficiency] = useState<number>(80)
  const [efficiencyError, setEfficiencyError] = useState('')

  const canSubmit = !!name && lumen > 0 && watt > 0

  // 루멘 모드: 루멘 입력 → 와트 자동 계산 (90lm/W 고정 가정)
  const onLumenChange = (v: number) => {
    setLumen(v)
    setWatt(v > 0 ? Math.round((v / 90) * 10) / 10 : 0)
  }

  // 와트 모드: 와트 입력 → 루멘 자동 계산 (선택된 조명 종류의 효율 적용)
  const onWattChange = (v: number) => {
    setWatt(v)
    const eff = type === '기타'
      ? (efficiency < 40 || efficiency > 200 ? 80 : efficiency)
      : getLumensPerWatt(type)
    setLumen(v * eff)
  }

  const onTypeChange = (t: string) => {
    setType(t)
    if (t !== '기타') setEfficiencyError('')
    if (watt > 0) {
      const eff = t === '기타' ? efficiency : getLumensPerWatt(t)
      setLumen(watt * eff)
    }
  }

  const onEfficiencyChange = (v: number) => {
    setEfficiency(v)
    if (v < 40 || v > 200) {
      setEfficiencyError('40~200 사이의 값을 입력하세요.')
    } else {
      setEfficiencyError('')
      if (watt > 0) setLumen(watt * v)
    }
  }

  const handleAdd = () => {
    if (!canSubmit) return
    const finalLumen = type === '기타' && (efficiency < 40 || efficiency > 200 || efficiency === 0)
      ? watt * 80
      : lumen
    onAdd({
      id: Date.now().toString(),
      name,
      lumen: finalLumen,
      watt,
      colorTemp: '커스텀',
      size: '커스텀',
      quantity: 1,
      category: mode === 'watt' ? type : '루멘 기준 커스텀',
      type: '커스텀',
    })
    setName(''); setLumen(0); setWatt(0)
  }

  const handleSave = () => {
    if (!canSubmit) return
    onSaveCustom({
      id: Date.now().toString(),
      name,
      lumen,
      watt,
      type,
      efficiency: type === '기타' ? efficiency : undefined,
    })
  }

  const currentEff = type === '기타'
    ? (efficiency < 40 || efficiency > 200 || efficiency === 0 ? 80 : efficiency)
    : getLumensPerWatt(type)

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-semibold text-center">커스텀 조명</h2>

      {/* 모드 탭 */}
      <div className="flex justify-center gap-2">
        <button type="button"
          onClick={() => setMode('lumen')}
          className={`px-4 py-2 rounded-lg transition
            ${mode === 'lumen' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}>
          루멘 입력
        </button>
        <button type="button"
          onClick={() => setMode('watt')}
          className={`px-4 py-2 rounded-lg transition
            ${mode === 'watt' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}>
          와트기반 자동계산(추정치)
        </button>
      </div>

      {mode === 'lumen' ? (
        <div className="grid grid-cols-1 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">이름</span>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 border rounded-lg text-center" />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">루멘</span>
            <input type="number" min={1} value={lumen || ''}
              onChange={e => onLumenChange(+e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 border rounded-lg text-center number-font" />
          </div>
          {lumen > 0 && (
            <p className="text-gray-500 text-sm">자동 계산된 와트: <span className="number-font">{watt}</span> W (효율 90lm/W 기준)</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">조명 종류</span>
            <select value={type} onChange={e => onTypeChange(e.target.value)}
              className="w-full pl-24 pr-10 py-2.5 border rounded-lg text-center">
              {CUSTOM_LIGHT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label} ({t.desc})</option>
              ))}
            </select>
          </div>

          {type === '기타' && (
            <div className="relative">
              <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">광효율</span>
              <input type="number" min="40" max="200" placeholder="40~200 사이 값"
                value={efficiency || ''}
                onChange={e => onEfficiencyChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                className={`w-full pl-14 pr-4 py-2.5 border rounded-lg text-center number-font ${efficiencyError ? 'border-red-500' : ''}`} />
              {efficiencyError && <p className="text-red-500 text-xs mt-1">{efficiencyError}</p>}
            </div>
          )}

          <div className="relative">
            <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">이름</span>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 border rounded-lg text-center" />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">와트</span>
            <input type="number" min={1} value={watt || ''}
              onChange={e => onWattChange(+e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 border rounded-lg text-center number-font" />
          </div>

          {watt > 0 && (
            <p className="text-gray-500 text-sm">
              자동 계산된 루멘: <span className="number-font">{lumen}</span> lm
              (기준 광효율: <span className="number-font">{currentEff}</span> lm/W)
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={handleAdd} disabled={!canSubmit}
          className="flex-1 py-2 rounded-lg bg-purple-600 text-white disabled:bg-gray-400">
          {mode === 'lumen' ? '루멘 기준 조명 추가' : '와트기반 조명 추가'}
        </button>
        <button type="button" onClick={handleSave} disabled={!canSubmit}
          className="flex-1 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-400">
          조명 정보 저장
        </button>
      </div>
    </section>
  )
}
