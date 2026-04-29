interface QaBadgeProps {
  type: 'Q' | 'A'
  className?: string
}

export function QaBadge({ type, className }: QaBadgeProps) {
  const base =
    'bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'
  return (
    <span className={className ? `${base} ${className}` : base}>{type}</span>
  )
}
