import logoImg from '@/assets/logo.png'

export interface FooterProps {
  className?: string
}

const CAMP_LINKS = ['초격차캠프', '사업개발캠프', '프로덕트 디자이너 캠프']
const POLICY_LINKS = ['개인정보처리방침', '이용약관', '멘토링&강사지원']
const SNS_LINKS = ['blog', 'youtube', 'instagram', 'facebook']

function FooterLinkButton({
  children,
  underlined = false,
}: {
  children: React.ReactNode
  underlined?: boolean
}) {
  return (
    <button
      type="button"
      className={[
        'text-left transition-colors duration-150 hover:text-white',
        underlined ? 'underline hover:text-gray-300' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

function FooterBrandLinks() {
  return (
    <div className="flex w-full flex-col gap-10 sm:w-[200px]">
      <img
        src={logoImg}
        alt="OzCodingSchool"
        width={120}
        height={20}
        className="h-5 w-30 brightness-0 invert"
      />
      <nav
        aria-label="캠프"
        className="flex flex-col gap-6 text-sm tracking-tight text-gray-300"
      >
        {CAMP_LINKS.map((label) => (
          <FooterLinkButton key={label}>{label}</FooterLinkButton>
        ))}
      </nav>
    </div>
  )
}

function FooterPolicyAndSns() {
  return (
    <div className="flex flex-col gap-6 border-t border-gray-500 pt-10 lg:flex-row lg:items-end lg:justify-between">
      <nav
        aria-label="정책"
        className="flex flex-wrap items-center gap-x-7 gap-y-3 text-base tracking-tight text-white"
      >
        {POLICY_LINKS.map((label) => (
          <FooterLinkButton key={label} underlined>
            {label}
          </FooterLinkButton>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {SNS_LINKS.map((sns) => (
          <button
            key={sns}
            type="button"
            className="h-6 w-6 rounded-full bg-gray-600 transition-colors hover:bg-gray-500"
            aria-label={sns}
          />
        ))}
      </div>
    </div>
  )
}

function BusinessInfo() {
  return (
    <div className="flex flex-col gap-4 text-sm tracking-tight text-gray-400 sm:text-base">
      <p>
        대표자 : 이한별 | 사업자 등록번호 : 540-86-00384 | 통신판매업 신고번호 :
        2020-경기김포-3725호
      </p>
      <p>
        주소 : 경기도 김포시 사우중로 87 201호 | 이메일 :
        kdigital@nextrunners.co.kr | 전화 : 070-4099-8219
      </p>
    </div>
  )
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={['bg-gray-800 px-4 py-20', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-container mx-auto flex flex-col gap-9">
        <div className="flex flex-col gap-10">
          <FooterBrandLinks />
          <FooterPolicyAndSns />
        </div>

        <BusinessInfo />
      </div>
    </footer>
  )
}
