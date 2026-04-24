import { http, HttpResponse } from 'msw'
import type { QuestionsListResponse, QuestionListItem } from './types'

const mockQuestions: QuestionListItem[] = [
  {
    id: 1,
    category: { id: 11, depth: 2, names: ['Python', '기초 문법'] },
    author: {
      id: 1,
      nickname: '코딩_초보',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'Python 리스트와 튜플의 차이점이 뭔가요?',
    content_preview:
      '파이썬을 공부하다가 리스트와 튜플 모두 데이터를 담는 자료형인데 어떤 상황에서 어떤 걸 써야 하는지 모르겠어요.',
    answer_count: 3,
    view_count: 145,
    created_at: '2025-03-15 10:30:00',
    thumbnail_img_url: null,
  },
  {
    id: 2,
    category: { id: 21, depth: 2, names: ['JavaScript', 'ES6+'] },
    author: {
      id: 2,
      nickname: '자바스터디',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 12,
    },
    title: 'async/await와 Promise의 차이가 무엇인가요?',
    content_preview:
      '비동기 처리를 배우고 있는데 두 방식의 실제 차이와 언제 어떤 걸 사용해야 할지 헷갈립니다.',
    answer_count: 5,
    view_count: 302,
    created_at: '2025-03-14 14:20:00',
    thumbnail_img_url: null,
  },
  {
    id: 3,
    category: { id: 31, depth: 2, names: ['React', 'Hooks'] },
    author: {
      id: 3,
      nickname: '리액트_뉴비',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 13,
    },
    title: 'useEffect 의존성 배열을 빈 배열로 하면 왜 경고가 뜨나요?',
    content_preview:
      'useEffect에서 외부 변수를 사용하면서 의존성 배열을 []로 하면 ESLint 경고가 뜨는데 이게 왜 그런건지 이해가 안 갑니다.',
    answer_count: 0,
    view_count: 78,
    created_at: '2025-03-13 09:15:00',
    thumbnail_img_url: null,
  },
  {
    id: 4,
    category: { id: 41, depth: 2, names: ['Django', 'ORM'] },
    author: {
      id: 4,
      nickname: '장고_학습자',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'Django ORM에서 related_name은 언제 사용하나요?',
    content_preview:
      'ForeignKey를 정의할 때 related_name 파라미터를 쓰는 경우를 봤는데 이게 정확히 어떤 역할을 하는지 모르겠어요.',
    answer_count: 2,
    view_count: 210,
    created_at: '2025-03-12 16:45:00',
    thumbnail_img_url: null,
  },
  {
    id: 5,
    category: { id: 12, depth: 2, names: ['Python', '자료구조'] },
    author: {
      id: 5,
      nickname: '알고리즘_도전',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 15,
    },
    title: '파이썬 딕셔너리 순회 시 값을 수정하면 왜 에러가 나나요?',
    content_preview:
      'for 루프로 딕셔너리를 순회하면서 키를 삭제하려고 했는데 "RuntimeError: dictionary changed size during iteration" 에러가 나요.',
    answer_count: 1,
    view_count: 93,
    created_at: '2025-03-11 11:00:00',
    thumbnail_img_url: null,
  },
  {
    id: 6,
    category: { id: 22, depth: 2, names: ['JavaScript', 'DOM'] },
    author: {
      id: 6,
      nickname: 'DOM_탐험가',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 11,
    },
    title: 'event.preventDefault()와 event.stopPropagation()의 차이는?',
    content_preview:
      '이벤트 처리할 때 두 메서드를 자주 보는데 정확히 어떤 차이가 있고 언제 각각 써야 하는지 궁금합니다.',
    answer_count: 4,
    view_count: 187,
    created_at: '2025-03-10 13:30:00',
    thumbnail_img_url: null,
  },
  {
    id: 7,
    category: { id: 32, depth: 2, names: ['React', '상태 관리'] },
    author: {
      id: 7,
      nickname: '상태관리_고민',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 13,
    },
    title: 'Redux와 Zustand 중 어떤 상태 관리 라이브러리를 선택해야 할까요?',
    content_preview:
      '프로젝트를 시작하려는데 상태 관리 라이브러리로 Redux와 Zustand 중 어느 것이 더 적합한지 선택 기준을 알고 싶습니다.',
    answer_count: 0,
    view_count: 256,
    created_at: '2025-03-09 08:00:00',
    thumbnail_img_url: null,
  },
  {
    id: 8,
    category: { id: 42, depth: 2, names: ['Django', 'REST API'] },
    author: {
      id: 8,
      nickname: 'API_개발자',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 14,
    },
    title:
      'DRF에서 시리얼라이저의 create와 update 메서드 언제 오버라이딩하나요?',
    content_preview:
      'Django REST Framework를 사용하는데 Serializer에 create와 update 메서드를 언제, 왜 오버라이딩해야 하는지 이해가 잘 안 됩니다.',
    answer_count: 2,
    view_count: 134,
    created_at: '2025-03-08 15:20:00',
    thumbnail_img_url: null,
  },
  {
    id: 9,
    category: { id: 13, depth: 2, names: ['Python', '알고리즘'] },
    author: {
      id: 9,
      nickname: '알고_풀기',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 15,
    },
    title: '파이썬으로 BFS와 DFS 구현할 때 어떤 자료구조를 써야 하나요?',
    content_preview:
      '그래프 탐색 알고리즘을 파이썬으로 구현할 때 BFS는 큐, DFS는 스택을 쓴다고 배웠는데 실제로 어떻게 코드로 표현하면 좋을까요?',
    answer_count: 1,
    view_count: 167,
    created_at: '2025-03-07 10:45:00',
    thumbnail_img_url: null,
  },
  {
    id: 10,
    category: { id: 33, depth: 2, names: ['React', '라우팅'] },
    author: {
      id: 10,
      nickname: '라우팅_혼란',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 12,
    },
    title: 'React Router에서 중첩 라우트 구현 시 Outlet이 무엇인가요?',
    content_preview:
      '중첩 라우트를 구현하다가 Outlet 컴포넌트를 써야 한다고 들었는데 어떻게 동작하는 건지 예시를 들어 설명해 주실 수 있나요?',
    answer_count: 3,
    view_count: 221,
    created_at: '2025-03-06 14:10:00',
    thumbnail_img_url: null,
  },
  {
    id: 11,
    category: { id: 23, depth: 2, names: ['JavaScript', '비동기'] },
    author: {
      id: 11,
      nickname: '비동기_이해중',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 11,
    },
    title: 'JavaScript 이벤트 루프가 정확히 어떻게 동작하나요?',
    content_preview:
      '콜 스택, 이벤트 큐, 마이크로태스크 큐에 대해 들었는데 이들이 어떤 순서로 처리되는지 헷갈립니다.',
    answer_count: 6,
    view_count: 445,
    created_at: '2025-03-05 09:30:00',
    thumbnail_img_url: null,
  },
  {
    id: 12,
    category: { id: 41, depth: 2, names: ['Django', 'ORM'] },
    author: {
      id: 12,
      nickname: 'ORM_마스터',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 13,
    },
    title: 'Django에서 N+1 문제를 해결하는 방법은?',
    content_preview:
      'Django ORM을 사용하다 N+1 쿼리 문제를 발견했습니다. select_related와 prefetch_related 중 어떤 상황에서 각각 사용해야 하나요?',
    answer_count: 4,
    view_count: 389,
    created_at: '2025-03-04 16:00:00',
    thumbnail_img_url: null,
  },
  {
    id: 13,
    category: { id: 31, depth: 2, names: ['React', 'Hooks'] },
    author: {
      id: 13,
      nickname: '훅스_연습생',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'useMemo와 useCallback은 언제 사용해야 하나요?',
    content_preview:
      '성능 최적화를 위해 useMemo와 useCallback을 배웠는데 오히려 남발하면 오버헤드가 생긴다고 들었습니다. 적절한 사용 시점이 궁금합니다.',
    answer_count: 0,
    view_count: 112,
    created_at: '2025-03-03 11:20:00',
    thumbnail_img_url: null,
  },
  {
    id: 14,
    category: { id: 11, depth: 2, names: ['Python', '기초 문법'] },
    author: {
      id: 14,
      nickname: '파이썬_첫걸음',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 16,
    },
    title: 'Python의 *args와 **kwargs는 어떻게 사용하나요?',
    content_preview:
      '함수 정의에서 *args와 **kwargs를 자주 보는데 이게 정확히 어떤 역할을 하는지, 어떤 상황에서 사용하는지 알고 싶습니다.',
    answer_count: 2,
    view_count: 99,
    created_at: '2025-03-02 13:50:00',
    thumbnail_img_url: null,
  },
  {
    id: 15,
    category: { id: 42, depth: 2, names: ['Django', 'REST API'] },
    author: {
      id: 15,
      nickname: '백엔드_개발자',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'JWT 토큰 인증에서 Access Token과 Refresh Token의 역할은?',
    content_preview:
      'DRF에서 JWT 인증을 구현하려고 하는데 Access Token과 Refresh Token의 역할 분리와 보안상 왜 둘 다 필요한지 궁금합니다.',
    answer_count: 3,
    view_count: 278,
    created_at: '2025-03-01 10:00:00',
    thumbnail_img_url: null,
  },
]

export const questionsHandler = [
  http.get(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/`,
    ({ request }) => {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') ?? 1)
      const pageSize = Number(url.searchParams.get('page_size') ?? 10)
      const searchKeyword = url.searchParams.get('search_keyword') ?? ''
      const categoryId = url.searchParams.get('category_id')
        ? Number(url.searchParams.get('category_id'))
        : null
      const answerStatus = url.searchParams.get('answer_status')
      const sort = url.searchParams.get('sort') ?? 'latest'

      let filtered = [...mockQuestions]

      if (searchKeyword) {
        filtered = filtered.filter(
          (q) =>
            q.title.includes(searchKeyword) ||
            q.content_preview.includes(searchKeyword)
        )
      }

      if (categoryId != null) {
        filtered = filtered.filter((q) => q.category.id === categoryId)
      }

      if (answerStatus === 'answered') {
        filtered = filtered.filter((q) => q.answer_count > 0)
      } else if (answerStatus === 'unanswered') {
        filtered = filtered.filter((q) => q.answer_count === 0)
      }

      if (sort === 'views') {
        filtered = [...filtered].sort((a, b) => b.view_count - a.view_count)
      }

      const count = filtered.length
      const start = (page - 1) * pageSize
      const results = filtered.slice(start, start + pageSize)

      return HttpResponse.json<QuestionsListResponse>({
        count,
        next: start + pageSize < count ? String(page + 1) : null,
        previous: page > 1 ? String(page - 1) : null,
        results,
      })
    }
  ),
]
