import { useState } from 'react'
import { Star, Zap, Shield, Search } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Dropdown,
  Input,
  Modal,
  PasswordInput,
  SearchInput,
  SocialLoginButton,
  Spinner,
  SuccessCard,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Toast,
} from '../components'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-border-base pb-10">
      <h2 className="mb-6 text-2xl font-semibold text-text-heading">{title}</h2>
      {children}
    </section>
  )
}

export function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [dropdownValue, setDropdownValue] = useState('')
  const [activeTab, setActiveTab] = useState('tab1')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastVariant, setToastVariant] = useState<'success' | 'info' | 'warning' | 'error'>('success')

  const dropdownOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ]

  const showToast = (variant: 'success' | 'info' | 'warning' | 'error') => {
    setToastVariant(variant)
    setToastVisible(true)
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <header className="mb-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-text-heading">
          Component Showcase
        </h1>
        <p className="text-lg text-text-body">
          공통 컴포넌트 목록 및 사용 예시
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {/* Button */}
        <Section title="Button">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-muted">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <p className="text-sm text-text-muted">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <p className="text-sm text-text-muted">States</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>
        </Section>

        {/* Badge */}
        <Section title="Badge">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-muted">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <p className="text-sm text-text-muted">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
            </div>
          </div>
        </Section>

        {/* Avatar */}
        <Section title="Avatar">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col items-center gap-1">
              <Avatar
                src="https://i.pravatar.cc/150?img=1"
                alt="User"
                size="sm"
              />
              <span className="text-xs text-text-muted">sm</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Avatar
                src="https://i.pravatar.cc/150?img=2"
                alt="User"
                size="md"
              />
              <span className="text-xs text-text-muted">md</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Avatar
                src="https://i.pravatar.cc/150?img=3"
                alt="User"
                size="lg"
              />
              <span className="text-xs text-text-muted">lg</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Avatar
                src="https://i.pravatar.cc/150?img=4"
                alt="User"
                size="xl"
              />
              <span className="text-xs text-text-muted">xl</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Avatar src={null} alt="Kim Hyeon" size="lg" />
              <span className="text-xs text-text-muted">initials</span>
            </div>
          </div>
        </Section>

        {/* Input */}
        <Section title="Input">
          <div className="flex max-w-md flex-col gap-4">
            <Input
              label="기본 입력"
              placeholder="텍스트를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="도움말 텍스트입니다"
            />
            <Input
              label="에러 상태"
              placeholder="텍스트를 입력하세요"
              isError
              errorMessage="필수 입력 항목입니다"
            />
            <Input
              label="성공 상태"
              placeholder="텍스트를 입력하세요"
              isSuccess
              successMessage="사용 가능한 값입니다"
              leftElement={<Search size={16} />}
            />
            <Input label="비활성화" placeholder="입력 불가" disabled />
          </div>
        </Section>

        {/* PasswordInput */}
        <Section title="PasswordInput">
          <div className="max-w-md">
            <PasswordInput
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              helperText="8자 이상 입력하세요"
            />
          </div>
        </Section>

        {/* SearchInput */}
        <Section title="SearchInput">
          <div className="max-w-md">
            <SearchInput
              placeholder="검색어를 입력하세요"
              value={searchValue}
              onValueChange={setSearchValue}
              onClear={() => setSearchValue('')}
            />
          </div>
        </Section>

        {/* Checkbox */}
        <Section title="Checkbox">
          <div className="flex flex-col gap-3">
            <Checkbox
              label="기본 체크박스"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />
            <Checkbox label="에러 상태" isError />
            <Checkbox label="비활성화" disabled />
            <Checkbox label="비활성화 + 체크" disabled checked />
          </div>
        </Section>

        {/* Dropdown */}
        <Section title="Dropdown">
          <div className="max-w-md">
            <Dropdown
              options={dropdownOptions}
              value={dropdownValue}
              onChange={setDropdownValue}
              placeholder="프레임워크를 선택하세요"
            />
          </div>
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList aria-label="탭 예시">
              <Tab value="tab1">개요</Tab>
              <Tab value="tab2">상세 정보</Tab>
              <Tab value="tab3" disabled>
                비활성화
              </Tab>
            </TabList>
            <TabPanel value="tab1">
              <div className="rounded-lg bg-bg-muted p-4">
                <p className="text-text-body">개요 탭의 콘텐츠입니다.</p>
              </div>
            </TabPanel>
            <TabPanel value="tab2">
              <div className="rounded-lg bg-bg-muted p-4">
                <p className="text-text-body">상세 정보 탭의 콘텐츠입니다.</p>
              </div>
            </TabPanel>
            <TabPanel value="tab3">
              <div className="rounded-lg bg-bg-muted p-4">
                <p className="text-text-body">비활성화된 탭입니다.</p>
              </div>
            </TabPanel>
          </Tabs>
        </Section>

        {/* Card */}
        <Section title="Card">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card elevation="flat" padding="md">
              <CardHeader>
                <h3 className="font-semibold text-text-heading">Flat</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-body">
                  elevation flat 카드입니다.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  더 보기
                </Button>
              </CardFooter>
            </Card>
            <Card elevation="sm" padding="md">
              <CardHeader>
                <h3 className="font-semibold text-text-heading">Small</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-body">
                  elevation sm 카드입니다.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="outline" size="sm">
                  더 보기
                </Button>
              </CardFooter>
            </Card>
            <Card elevation="md" padding="md">
              <CardHeader>
                <h3 className="font-semibold text-text-heading">Medium</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-body">
                  elevation md 카드입니다.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm">
                  더 보기
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>


        {/* SuccessCard */}
        <Section title="SuccessCard">
          <div className="max-w-sm">
            <SuccessCard
              title="가입이 완료되었습니다!"
              description="이메일 인증 후 서비스를 이용할 수 있습니다."
            />
          </div>
        </Section>

        {/* SocialLoginButton */}
        <Section title="SocialLoginButton">
          <div className="flex max-w-sm flex-col gap-3">
            <SocialLoginButton provider="kakao" />
            <SocialLoginButton provider="naver" />
            <SocialLoginButton provider="kakao" loading />
            <SocialLoginButton provider="naver" disabled />
          </div>
        </Section>

        {/* Modal */}
        <Section title="Modal">
          <Button onClick={() => setModalOpen(true)}>모달 열기</Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="모달 제목"
            description="모달 설명 텍스트입니다."
          >
            <div className="flex flex-col gap-4">
              <Input label="이름" placeholder="이름을 입력하세요" />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  취소
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  확인
                </Button>
              </div>
            </div>
          </Modal>
        </Section>

        {/* Toast */}
        <Section title="Toast">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => showToast('success')}>
              Success
            </Button>
            <Button variant="outline" onClick={() => showToast('info')}>
              Info
            </Button>
            <Button variant="secondary" onClick={() => showToast('warning')}>
              Warning
            </Button>
            <Button variant="danger" onClick={() => showToast('error')}>
              Error
            </Button>
          </div>
          <Toast
            message={`${toastVariant} 토스트 메시지입니다.`}
            variant={toastVariant}
            visible={toastVisible}
            onClose={() => setToastVisible(false)}
            duration={3000}
          />
        </Section>

        {/* Spinner */}
        <Section title="Spinner">
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-1">
              <Spinner size="sm" />
              <span className="text-xs text-text-muted">sm</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Spinner size="md" />
              <span className="text-xs text-text-muted">md</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Spinner size="lg" />
              <span className="text-xs text-text-muted">lg</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
