export const ROUTES = {
  QNA: {
    LIST: '/qna',
    WRITE: '/qna/write',
    DETAIL: '/qna/:questionId',
    EDIT: '/qna/:questionId/edit',
  },

  COMMUNITY: {
    LIST: '/community',
  },
} as const
