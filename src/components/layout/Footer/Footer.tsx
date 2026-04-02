import logoImg from '@/assets/logo.png'

export interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={['bg-gray-800 px-4 py-20', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-container mx-auto flex flex-col gap-9">
        {/* Logo + Camp links */}
        <div className="flex flex-col gap-10">
          <div className="flex w-[200px] flex-col gap-10">
            <img
              src={logoImg}
              alt="OzCodingSchool"
              className="h-5 w-30 brightness-0 invert"
            />
            <nav className="flex flex-col gap-6 text-sm tracking-tight text-gray-300">
              <a
                href="#"
                className="transition-colors duration-150 hover:text-white"
              >
                초격차캠프
              </a>
              <a
                href="#"
                className="transition-colors duration-150 hover:text-white"
              >
                사업개발캠프
              </a>
              <a
                href="#"
                className="transition-colors duration-150 hover:text-white"
              >
                프로덕트 디자이너 캠프
              </a>
            </nav>
          </div>

          {/* Divider + Policy links + SNS */}
          <div className="flex items-end justify-between border-t border-gray-500 pt-10">
            <div className="flex items-center gap-7 text-base tracking-tight text-white">
              <a
                href="#"
                className="underline transition-colors duration-150 hover:text-gray-300"
              >
                개인정보처리방침
              </a>
              <a
                href="#"
                className="underline transition-colors duration-150 hover:text-gray-300"
              >
                이용약관
              </a>
              <a
                href="#"
                className="underline transition-colors duration-150 hover:text-gray-300"
              >
                멘토링&강사지원
              </a>
            </div>
            <div className="flex items-center gap-3">
              {['blog', 'youtube', 'instagram', 'facebook'].map((sns) => (
                <div
                  key={sns}
                  className="h-6 w-6 rounded-full bg-gray-600"
                  aria-label={sns}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Business info */}
        <div className="flex flex-col gap-4 text-base tracking-tight text-gray-400">
          <p>
            대표자 : 이한별 | 사업자 등록번호 : 540-86-00384 | 통신판매업
            신고번호 : 2020-경기김포-3725호
          </p>
          <p>
            주소 : 경기도 김포시 사우중로 87 201호 | 이메일 :
            kdigital@nextrunners.co.kr | 전화 : 070-4099-8219
          </p>
        </div>
      </div>
    </footer>
  )
}
