export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string | null
  alt: string
  size?: AvatarSize
  /** Fallback single character (auto-derived from alt if omitted) */
  initials?: string
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

function deriveInitials(alt: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase()
  const words = alt.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function Avatar({
  src,
  alt,
  size = 'md',
  initials,
  className = '',
}: AvatarProps) {
  const letters = deriveInitials(alt, initials)

  return (
    <span
      role="img"
      aria-label={alt}
      className={[
        'inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-semibold select-none',
        sizeClasses[size],
        !src ? 'bg-primary-100 text-primary-700' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {src ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{letters}</span>
      )}
    </span>
  )
}

export default Avatar
