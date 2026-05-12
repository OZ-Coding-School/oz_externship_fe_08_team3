import { Suspense, useState } from 'react'
import { RotateCw, X } from 'lucide-react'
import { Modal, LoadingBox, CategoryFilter } from '@/components'

interface CategoryFilterModalProps {
  isOpen: boolean
  onClose: () => void
  categoryId: number | undefined
  onApply: (categoryId: number | undefined) => void
}

// ── 카테고리 필터 모달 ────────────────────────────────────────────

export function CategoryFilterModal({
  isOpen,
  onClose,
  categoryId,
  onApply,
}: CategoryFilterModalProps) {
  // 카테고리 필터 상태 (CategoryFilter에서 전달받음)
  const [filterHandle, setFilterHandle] = useState<{
    resolvedCategoryId: number | undefined
    handleReset: () => void
    canApply: boolean
  }>({ resolvedCategoryId: undefined, handleReset: () => {}, canApply: false })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[580px]"
      hideCloseButton
      footer={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => filterHandle.handleReset()}
            className="flex h-[42px] w-[162px] items-center gap-2 rounded text-xl text-[#4D4D4D] transition-colors hover:bg-gray-100"
          >
            <RotateCw className="h-6 w-6" />
            선택 초기화
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(filterHandle.resolvedCategoryId)
              onClose()
            }}
            disabled={!filterHandle.canApply}
            className="h-[54px] w-[278px] rounded bg-[#6201E0] text-xl font-bold text-white transition-colors hover:bg-[#4E01B3] disabled:bg-[#ECECEC] disabled:text-[#BDBDBD]"
          >
            필터 적용하기
          </button>
        </div>
      }
    >
      {/* 커스텀 헤더 */}
      <div className="-mx-6 -mt-5 mb-0 flex items-center justify-between px-12 pt-11">
        <h2 className="text-[32px] leading-[1.4] font-bold text-[#121212]">
          필터
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded-lg p-1 text-[#9D9D9D] transition-colors hover:text-[#121212]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 본문 */}
      <div className="-mx-6 min-h-[700px] px-12 pt-[60px] pb-10">
        <h3 className="mb-5 text-xl font-bold text-[#4D4D4D]">카테고리 선택</h3>
        <Suspense
          fallback={
            <LoadingBox label="카테고리 불러오는 중..." className="py-8" />
          }
        >
          <CategoryFilter
            initialCategoryId={categoryId}
            onHandle={setFilterHandle}
          />
        </Suspense>
      </div>
    </Modal>
  )
}
