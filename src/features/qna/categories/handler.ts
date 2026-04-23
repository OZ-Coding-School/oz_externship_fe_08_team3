import { http, HttpResponse } from 'msw'
import type { CategoriesResponse } from './types'

const mockCategories: CategoriesResponse = [
  {
    id: 1,
    name: 'Python',
    category_type: 'large',
    children: [
      { id: 11, name: '기초 문법', category_type: 'medium', children: [] },
      { id: 12, name: '자료구조', category_type: 'medium', children: [] },
      { id: 13, name: '알고리즘', category_type: 'medium', children: [] },
    ],
  },
  {
    id: 2,
    name: 'JavaScript',
    category_type: 'large',
    children: [
      { id: 21, name: 'ES6+', category_type: 'medium', children: [] },
      { id: 22, name: 'DOM', category_type: 'medium', children: [] },
      { id: 23, name: '비동기', category_type: 'medium', children: [] },
    ],
  },
  {
    id: 3,
    name: 'React',
    category_type: 'large',
    children: [
      { id: 31, name: 'Hooks', category_type: 'medium', children: [] },
      { id: 32, name: '상태 관리', category_type: 'medium', children: [] },
      { id: 33, name: '라우팅', category_type: 'medium', children: [] },
    ],
  },
  {
    id: 4,
    name: 'Django',
    category_type: 'large',
    children: [
      { id: 41, name: 'ORM', category_type: 'medium', children: [] },
      { id: 42, name: 'REST API', category_type: 'medium', children: [] },
    ],
  },
]

export const categoriesHandler = [
  http.get('/api/v1/qna/categories/', () => {
    return HttpResponse.json(mockCategories)
  }),
]
