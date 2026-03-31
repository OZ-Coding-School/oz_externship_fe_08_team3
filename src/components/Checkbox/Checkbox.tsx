import { forwardRef, useId } from 'react'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  /** Visually hide the label (still read by screen readers) */
  hideLabel?: boolean
  isError?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, hideLabel = false, isError = false, id: idProp, className = '', disabled, ...props },
    ref,
  ) {
    const generatedId = useId()
    const checkboxId = idProp ?? generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={[
          'inline-flex items-center gap-2 cursor-pointer select-none group',
          disabled ? 'opacity-60 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={isError}
          className={[
            'w-4 h-4 rounded border appearance-none cursor-pointer transition-colors duration-150 outline-none shrink-0',
            'checked:bg-primary checked:border-primary',
            isError
              ? 'border-error focus-visible:ring-2 focus-visible:ring-error'
              : 'border-border-base focus-visible:ring-2 focus-visible:ring-primary',
            disabled ? 'cursor-not-allowed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        <span
          className={[
            'text-sm text-text-body leading-none',
            hideLabel ? 'sr-only' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </span>
      </label>
    )
  },
)

export default Checkbox
