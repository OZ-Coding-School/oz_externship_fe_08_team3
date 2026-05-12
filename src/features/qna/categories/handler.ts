import { http, HttpResponse } from 'msw'
import type { CategoriesResponse } from './types'

const mockCategories: CategoriesResponse = [
  {
    id: 1,
    name: '프론트엔드',
    category_type: 'large',
    children: [
      {
        id: 11,
        name: '프로그래밍 언어',
        category_type: 'medium',
        children: [
          {
            id: 111,
            name: 'JavaScript',
            category_type: 'small',
            children: [],
          },
          {
            id: 112,
            name: 'TypeScript',
            category_type: 'small',
            children: [],
          },
        ],
      },
      {
        id: 12,
        name: '웹프레임워크',
        category_type: 'medium',
        children: [
          { id: 121, name: 'React', category_type: 'small', children: [] },
          { id: 122, name: 'Next.js', category_type: 'small', children: [] },
          { id: 123, name: 'Vue.js', category_type: 'small', children: [] },
        ],
      },
      {
        id: 13,
        name: 'Web',
        category_type: 'medium',
        children: [
          { id: 131, name: 'HTML/CSS', category_type: 'small', children: [] },
          { id: 132, name: 'DOM', category_type: 'small', children: [] },
          {
            id: 133,
            name: '브라우저',
            category_type: 'small',
            children: [],
          },
        ],
      },
      {
        id: 14,
        name: '라이브러리',
        category_type: 'medium',
        children: [
          {
            id: 141,
            name: 'Tailwind CSS',
            category_type: 'small',
            children: [],
          },
          { id: 142, name: 'Zustand', category_type: 'small', children: [] },
          {
            id: 143,
            name: 'React Query',
            category_type: 'small',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '백엔드',
    category_type: 'large',
    children: [
      {
        id: 21,
        name: '프로그래밍 언어',
        category_type: 'medium',
        children: [
          { id: 211, name: 'Python', category_type: 'small', children: [] },
          { id: 212, name: 'Java', category_type: 'small', children: [] },
          { id: 213, name: 'Go', category_type: 'small', children: [] },
        ],
      },
      {
        id: 22,
        name: '웹프레임워크',
        category_type: 'medium',
        children: [
          { id: 221, name: 'Django', category_type: 'small', children: [] },
          { id: 222, name: 'FastAPI', category_type: 'small', children: [] },
          {
            id: 223,
            name: 'Spring Boot',
            category_type: 'small',
            children: [],
          },
        ],
      },
      {
        id: 23,
        name: 'OS',
        category_type: 'medium',
        children: [
          { id: 231, name: 'Linux', category_type: 'small', children: [] },
          { id: 232, name: 'Nginx', category_type: 'small', children: [] },
          { id: 233, name: 'Docker', category_type: 'small', children: [] },
        ],
      },
      {
        id: 24,
        name: '데이터베이스',
        category_type: 'medium',
        children: [
          {
            id: 241,
            name: 'PostgreSQL',
            category_type: 'small',
            children: [],
          },
          { id: 242, name: 'MySQL', category_type: 'small', children: [] },
          { id: 243, name: 'Redis', category_type: 'small', children: [] },
        ],
      },
    ],
  },
]

export const categoriesHandler = [
  http.get(`${import.meta.env.VITE_API_BASE_URL}/qna/categories`, () => {
    return HttpResponse.json(mockCategories)
  }),
]
