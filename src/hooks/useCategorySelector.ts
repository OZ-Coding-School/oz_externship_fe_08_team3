import { useState } from 'react'
import { useQnaCategories } from '@/features/qna/categories'
import type { UserCategory } from '@/features/qna/categories'

function findCategoryPath(
  categories: UserCategory[],
  targetId: number | undefined
): { large: string; medium: string; small: string } {
  if (!targetId) return { large: '', medium: '', small: '' }
  for (const large of categories) {
    if (large.id === targetId)
      return { large: String(large.id), medium: '', small: '' }
    for (const medium of large.children) {
      if (medium.id === targetId)
        return { large: String(large.id), medium: String(medium.id), small: '' }
      for (const small of medium.children) {
        if (small.id === targetId)
          return {
            large: String(large.id),
            medium: String(medium.id),
            small: String(small.id),
          }
      }
    }
  }
  return { large: '', medium: '', small: '' }
}

export function useCategorySelector(initialCategoryId?: number) {
  const { data: categories } = useQnaCategories()

  const initialPath = findCategoryPath(categories, initialCategoryId)
  const [largeCategoryId, setLargeCategoryId] = useState(initialPath.large)
  const [mediumCategoryId, setMediumCategoryId] = useState(initialPath.medium)
  const [smallCategoryId, setSmallCategoryId] = useState(initialPath.small)

  const largeOptions = categories.map((cat: UserCategory) => ({
    value: String(cat.id),
    label: cat.name,
  }))

  const selectedLarge = categories.find(
    (cat: UserCategory) => String(cat.id) === largeCategoryId
  )

  const mediumOptions =
    selectedLarge?.children.map((child: UserCategory) => ({
      value: String(child.id),
      label: child.name,
    })) ?? []

  const hasMedium = mediumOptions.length > 0
  const isMediumValid = mediumOptions.some((o) => o.value === mediumCategoryId)
  const validMediumCategoryId = isMediumValid ? mediumCategoryId : ''

  const selectedMedium = selectedLarge?.children.find(
    (c: UserCategory) => String(c.id) === validMediumCategoryId
  )

  const smallOptions =
    selectedMedium?.children.map((child: UserCategory) => ({
      value: String(child.id),
      label: child.name,
    })) ?? []

  const hasSmall = smallOptions.length > 0
  const isSmallValid = smallOptions.some((o) => o.value === smallCategoryId)
  const validSmallCategoryId = isSmallValid ? smallCategoryId : ''

  const handleLargeChange = (value: string) => {
    setLargeCategoryId(value)
    setMediumCategoryId('')
    setSmallCategoryId('')
  }

  const handleMediumChange = (value: string) => {
    setMediumCategoryId(value)
    setSmallCategoryId('')
  }

  const handleSmallChange = (value: string) => {
    setSmallCategoryId(value)
  }

  const handleReset = () => {
    setLargeCategoryId('')
    setMediumCategoryId('')
    setSmallCategoryId('')
  }

  let resolvedCategoryId: number | undefined
  if (hasSmall) {
    resolvedCategoryId = Number(validSmallCategoryId)
  } else if (hasMedium) {
    resolvedCategoryId = Number(validMediumCategoryId)
  } else if (largeCategoryId) {
    resolvedCategoryId = Number(largeCategoryId)
  }

  return {
    largeCategoryId,
    mediumCategoryId,
    smallCategoryId,
    largeOptions,
    mediumOptions,
    smallOptions,
    validMediumCategoryId,
    validSmallCategoryId,
    hasMedium,
    hasSmall,
    handleLargeChange,
    handleMediumChange,
    handleSmallChange,
    handleReset,
    resolvedCategoryId,
  }
}
