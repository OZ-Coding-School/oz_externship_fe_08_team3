import { forwardRef, useState } from 'react'
import { SearchIcon, ClearIcon } from './icons'

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value,
      onValueChange,
      onClear,
      placeholder = '질문 검색',
      className = '',
      ...props
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false)
    const hasValue = Boolean(value)

    const handleClear = () => {
      onValueChange?.('')
      onClear?.()
    }

    return (
      <div
        className={[
          'flex items-center gap-2 px-3 py-2.5 rounded-full border bg-gray-50 transition-colors duration-150',
          focused
            ? 'border-primary'
            : 'border-gray-400',
          className,
        ].filter(Boolean).join(' ')}
      >
        <span className="shrink-0 flex items-center">
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
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none tracking-tight min-w-0"
          {...props}
        />

        {hasValue && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-150 cursor-pointer"
          >
            <ClearIcon />
          </button>
        )}
      </div>
    )
  },
)

export default SearchInput
