import { http, HttpResponse } from 'msw'
import type { QuestionsListResponse, QuestionListItem } from './types'

const mockQuestions: QuestionListItem[] = [
  {
    id: 1,
    category: {
      id: 111,
      depth: 3,
      names: ['프론트엔드', '프로그래밍 언어', 'JavaScript'],
    },
    author: {
      id: 1,
      nickname: '코딩_초보',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'JavaScript에서 var, let, const의 차이점이 뭔가요?',
    content_preview:
      '변수 선언 키워드가 세 개나 있는데 각각 언제 써야 하는지, 호이스팅 차이도 궁금합니다.',
    answer_count: 3,
    view_count: 145,
    created_at: '2025-03-15 10:30:00',
    thumbnail_img_url: null,
  },
  {
    id: 2,
    category: {
      id: 111,
      depth: 3,
      names: ['프론트엔드', '프로그래밍 언어', 'JavaScript'],
    },
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
    thumbnail_img_url: '/thumbnail-sample.png',
  },
  {
    id: 3,
    category: {
      id: 121,
      depth: 3,
      names: ['프론트엔드', '웹프레임워크', 'React'],
    },
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
    category: {
      id: 221,
      depth: 3,
      names: ['백엔드', '웹프레임워크', 'Django'],
    },
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
    category: {
      id: 211,
      depth: 3,
      names: ['백엔드', '프로그래밍 언어', 'Python'],
    },
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
    category: { id: 132, depth: 3, names: ['프론트엔드', 'Web', 'DOM'] },
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
    thumbnail_img_url: '/thumbnail-sample.png',
  },
  {
    id: 7,
    category: {
      id: 142,
      depth: 3,
      names: ['프론트엔드', '라이브러리', 'Zustand'],
    },
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
    category: {
      id: 222,
      depth: 3,
      names: ['백엔드', '웹프레임워크', 'FastAPI'],
    },
    author: {
      id: 8,
      nickname: 'API_개발자',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'FastAPI에서 Pydantic 모델과 SQLAlchemy 모델을 어떻게 연결하나요?',
    content_preview:
      'FastAPI를 사용하는데 Pydantic 스키마와 DB 모델 간 변환이 복잡합니다. 깔끔하게 구조화하는 방법이 궁금합니다.',
    answer_count: 2,
    view_count: 134,
    created_at: '2025-03-08 15:20:00',
    thumbnail_img_url: null,
  },
  {
    id: 9,
    category: {
      id: 211,
      depth: 3,
      names: ['백엔드', '프로그래밍 언어', 'Python'],
    },
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
    category: {
      id: 122,
      depth: 3,
      names: ['프론트엔드', '웹프레임워크', 'Next.js'],
    },
    author: {
      id: 10,
      nickname: '넥스트_입문자',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 12,
    },
    title: 'Next.js의 SSR과 SSG 차이가 무엇인가요?',
    content_preview:
      'Next.js에서 getServerSideProps와 getStaticProps의 차이를 알고 싶습니다. 어떤 상황에 각각 사용하나요?',
    answer_count: 3,
    view_count: 221,
    created_at: '2025-03-06 14:10:00',
    thumbnail_img_url: '/thumbnail-sample.png',
  },
  {
    id: 11,
    category: {
      id: 232,
      depth: 3,
      names: ['백엔드', 'OS', 'Nginx'],
    },
    author: {
      id: 11,
      nickname: '배포_도전중',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 11,
    },
    title: 'Nginx 리버스 프록시 설정은 어떻게 하나요?',
    content_preview:
      'Django 앱을 배포하려는데 Nginx를 리버스 프록시로 설정하는 방법이 잘 이해가 안 됩니다.',
    answer_count: 6,
    view_count: 445,
    created_at: '2025-03-05 09:30:00',
    thumbnail_img_url: null,
  },
  {
    id: 12,
    category: {
      id: 233,
      depth: 3,
      names: ['백엔드', 'OS', 'Docker'],
    },
    author: {
      id: 12,
      nickname: '도커_입문자',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 13,
    },
    title: 'Docker Compose로 Django + PostgreSQL 환경 구성하는 방법은?',
    content_preview:
      'Docker Compose를 사용해서 Django 앱과 PostgreSQL을 한 번에 실행하고 싶은데 docker-compose.yml 작성법이 궁금합니다.',
    answer_count: 4,
    view_count: 389,
    created_at: '2025-03-04 16:00:00',
    thumbnail_img_url: '/thumbnail-sample.png',
  },
  {
    id: 13,
    category: {
      id: 121,
      depth: 3,
      names: ['프론트엔드', '웹프레임워크', 'React'],
    },
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
    category: {
      id: 112,
      depth: 3,
      names: ['프론트엔드', '프로그래밍 언어', 'TypeScript'],
    },
    author: {
      id: 14,
      nickname: 'TS_첫걸음',
      profile_img_url: null,
      course_name: '프론트엔드 개발자 과정',
      cohort_number: 16,
    },
    title: 'TypeScript에서 제네릭을 왜 사용하나요?',
    content_preview:
      '타입스크립트 제네릭 문법이 복잡한데 이걸 왜 쓰는지, 실제로 어떤 상황에서 유용한지 알고 싶습니다.',
    answer_count: 2,
    view_count: 99,
    created_at: '2025-03-02 13:50:00',
    thumbnail_img_url: null,
  },
  {
    id: 15,
    category: {
      id: 241,
      depth: 3,
      names: ['백엔드', '데이터베이스', 'PostgreSQL'],
    },
    author: {
      id: 15,
      nickname: 'DB_학습자',
      profile_img_url: null,
      course_name: '백엔드 개발자 과정',
      cohort_number: 14,
    },
    title: 'PostgreSQL에서 인덱스는 언제 만들어야 하나요?',
    content_preview:
      '쿼리 성능 최적화를 위해 인덱스를 걸어야 한다고 들었는데, 어떤 컬럼에 인덱스를 만들어야 효과적인지 기준이 궁금합니다.',
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

      if (sort === 'oldest') {
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
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
