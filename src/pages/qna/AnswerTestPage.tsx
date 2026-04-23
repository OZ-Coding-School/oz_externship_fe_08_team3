/**
 * 답변 등록 기능 로컬 테스트 페이지
 * 접속 경로: /qna/test
 * 실제 배포 전 라우트에서 제거할 것
 */

import { useState, useEffect } from 'react'
import { http, HttpResponse } from 'msw'
import { Button } from '@/components/common/Button'
import { Toast } from '@/components/common/Toast'
import { AnswerForm } from '@/components/qna/AnswerForm'
import { useAuthStore } from '@/stores/authStore'
import { usePostAnswer } from '@/features/qna/answers'

const TEST_QUESTION_TITLE =
  'React에서 useState와 useReducer의 차이점이 무엇인가요? 어떤 상황에서 각각을 사용하는 것이 좋을까요?'

type Scenario = 'success' | '400' | '401' | '403' | '404'

type ToastState =
  | { visible: false }
  | {
      visible: true
      message: string
      variant: 'success' | 'error' | 'info' | 'warning'
    }

const scenarioStatusMap: Record<Scenario, number> = {
  success: 201,
  '400': 400,
  '401': 401,
  '403': 403,
  '404': 404,
}

// MSW 핸들러 클로저에서 읽는 모듈 레벨 변수
// (React 상태는 비동기 클로저에서 최신값 보장 불가)
let _testStatus = 201

export function AnswerTestPage() {
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const [scenario, setScenario] = useState<Scenario>('success')
  const [showForm, setShowForm] = useState(true)
  const [toast, setToast] = useState<ToastState>({ visible: false })

  const { mutate: postAnswer, isPending } = usePostAnswer(1)

  // 마운트 시 핸들러 한 번만 등록, 언마운트 시 정리
  useEffect(() => {
    let cleanup = () => {}

    import('@/mocks/browser').then(({ worker }) => {
      worker.use(
        // 답변 등록 — _testStatus 값으로 응답 결정
        http.post('/api/v1/qna/questions/:question_id/answers', () => {
          const status = _testStatus
          if (status === 201) {
            return HttpResponse.json(
              {
                answer_id: 801,
                question_id: 1,
                author_id: 211,
                created_at: new Date().toISOString(),
              },
              { status: 201 }
            )
          }
          return HttpResponse.json(
            { error_detail: `${status} 에러 시나리오 테스트` },
            { status }
          )
        }),
        // 401 시나리오 대응: interceptors.ts가 401 수신 후 토큰 갱신을 시도함
        // 갱신 성공 → 원본 요청 재시도 → 다시 401 → 이번엔 _retry=true라 에러 전파 → 토스트 노출
        // 갱신 실패 시에는 redirectToLogin()이 호출돼 페이지 리로드됨 (토스트 미노출)
        http.post('/api/v1/accounts/me/refresh', () => {
          return HttpResponse.json(
            { access_token: 'test-fake-token' },
            { status: 200 }
          )
        })
      )

      cleanup = () => worker.resetHandlers()
    })

    return () => cleanup()
  }, [])

  const showToast = (
    message: string,
    variant: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setToast({ visible: true, message, variant })
  }

  // 시나리오 변경: 모듈 변수만 업데이트 (비동기 불필요)
  const applyScenario = (next: Scenario) => {
    setScenario(next)
    _testStatus = scenarioStatusMap[next]
  }

  const handleSubmit = (content: string, imageUrls: string[]) => {
    postAnswer(
      { content, img_urls: imageUrls },
      {
        onSuccess: () => {
          showToast('답변이 등록되었습니다.', 'success')
          setShowForm(false)
        },
        onError: (error) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status
          if (status === 400)
            showToast('유효하지 않은 답변 등록 요청입니다.', 'error')
          else if (status === 401)
            showToast('로그인한 사용자만 답변을 작성할 수 있습니다.', 'error')
          else if (status === 403)
            showToast('답변 작성 권한이 없습니다.', 'error')
          else if (status === 404)
            showToast('해당 질문을 찾을 수 없습니다.', 'error')
          else showToast('일시적인 오류가 발생했습니다.', 'error')
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-text-heading text-2xl font-bold">
          답변 등록 테스트 페이지
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          로컬 개발용 — 배포 시 라우트에서 제거 필요
        </p>
      </div>

      {/* 인증 상태 제어 */}
      <section className="border-border-base bg-bg-muted mb-6 rounded-lg border p-4">
        <h2 className="text-text-heading mb-3 text-sm font-semibold">
          ① 인증 상태
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={[
              'inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium',
              isAuthenticated
                ? 'bg-success-bg text-success'
                : 'bg-error-bg text-error',
            ].join(' ')}
          >
            <span
              className={[
                'h-1.5 w-1.5 rounded-full',
                isAuthenticated ? 'bg-success' : 'bg-error',
              ].join(' ')}
            />
            {isAuthenticated ? `로그인됨 (${user?.nickname})` : '비로그인'}
          </span>

          {isAuthenticated ? (
            <Button variant="secondary" size="sm" onClick={logout}>
              로그아웃
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() =>
                login({
                  nickname: '테스트유저',
                  email: 'test@test.com',
                  role: 'student',
                })
              }
            >
              로그인 시뮬레이션
            </Button>
          )}
        </div>
      </section>

      {/* 응답 시나리오 제어 */}
      <section className="border-border-base bg-bg-muted mb-6 rounded-lg border p-4">
        <h2 className="text-text-heading mb-3 text-sm font-semibold">
          ② 응답 시나리오 (MSW)
        </h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'success', label: '201 성공' },
              { key: '400', label: '400 잘못된 요청' },
              { key: '401', label: '401 비로그인' },
              { key: '403', label: '403 권한 없음' },
              { key: '404', label: '404 질문 없음' },
            ] as const
          ).map(({ key, label }) => (
            <Button
              key={key}
              size="sm"
              variant={scenario === key ? 'primary' : 'secondary'}
              onClick={() => applyScenario(key)}
            >
              {label}
            </Button>
          ))}
        </div>
        <p className="text-text-muted mt-2 text-xs">
          선택된 시나리오: <strong>{scenario}</strong> — [등록하기] 클릭 시 해당
          응답 반환
        </p>
      </section>

      {/* 폼 표시 제어 */}
      <section className="border-border-base bg-bg-muted mb-6 rounded-lg border p-4">
        <h2 className="text-text-heading mb-3 text-sm font-semibold">
          ③ 폼 상태
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            폼 열기
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowForm(false)}
          >
            폼 닫기
          </Button>
        </div>
      </section>

      {/* 실제 컴포넌트 렌더링 영역 */}
      <section>
        <h2 className="text-text-heading mb-3 text-sm font-semibold">
          ④ 렌더링 결과
        </h2>
        <div className="border-border-base bg-bg-base rounded-lg border p-6">
          {isAuthenticated ? (
            showForm ? (
              <AnswerForm
                questionTitle={TEST_QUESTION_TITLE}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
                isLoading={isPending}
              />
            ) : (
              <Button onClick={() => setShowForm(true)}>답변하기</Button>
            )
          ) : (
            <p className="text-text-muted text-sm">
              로그인한 사용자만 답변할 수 있습니다. 위에서 로그인 시뮬레이션을
              눌러주세요.
            </p>
          )}
        </div>
      </section>

      {/* 토스트 */}
      {toast.visible && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast({ visible: false })}
        />
      )}
    </div>
  )
}
