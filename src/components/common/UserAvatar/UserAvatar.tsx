interface UserAvatarProps {
  profileImageUrl: string | null | undefined
  nickname: string
  size?: 'sm' | 'md'
}

export function UserAvatar({
  profileImageUrl,
  nickname,
  size = 'md',
}: UserAvatarProps) {
  const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
  const initial = [...nickname][0] ?? '?'

  if (profileImageUrl) {
    return (
      <img
        src={profileImageUrl}
        alt={nickname}
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`bg-bg-subtle flex ${sizeClass} items-center justify-center rounded-full text-xs font-bold`}
    >
      {initial}
    </div>
  )
}
