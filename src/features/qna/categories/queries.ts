import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { CategoriesResponse } from './types'

const categoriesQueryOptions = queryOptions({
  queryKey: ['qna', 'categories'],
  queryFn: async () => {
    const { data } = await api.get<CategoriesResponse>(
      '/api/v1/qna/categories/'
    )
    return data
  },
})

export function useQnaCategories() {
  return useSuspenseQuery(categoriesQueryOptions)
}
