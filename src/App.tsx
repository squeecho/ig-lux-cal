import { useEffect, useMemo, useState } from 'react'
import './App.css'

import { SPACE_TYPES } from './data/lights'
import { calcSummary, stripLeadingZeros } from './lib/lighting'
import { saveDraft, loadDraft } from './lib/draft'
import { loadConfirmMessage, deleteConfirmMessage } from './lib/overwriteGuard'
import type { Light, SavedCustomLight, SavedResult, SpaceType, InteriorTone } from './types'

import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { SpaceInput } from './components/SpaceInput'
import { LightPicker } from './components/LightPicker'
import { CustomLight } from './components/CustomLight'
import { SavedLights } from './components/SavedLights'
import { ResultCard } from './components/ResultCard'
import { SelectedList } from './components/SelectedList'
import { SavedResults } from './components/SavedResults'

const LS_KEY_LIGHTS  = 'iggg-lux:customLights'
const LS_KEY_RESULTS = 'iggg-lux:savedResults'

function App() {
  /* ───────── 공간 정보 ───────── */
  const [area, setArea] = useState<string>('20')
  const [height, setHeight] = useState<string>('2500')
  const [spaceType, setSpaceType] = useState<SpaceType>(SPACE_TYPES[1]) // 카페
  const [desiredLux, setDesiredLux] = useState<number>(spaceType.lux)
  const [tone, setTone] = useState<InteriorTone>('normal')

  /* ───────── 조명 / 결과 ───────── */
  const [selectedLights, setSelectedLights] = useState<Light[]>([])
  const [savedCustomLights, setSavedCustomLights] = useState<SavedCustomLight[]>([])
  const [savedResults, setSavedResults] = useState<SavedResult[]>([])
  const [resultName, setResultName] = useState<string>('')

  /* ───────── localStorage 로드 (초기 1회) ───────── */
  useEffect(() => {
    try {
      const sl = localStorage.getItem(LS_KEY_LIGHTS)
      if (sl) setSavedCustomLights(JSON.parse(sl))
    } catch (e) { console.error('customLights 로드 실패:', e) }
    try {
      const sr = localStorage.getItem(LS_KEY_RESULTS)
      if (sr) setSavedResults(JSON.parse(sr))
    } catch (e) { console.error('savedResults 로드 실패:', e) }
    // ⚠작업 중이던 입력 복원(감사 2026-07-29 #151). 예전엔 자동저장도 이탈
    //   경고도 없어 새로고침 한 번에 작업이 전소됐다. 저장한 목록만 남고
    //   '지금 만들던 것'은 아무 데도 없었다.
    const d = loadDraft(localStorage)
    if (d) {
      setArea(d.area)
      setHeight(d.height)
      setDesiredLux(d.desiredLux)
      setTone(d.tone as InteriorTone)
      setSelectedLights(d.selectedLights as Light[])
      const st = SPACE_TYPES.find(x => x.name === d.spaceTypeName)
      if (st) setSpaceType(st)
    }
  }, [])

  /* ───────── 작업 중 입력 자동저장 (감사 #151) ─────────
     계산 결과는 파생이라 담지 않는다 — 저장했다가 계산식이 바뀌면 낡은 값을
     되살리게 된다. 저장 실패(용량 초과·시크릿 모드)는 조용히 넘긴다. */
  useEffect(() => {
    saveDraft(localStorage, {
      area, height, spaceTypeName: spaceType.name, desiredLux, tone,
      selectedLights,
    }, new Date().toISOString())
  }, [area, height, spaceType, desiredLux, tone, selectedLights])

  /* ───────── 계산 (실시간) ───────── */
  const summary = useMemo(() => calcSummary({
    lights: selectedLights,
    area_m2: Number(area) || 0,
    height_mm: Number(height) || 0,
    tone,
    spaceType,
  }), [selectedLights, area, height, tone, spaceType])

  /* ───────── 핸들러: 공간 입력 ───────── */
  const onAreaChange   = (v: string) => setArea(stripLeadingZeros(v))
  const onHeightChange = (v: string) => setHeight(stripLeadingZeros(v))

  /* ───────── 핸들러: 조명 선택 ───────── */
  const addLight = (light: Light) => {
    setSelectedLights(prev => {
      // 동일 조명 + 동일 색온도면 수량만 합산
      const idx = prev.findIndex(l => l.name === light.name && l.colorTemp === light.colorTemp)
      if (idx >= 0) {
        const arr = [...prev]
        arr[idx] = { ...arr[idx], quantity: arr[idx].quantity + light.quantity }
        return arr
      }
      return [...prev, light]
    })
  }
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { setSelectedLights(p => p.filter(l => l.id !== id)); return }
    setSelectedLights(p => p.map(l => l.id === id ? { ...l, quantity: qty } : l))
  }
  const removeLight = (id: string) => setSelectedLights(p => p.filter(l => l.id !== id))

  /* ───────── 핸들러: 커스텀 조명 저장/로드/삭제 ───────── */
  const saveCustomLight = (light: SavedCustomLight) => {
    setSavedCustomLights(prev => {
      const next = [...prev, light]
      localStorage.setItem(LS_KEY_LIGHTS, JSON.stringify(next))
      return next
    })
  }
  const deleteSavedLight = (id: string) => {
    setSavedCustomLights(prev => {
      const next = prev.filter(l => l.id !== id)
      localStorage.setItem(LS_KEY_LIGHTS, JSON.stringify(next))
      return next
    })
  }

  /* ───────── 핸들러: 결과 저장/로드/삭제 ───────── */
  const canSaveResult = !!area && !!height && !!desiredLux && selectedLights.length > 0
  const saveCurrentResult = () => {
    if (!canSaveResult) return
    const newResult: SavedResult = {
      id: crypto.randomUUID(),
      name: resultName || `조도 결과 ${new Date().toLocaleDateString()}`,
      area, height, desiredLux,
      expectedLux: summary.expectedLux,
      totalLumen: summary.totalLumen,
      totalWatt: summary.totalWatt,
      interiorTone: tone,
      spaceTypeName: spaceType.name,
      lights: [...selectedLights],
    }
    setSavedResults(prev => {
      const next = [newResult, ...prev]
      localStorage.setItem(LS_KEY_RESULTS, JSON.stringify(next))
      return next
    })
    setResultName('')
  }
  const loadResult = (r: SavedResult) => {
    // ⚠불러오기는 **현재 작업을 전부 덮어쓴다**. 작업 중일 때만 묻는다 —
    //   빈 화면에서까지 확인창을 띄우면 읽지 않고 누르는 습관이 든다(감사 #150).
    const warn = loadConfirmMessage({ selectedLights }, r.name)
    if (warn && !window.confirm(warn)) return
    setArea(r.area); setHeight(r.height); setDesiredLux(r.desiredLux)
    setTone(r.interiorTone || 'normal')
    const sp = SPACE_TYPES.find(s => s.name === r.spaceTypeName)
    if (sp) setSpaceType(sp)
    setSelectedLights([...r.lights])
  }
  const deleteResult = (id: string) => {
    // 삭제는 되돌릴 수 없고 불러오기 버튼 바로 옆이라 오탭이 쉽다 — 항상 묻는다.
    const target = savedResults.find(r => r.id === id)
    if (!window.confirm(deleteConfirmMessage(target?.name))) return
    setSavedResults(prev => {
      const next = prev.filter(r => r.id !== id)
      localStorage.setItem(LS_KEY_RESULTS, JSON.stringify(next))
      return next
    })
  }

  /* ───────── 렌더 ───────── */
  return (
    <div onClick={(e) => e.preventDefault()}
      className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800 leading-snug px-4 py-12">
      <div className="w-full max-w-md mx-auto space-y-12">
        <Hero />

        <SpaceInput
          area={area} height={height} desiredLux={desiredLux}
          spaceType={spaceType} tone={tone}
          onAreaChange={onAreaChange}
          onHeightChange={onHeightChange}
          onDesiredLuxChange={setDesiredLux}
          onSpaceTypeChange={(st) => { setSpaceType(st); setDesiredLux(st.lux) }}
          onToneChange={setTone}
        />

        <LightPicker onAdd={addLight} />

        <CustomLight
          onAdd={addLight}
          onSaveCustom={saveCustomLight}
        />

        <SavedLights
          saved={savedCustomLights}
          onLoad={addLight}
          onDelete={deleteSavedLight}
        />

        <ResultCard
          summary={summary}
          desiredLux={desiredLux}
          resultName={resultName}
          canSave={canSaveResult}
          onResultNameChange={setResultName}
          onSave={saveCurrentResult}
        />

        <SelectedList
          lights={selectedLights}
          onUpdateQty={updateQty}
          onRemove={removeLight}
        />

        <SavedResults
          results={savedResults}
          onLoad={loadResult}
          onDelete={deleteResult}
        />

        <p className="text-center text-[0.65rem] text-gray-500 leading-relaxed">
          E = (Σ lm × adj) × UF × MF / A &nbsp;|&nbsp;
          UF = baseUF(K) × tone &nbsp;|&nbsp;
          K = √A / (2·(h−0.8m)) &nbsp;|&nbsp;
          adj = 0.7 (간접조명)
        </p>

        <Footer />
      </div>
    </div>
  )
}

export default App
