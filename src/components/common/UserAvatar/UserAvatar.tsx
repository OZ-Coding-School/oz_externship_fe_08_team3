import defaultProfile from '@/assets/default-profile.png'

interface UserAvatarProps {
  profileImageUrl: string | null | undefined
  nickname: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASS = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const

export function UserAvatar({
  profileImageUrl,
  nickname,
  size = 'md',
}: UserAvatarProps) {
  const sizeClass = SIZE_CLASS[size]

  return (
    <img
      src={profileImageUrl ?? defaultProfile}
      alt={nickname}
      width={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
      height={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
      className={`${sizeClass} aspect-square rounded-full object-cover`}
    />
  )
}
