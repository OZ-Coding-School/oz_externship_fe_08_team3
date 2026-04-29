import { Dropdown } from '@/components/common/Dropdown'
import { Button } from '@/components/common/Button'
import { useCategorySelector } from '@/hooks/useCategorySelector'

export function CategoryFilter({
  initialCategoryId,
  onApply,
  onClose,
}: {
  initialCategoryId?: number
  onApply: (id: number | undefined) => void
  onClose: () => void
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
    handleReset,
    resolvedCategoryId,
  } = useCategorySelector(initialCategoryId)

  const handleApply = () => {
    onApply(resolvedCategoryId)
    onClose()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
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
          placeholder="중분류 선택"
          disabled={!largeCategoryId || !hasMedium}
        />
        <Dropdown
          options={smallOptions}
          value={validSmallCategoryId}
          onChange={handleSmallChange}
          placeholder="소분류 선택"
          disabled={!validMediumCategoryId || !hasSmall}
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          선택 초기화
        </Button>
        <Button variant="primary" size="sm" onClick={handleApply}>
          필터 적용하기
        </Button>
      </div>
    </div>
  )
}
