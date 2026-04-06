import { CheckCircleIcon } from './icons'

export interface SuccessCardProps {
  title: string
  description?: string
  className?: string
}

export function SuccessCard({
  title,
  description,
  className = '',
}: SuccessCardProps) {
  return (
    <div
      role="status"
      className={[
        'flex flex-col items-center gap-4 rounded-xl bg-white p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CheckCircleIcon />
      <h2 className="text-xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="text-sm tracking-tight text-gray-600">{description}</p>
      )}
    </div>
  )
}
