import { forwardRef, useId } from 'react'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string
  /** Visually hide the label (still read by screen readers) */
  hideLabel?: boolean
  isError?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      hideLabel = false,
      isError = false,
      id: idProp,
      className = '',
      disabled,
      ...props
    },
    ref
  ) {
    const generatedId = useId()
    const checkboxId = idProp ?? generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={[
          'group inline-flex cursor-pointer items-center gap-2 select-none',
          disabled ? 'cursor-not-allowed opacity-60' : '',
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
            'h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border transition-colors duration-150 outline-none',
            'checked:bg-primary checked:border-primary',
            isError
              ? 'border-error focus-visible:ring-error focus-visible:ring-2'
              : 'border-border-base focus-visible:ring-primary focus-visible:ring-2',
            disabled ? 'cursor-not-allowed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        <span
          className={[
            'text-text-body text-sm leading-none',
            hideLabel ? 'sr-only' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </span>
      </label>
    )
  }
)

export default Checkbox
