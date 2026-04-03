import { KakaoIcon, NaverIcon } from './icons'

export type SocialProvider = 'kakao' | 'naver'

export interface SocialLoginButtonProps {
  provider: SocialProvider
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

const providerConfig: Record<
  SocialProvider,
  { label: string; icon: React.ReactNode; classes: string }
> = {
  kakao: {
    label: '카카오 간편 로그인/가입',
    icon: <KakaoIcon />,
    classes:
      'bg-kakao text-kakao-text font-light hover:brightness-95 active:brightness-90',
  },
  naver: {
    label: '네이버 간편 로그인/가입 ',
    icon: <NaverIcon />,
    classes:
      'bg-naver text-naver-text hover:brightness-95 active:brightness-90',
  },
}

export function SocialLoginButton({
  provider,
  onClick,
  disabled = false,
  loading = false,
  className = '',
}: SocialLoginButtonProps) {
  const { label, icon, classes } = providerConfig[provider]
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={label}
      className={[
        'relative flex h-12 w-full items-center justify-center gap-2.5 rounded-sm text-sm font-medium transition-all duration-150 outline-none',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2',
        classes,
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  )
}

export default SocialLoginButton
