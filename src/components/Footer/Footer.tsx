import logoImg from '@/assets/logo.png'

export interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={['bg-gray-800 px-4 py-20', className].filter(Boolean).join(' ')}>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-9">
        {/* Logo + Camp links */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10 w-[200px]">
            <img
              src={logoImg}
              alt="OzCodingSchool"
              className="h-5 w-30 brightness-0 invert"
            />
            <nav className="flex flex-col gap-6 text-sm text-gray-300 tracking-tight">
              <a href="#" className="hover:text-white transition-colors duration-150">초격차캠프</a>
              <a href="#" className="hover:text-white transition-colors duration-150">사업개발캠프</a>
              <a href="#" className="hover:text-white transition-colors duration-150">프로덕트 디자이너 캠프</a>
            </nav>
          </div>

          {/* Divider + Policy links + SNS */}
          <div className="border-t border-gray-500 pt-10 flex items-end justify-between">
            <div className="flex items-center gap-7 text-base text-white tracking-tight">
              <a href="#" className="underline hover:text-gray-300 transition-colors duration-150">개인정보처리방침</a>
              <a href="#" className="underline hover:text-gray-300 transition-colors duration-150">이용약관</a>
              <a href="#" className="underline hover:text-gray-300 transition-colors duration-150">멘토링&강사지원</a>
            </div>
            <div className="flex items-center gap-3">
              {['blog', 'youtube', 'instagram', 'facebook'].map((sns) => (
                <div key={sns} className="w-6 h-6 rounded-full bg-gray-600" aria-label={sns} />
              ))}
            </div>
          </div>
        </div>

        {/* Business info */}
        <div className="flex flex-col gap-4 text-base text-gray-400 tracking-tight">
          <p>대표자 : 이한별 | 사업자 등록번호 : 540-86-00384 | 통신판매업 신고번호 : 2020-경기김포-3725호</p>
          <p>주소 : 경기도 김포시 사우중로 87 201호 | 이메일 : kdigital@nextrunners.co.kr | 전화 : 070-4099-8219</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
