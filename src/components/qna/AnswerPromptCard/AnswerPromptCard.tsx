import { UserAvatar } from '@/components/common/UserAvatar'

interface AnswerPromptCardProps {
  nickname: string
  profileImageUrl: string | null | undefined
  isEdit: boolean
  disabled: boolean
  onAction: () => void
}

export function AnswerPromptCard({
  nickname,
  profileImageUrl,
  isEdit,
  disabled,
  onAction,
}: AnswerPromptCardProps) {
  return (
    <div className="mt-[100px] flex items-center gap-3 rounded-[20px] border border-[#CECECE] px-[38px] py-10">
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
        onClick={onAction}
        disabled={disabled}
        className="bg-primary h-12 w-[112px] shrink-0 rounded-full text-base font-semibold text-white transition-colors hover:bg-[#3B0186] disabled:cursor-not-allowed disabled:bg-[#ECECEC] disabled:text-[#BDBDBD]"
      >
        {isEdit ? '답변 수정하기' : '답변하기'}
      </button>
    </div>
  )
}
