import { UserAvatar } from '@/components/common/UserAvatar'

interface AnswerPromptCardProps {
  nickname: string
  profileImageUrl: string | null | undefined
  isEdit: boolean
  disabled: boolean
  onAction?: () => void
  /** 카드 헤더로 쓸 때 true — 외곽 border/rounded/mt 제거 */
  asCardHeader?: boolean
  /** 폼이 펼쳐진 상태 — 버튼이 제출 동작으로 전환 */
  showForm?: boolean
  isLoading?: boolean
  onSubmit?: () => void
}

export function AnswerPromptCard({
  nickname,
  profileImageUrl,
  isEdit,
  disabled,
  onAction,
  asCardHeader = false,
  showForm = false,
  isLoading = false,
  onSubmit,
}: AnswerPromptCardProps) {
  let buttonLabel: string
  if (showForm) {
    buttonLabel = isEdit ? '저장하기' : '등록하기'
  } else {
    buttonLabel = isEdit ? '답변 수정하기' : '답변하기'
  }

  const content = (
    <>
      <UserAvatar
        size="lg"
        profileImageUrl={profileImageUrl}
        nickname={nickname}
      />
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-primary text-xs leading-normal tracking-[-0.03em]">
          {nickname} 님,
        </p>
        <p className="text-lg leading-normal font-bold tracking-[-0.03em] text-[#222]">
          정보를 공유해 주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={showForm ? (onSubmit ?? (() => {})) : (onAction ?? (() => {}))}
        disabled={showForm ? isLoading : disabled}
        className="bg-primary h-12 w-[112px] shrink-0 rounded-full text-base font-semibold text-white transition-colors hover:bg-[#3B0186] disabled:cursor-not-allowed disabled:bg-[#ECECEC] disabled:text-[#BDBDBD]"
      >
        {buttonLabel}
      </button>
    </>
  )

  if (asCardHeader) {
    return (
      <div className="flex items-center gap-3 px-[38px] py-10">{content}</div>
    )
  }

  return (
    <div className="mt-[100px] flex items-center gap-3 rounded-[20px] border border-[#CECECE] px-[38px] py-10">
      {content}
    </div>
  )
}
