import { useEffect } from 'react'
import { Dropdown } from '@/components/common/Dropdown'
import { useCategorySelector } from '@/hooks/useCategorySelector'

export interface CategoryFilterHandle {
  resolvedCategoryId: number | undefined
  handleReset: () => void
  canApply: boolean
}

export function CategoryFilter({
  selectedId,
  onChange,
}: {
  selectedId?: number
  onChange?: (id: number | undefined) => void
}) {
  const {
    largeCategoryId,
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
    resolvedCategoryId,
  } = useCategorySelector(selectedId)

  // effect로 부모에게 핸들 전달 (렌더 중 setState 방지)
  useEffect(() => {
    onChange?.(resolvedCategoryId)
  }, [resolvedCategoryId, onChange])

  return (
    <div className="flex flex-col gap-5">
      <Dropdown
        options={largeOptions}
        value={largeCategoryId}
        onChange={handleLargeChange}
        placeholder="대분류 선택"
      />
      <Dropdown
        options={mediumOptions}
        value={validMediumCategoryId}
        onChange={handleMediumChange}
        placeholder="해당되는 항목을 선택해 주세요."
        disabled={!largeCategoryId || !hasMedium}
      />
      <Dropdown
        options={smallOptions}
        value={validSmallCategoryId}
        onChange={handleSmallChange}
        placeholder="해당되는 항목을 선택해 주세요."
        disabled={!validMediumCategoryId || !hasSmall}
      />
    </div>
  )
}
