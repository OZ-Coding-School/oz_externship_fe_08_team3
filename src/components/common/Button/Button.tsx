import { forwardRef } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed',
  secondary:
    'bg-bg-muted text-text-heading border border-border-base hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'bg-primary-100 text-primary border border-primary hover:bg-primary-200 active:bg-primary-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-600 disabled:border-gray-300 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-primary hover:bg-bg-accent active:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-error text-text-inverse hover:bg-red-600 active:bg-red-700 focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm font-medium rounded-sm gap-1.5',
  md: 'h-12 px-5 text-base font-medium rounded-sm gap-2',
  lg: 'h-14 px-6 text-lg font-semibold rounded-sm gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={[
          'inline-flex items-center justify-center transition-colors duration-150 outline-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading && (
          <span
            className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  }
)

export default Button
