import { Spinner } from '@/components/common/Spinner'

interface LoadingBoxProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingBox({ label, size = 'md', className }: LoadingBoxProps) {
  return (
    <div
      className={['flex justify-center py-10', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Spinner size={size} label={label} />
    </div>
  )
}
