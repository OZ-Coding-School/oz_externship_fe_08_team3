import { forwardRef, useId } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorMessage?: string
  successMessage?: string
  isError?: boolean
  isSuccess?: boolean
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      helperText,
      errorMessage,
      successMessage,
      isError = false,
      isSuccess = false,
      leftElement,
      rightElement,
      id: idProp,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) {
    const generatedId = useId()
    const inputId = idProp ?? generatedId
    const descriptionId = `${inputId}-desc`
    const hasError = isError || Boolean(errorMessage)
    const hasSuccess = isSuccess || Boolean(successMessage)

    const feedbackText = errorMessage ?? successMessage ?? helperText
    const feedbackColor = hasError
      ? 'text-error'
      : hasSuccess
        ? 'text-success'
        : 'text-text-muted'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-heading"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <span className="absolute left-3 flex items-center pointer-events-none text-text-muted">
              {leftElement}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={feedbackText ? descriptionId : undefined}
            className={[
              'w-full h-12 bg-bg-base border rounded-sm text-base text-text-heading placeholder:text-text-muted transition-colors duration-150 outline-none',
              leftElement ? 'pl-10' : 'pl-4',
              rightElement ? 'pr-10' : 'pr-4',
              hasError
                ? 'border-error-dark focus:border-error-dark'
                : hasSuccess
                  ? 'border-success focus:border-success'
                  : 'border-border-base focus:border-primary',
              disabled
                ? 'bg-bg-muted text-text-muted cursor-not-allowed opacity-60'
                : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 flex items-center text-text-muted">
              {rightElement}
            </span>
          )}
        </div>

        {feedbackText && (
          <p
            id={descriptionId}
            className={`text-xs ${feedbackColor}`}
            role={hasError ? 'alert' : undefined}
            aria-live={hasError ? 'polite' : undefined}
          >
            {feedbackText}
          </p>
        )}
      </div>
    )
  },
)

export default Input
