import { http, HttpResponse } from 'msw'
import type { CategoriesResponse } from './types'

const mockCategories: CategoriesResponse = [
  {
    id: 1,
    name: 'Python',
    category_type: 'large',
    children: [
      {
        id: 11,
        name: '기초 문법',
        category_type: 'medium',
        children: [
          {
            id: 111,
            name: '변수와 타입',
            category_type: 'small',
            children: [],
          },
          {
            id: 112,
            name: '조건문/반복문',
            category_type: 'small',
            children: [],
          },
          { id: 113, name: '함수', category_type: 'small', children: [] },
        ],
      },
      {
        id: 12,
        name: '자료구조',
        category_type: 'medium',
        children: [
          {
            id: 121,
            name: '리스트/튜플',
            category_type: 'small',
            children: [],
          },
          {
            id: 122,
            name: '딕셔너리/셋',
            category_type: 'small',
            children: [],
          },
        ],
      },
      { id: 13, name: '알고리즘', category_type: 'medium', children: [] },
    ],
  },
  {
    id: 2,
    name: 'JavaScript',
    category_type: 'large',
    children: [
      {
        id: 21,
        name: 'ES6+',
        category_type: 'medium',
        children: [
          {
            id: 211,
            name: '화살표 함수',
            category_type: 'small',
            children: [],
          },
          {
            id: 212,
            name: '구조 분해 할당',
            category_type: 'small',
            children: [],
          },
          {
            id: 213,
            name: '모듈 시스템',
            category_type: 'small',
            children: [],
          },
        ],
      },
      { id: 22, name: 'DOM', category_type: 'medium', children: [] },
      { id: 23, name: '비동기', category_type: 'medium', children: [] },
    ],
  },
  {
    id: 3,
    name: 'React',
    category_type: 'large',
    children: [
      {
        id: 31,
        name: 'Hooks',
        category_type: 'medium',
        children: [
          {
            id: 311,
            name: 'useState/useEffect',
            category_type: 'small',
            children: [],
          },
          {
            id: 312,
            name: 'useRef/useMemo',
            category_type: 'small',
            children: [],
          },
          { id: 313, name: '커스텀 훅', category_type: 'small', children: [] },
        ],
      },
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
  http.get(`${import.meta.env.VITE_API_BASE_URL}/qna/categories/`, () => {
    return HttpResponse.json(mockCategories)
  }),
]
