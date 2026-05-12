import { useState } from 'react'
import { SearchIcon, ClearIcon } from './icons'

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  value?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
  ref?: React.Ref<HTMLInputElement>
}

export function SearchInput({
  value,
  onValueChange,
  onClear,
  placeholder = '질문 검색',
  className = '',
  ref,
  ...props
}: SearchInputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = Boolean(value)

  const handleClear = () => {
    onValueChange?.('')
    onClear?.()
  }

  return (
    <div
      className={[
        'flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-2.5 transition-colors duration-150',
        focused ? 'border-primary' : 'border-gray-400',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="flex shrink-0 items-center">
        <SearchIcon />
      </span>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label="검색"
        className="min-w-0 flex-1 bg-transparent text-sm tracking-tight text-gray-900 outline-none placeholder:text-gray-400"
        {...props}
      />

      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색어 지우기"
          className="focus-visible:ring-primary shrink-0 cursor-pointer rounded-full text-gray-400 transition-colors duration-150 hover:text-gray-600 focus-visible:ring-2 focus-visible:outline-none"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
}
