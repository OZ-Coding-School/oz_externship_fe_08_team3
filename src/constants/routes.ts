export const ROUTES = {
  HOME: '/',

  AUTH: {
    LOGIN: '/login',
  },

  SIGNUP: {
    SELECT: '/signup',
    FORM: '/signup/form',
  },

  MYPAGE: {
    HOME: '/mypage',
    EDIT: '/mypage/edit',
    CHANGE_PASSWORD: '/mypage/change-password',
    QUIZ: '/mypage/quiz',
  },

  QUIZ: {
    EXAM: '/quiz/:quizId/exam',
    RESULT: '/quiz/:quizId/result',
  },

  QNA: {
    LIST: '/qna',
    WRITE: '/qna/write',
    DETAIL: '/qna/:questionId',
    EDIT: '/qna/:questionId/edit',
  },

  COMMUNITY: {
    LIST: '/community',
    WRITE: '/community/write',
    DETAIL: '/community/:postId',
    EDIT: '/community/:postId/edit',
  },
} as const
