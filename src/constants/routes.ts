// 외부 도메인 URL (헤더 네비게이션용)
export const EXTERNAL_URLS = {
  HOME: 'https://my.ozcodingschool.site/',
  LOGIN: 'https://my.ozcodingschool.site/login',
  SIGNUP: 'https://my.ozcodingschool.site/signup',
  ENROLL: 'http://my.ozcodingschool.site/enroll',
  MYPAGE: 'https://my.ozcodingschool.site/mypage',
  COMMUNITY: 'https://community.ozcodingschool.site/community',
  QNA: 'https://qna.ozcodingschool.site/',
} as const

// SPA 내부 라우트
export const ROUTES = {
  HOME: '/',

  AUTH: {
    LOGIN: '/login',
  },

  SIGNUP: {
    SELECT: '/signup',
    FORM: '/signup/general',
  },

  MYPAGE: {
    HOME: '/mypage',
    EDIT: '/mypage/edit',
    CHANGE_PASSWORD: '/mypage/change-password',
    QUIZ: '/mypage/quiz',
  },

  QUIZ: {
    EXAM: '/quiz/:quizId',
    RESULT: '/quiz/:quizId/result',
  },

  QNA: {
    LIST: '/qna',
    WRITE: '/qna/write',
    DETAIL: '/qna/:questionId',
    EDIT: '/qna/:questionId/edit',
  },

  CHATBOT: {
    HOME: '/chatbot',
  },

  COMMUNITY: {
    LIST: '/community',
    WRITE: '/community/write',
    DETAIL: '/community/:postId',
    EDIT: '/community/:postId/edit',
  },
} as const
