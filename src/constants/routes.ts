export const ROUTES = {
  /* Todo: 도메인 지정 후 추가 필요  */
  HOME: '',

  AUTH: {
    LOGIN: '',
  },

  SIGNUP: {
    SELECT: '',
    FORM: '',
  },

  MYPAGE: {
    HOME: '',
    EDIT: '',
    CHANGE_PASSWORD: '',
    QUIZ: '',
  },

  QUIZ: {
    EXAM: '',
    RESULT: '',
  },

  QNA: {
    LIST: '/qna',
    WRITE: '/qna/write',
    DETAIL: '/qna/:questionId',
    EDIT: '/qna/:questionId/edit',
  },

  COMMUNITY: {
    LIST: '',
    WRITE: '',
    DETAIL: '',
    EDIT: '',
  },
} as const
