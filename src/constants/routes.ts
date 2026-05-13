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
