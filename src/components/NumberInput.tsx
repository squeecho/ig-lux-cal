interface NumberInputProps {
  value: string | number
  onChange: (v: string) => void
  label?: string
  unit?: string
  min?: number
  /** 단계 (기본 1) */
  step?: number
  /** 입력 모드 'numeric' (기본) — 모바일 숫자 키보드 */
  inputMode?: 'numeric' | 'decimal'
  /** 너비 클래스 (기본 w-full) */
  className?: string
}

/**
 * +/- 버튼이 양옆에 붙은 숫자 입력 컴포넌트.
 * 면적/높이/조명 수량 등에서 공통 사용.
 */
export function NumberInput({
  value, onChange, label, unit,
  min = 0, step = 1,
  inputMode = 'numeric',
  className = '',
}: NumberInputProps) {
  const num = Number(value || 0)

  return (
    <div className={`relative ${className}`}>
      {label && (
        <span className="absolute left-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">
          {label}
        </span>
      )}

      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={e => onChange(e.target.value.replace(/^0+(?=\d)/, ''))}
        onFocus={e => e.target.select()}
        className="w-full pl-14 pr-14 py-2.5 border rounded-lg text-center number-font"
      />

      {/* − 버튼 */}
      <div className="absolute left-14 top-0 h-full flex items-center">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(String(Math.max(min, num - step))) }}
          className="h-[40px] px-2 flex items-center justify-center border rounded text-gray-700"
          aria-label="감소"
        >−</button>
      </div>

      {/* + 버튼 */}
      <div className="absolute right-14 top-0 h-full flex items-center">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(String(num + step)) }}
          className="h-[40px] px-2 flex items-center justify-center border rounded text-gray-700"
          aria-label="증가"
        >＋</button>
      </div>

      {unit && (
        <span className="absolute right-3 top-0 h-full flex items-center text-gray-500 pointer-events-none z-10">
          {unit}
        </span>
      )}
    </div>
  )
}

/** 작은 사이즈의 +/- 수량 조절 (선택된 조명 목록 등에서 사용) */
interface QtyAdjustProps {
  value: number
  onChange: (v: number) => void
  size?: 'md' | 'sm'
  min?: number
}

export function QtyAdjust({ value, onChange, size = 'md', min = 1 }: QtyAdjustProps) {
  const wBtn = size === 'sm' ? 'w-7 h-9 sm:w-9' : 'w-9 h-9'
  const wInp = size === 'sm' ? 'w-10 h-9 sm:w-12' : 'w-12 h-9'

  return (
    <div className="flex items-center justify-center gap-px">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onChange(Math.max(min, value - 1)) }}
        className={`${wBtn} border rounded-l text-gray-700`}
        aria-label="감소"
      >−</button>
      <input
        value={value}
        inputMode="numeric"
        onChange={e => {
          const v = e.target.value.replace(/[^0-9]/g, '')
          onChange(v ? Number(v) : min)
        }}
        onFocus={e => e.target.select()}
        className={`${wInp} border-y text-center number-font`}
      />
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onChange(value + 1) }}
        className={`${wBtn} border rounded-r text-gray-700`}
        aria-label="증가"
      >＋</button>
    </div>
  )
}
