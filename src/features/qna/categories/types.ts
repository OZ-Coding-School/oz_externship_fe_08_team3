export interface UserCategory {
  id: number
  name: string
  category_type: string
  children: UserCategory[]
}

export type CategoriesResponse = UserCategory[]
