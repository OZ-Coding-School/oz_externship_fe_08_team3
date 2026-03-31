import { CheckCircleIcon } from './icons'

export interface SuccessCardProps {
  title: string
  description?: string
  className?: string
}

export function SuccessCard({ title, description, className = '' }: SuccessCardProps) {
  return (
    <div
      role="status"
      className={[
        'bg-white rounded-xl p-6 flex flex-col items-center gap-4',
        className,
      ].filter(Boolean).join(' ')}
    >
      <CheckCircleIcon />
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-600 tracking-tight">
          {description}
        </p>
      )}
    </div>
  )
}

export default SuccessCard
