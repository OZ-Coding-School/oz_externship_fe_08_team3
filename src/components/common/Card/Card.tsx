export interface CardProps {
  children: React.ReactNode
  className?: string
  /** Make the card a button/link element */
  as?: 'div' | 'article' | 'section'
  /** Visual elevation level */
  elevation?: 'flat' | 'sm' | 'md'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const elevationClasses = {
  flat: 'border border-border-base',
  sm: 'border border-border-base shadow-sm',
  md: 'border border-border-base shadow-md',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  elevation = 'sm',
  padding = 'md',
}: CardProps) {
  return (
    <Tag
      className={[
        'bg-bg-base rounded-2xl',
        elevationClasses[elevation],
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={['border-border-base border-b pb-4', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={['py-4', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'border-border-base flex items-center justify-end gap-3 border-t pt-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export default Card
