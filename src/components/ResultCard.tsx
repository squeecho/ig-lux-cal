import type { CalcSummary } from '../lib/lighting'

interface Props {
  summary: CalcSummary
  desiredLux: number
  resultName: string
  canSave: boolean
  onResultNameChange: (v: string) => void
  onSave: () => void
}

export function ResultCard({
  summary, desiredLux, resultName, canSave,
  onResultNameChange, onSave,
}: Props) {
  const ratio = desiredLux > 0 ? summary.expectedLux / desiredLux : 0
  const percent = Math.round(ratio * 100)
  const reached = ratio >= 1

  return (
    <section className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-semibold text-center">조도 결과</h2>

      <div className={`p-4 rounded-lg text-center border
        ${reached ? 'bg-green-50' : 'bg-yellow-50'}`}>
        <p className="text-4xl font-bold number-font">{summary.expectedLux.toLocaleString()} lx</p>
        <p className="mt-2 text-lg font-medium">
          목표 <span className="number-font">{desiredLux.toLocaleString()}</span> lx
        </p>

        {desiredLux > 0 && (
          <>
            <div className="mt-4 w-full bg-gray-200 h-3 rounded overflow-hidden">
              <div
                style={{width: reached ? '100%' : `${percent}%`}}
                className={`${reached ? 'bg-green-500' : 'bg-yellow-400'} h-3 rounded`}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">달성률 <span className="number-font">{percent}</span>%</p>
          </>
        )}
      </div>

      {/* 계산 변수 노출 (검증/이해도 향상) */}
      <div className="grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
        <div className="p-2 border rounded">
          <p className="text-[0.6rem] uppercase tracking-wider">UF</p>
          <p className="text-sm number-font">{summary.uf.toFixed(2)}</p>
        </div>
        <div className="p-2 border rounded">
          <p className="text-[0.6rem] uppercase tracking-wider">MF</p>
          <p className="text-sm number-font">{summary.mf.toFixed(2)}</p>
        </div>
        <div className="p-2 border rounded">
          <p className="text-[0.6rem] uppercase tracking-wider">실지수 K</p>
          <p className="text-sm number-font">{summary.K.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span>총 <span className="number-font">{summary.totalLumen.toLocaleString()}</span> lm</span>
        <span>총 <span className="number-font">{summary.totalWatt.toLocaleString()}</span> W</span>
      </div>

      {/* 결과 저장 */}
      <div className="flex justify-center gap-2">
        <input type="text" placeholder="저장할 이름 (선택사항)"
          value={resultName}
          onChange={e => onResultNameChange(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg" />
        <button type="button"
          onClick={onSave}
          disabled={!canSave}
          className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-400 transition hover:bg-green-700 whitespace-nowrap">
          조도 결과 저장
        </button>
      </div>
    </section>
  )
}
