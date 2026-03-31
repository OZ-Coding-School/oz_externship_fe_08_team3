import { useState, useRef, useEffect, useId } from 'react'
import { ChevronIcon, CheckIcon } from './icons'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** "기타(직접입력)" 등 자유입력 옵션의 value. 선택 시 textarea가 표시된다 */
  freeInputValue?: string
  /** 자유입력 텍스트 */
  freeInputText?: string
  onFreeInputChange?: (text: string) => void
  /** 자유입력 placeholder */
  freeInputPlaceholder?: string
  /** 자유입력 최대 글자수 */
  freeInputMaxLength?: number
  className?: string
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = '해당되는 항목을 선택해 주세요.',
  disabled = false,
  freeInputValue,
  freeInputText = '',
  onFreeInputChange,
  freeInputPlaceholder = '탈퇴 사유를 입력해주세요.',
  freeInputMaxLength = 100,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [textareaFocused, setTextareaFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const baseId = useId()

  const selectedOption = options.find((o) => o.value === value)
  const showFreeInput = freeInputValue != null && value === freeInputValue

  // 외부 클릭하는 경우 종료
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || highlightIndex < 0) return
    const item = listboxRef.current?.children[highlightIndex] as
      | HTMLElement
      | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, highlightIndex])

  const toggle = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
    setHighlightIndex(-1)
  }

  const select = (opt: DropdownOption) => {
    onChange?.(opt.value)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightIndex >= 0) {
          select(options[highlightIndex])
        } else {
          toggle()
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightIndex(0)
        } else {
          setHighlightIndex((prev) => Math.min(prev + 1, options.length - 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      ref={containerRef}
      className={['relative w-full', className].filter(Boolean).join(' ')}
    >
      {/* Trigger */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${baseId}-listbox`}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={[
          'flex h-12 w-full items-center justify-between rounded-sm border px-4 py-2.5 text-sm transition-colors duration-150 outline-none',
          disabled
            ? 'cursor-not-allowed border-gray-400 bg-gray-200 text-gray-400'
            : isOpen
              ? 'border-gray-500 bg-white text-gray-900'
              : value
                ? 'border-gray-400 bg-white text-gray-900'
                : 'border-gray-400 bg-white text-gray-400',
          !disabled &&
            'focus-visible:ring-primary hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-1',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className={[
            'truncate tracking-tight',
            showFreeInput ? 'max-w-[80%] overflow-hidden text-ellipsis' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {/* Option list */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${baseId}-listbox`}
          role="listbox"
          aria-label={placeholder}
          className="absolute right-0 left-0 z-40 mt-2 max-h-60 overflow-y-auto rounded-sm border border-gray-500 bg-white py-1 shadow-lg"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            const isHighlighted = i === highlightIndex

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => select(opt)}
                onMouseEnter={() => setHighlightIndex(i)}
                className={[
                  'mx-1 flex h-12 cursor-pointer items-center justify-between rounded-sm px-3 py-2.5 text-sm tracking-tight transition-colors duration-100',
                  isSelected
                    ? 'text-primary font-semibold'
                    : 'font-normal text-gray-900',
                  isHighlighted && !isSelected ? 'bg-primary-100' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <CheckIcon />}
              </li>
            )
          })}
        </ul>
      )}

      {/* Free input textarea — Figma node 1:2809 (Text Box) */}
      {showFreeInput && (
        <div className="mt-2 flex flex-col gap-1.5">
          <div
            className={[
              'rounded-sm border transition-colors duration-150',
              textareaFocused ? 'border-gray-500' : 'border-gray-400',
            ].join(' ')}
          >
            <textarea
              value={freeInputText}
              onChange={(e) => {
                if (e.target.value.length <= freeInputMaxLength) {
                  onFreeInputChange?.(e.target.value)
                }
              }}
              onFocus={() => setTextareaFocused(true)}
              onBlur={() => setTextareaFocused(false)}
              placeholder={freeInputPlaceholder}
              maxLength={freeInputMaxLength}
              rows={4}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed tracking-tight text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <p
            className={[
              'text-right text-xs tracking-tight',
              freeInputText.length > 0 ? 'text-gray-500' : 'text-gray-400',
            ].join(' ')}
          >
            {freeInputText.length}/{freeInputMaxLength}
          </p>
        </div>
      )}
    </div>
  )
}
