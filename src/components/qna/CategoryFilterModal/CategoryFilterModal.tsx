import { Suspense, useState } from 'react'
import { RotateCw, X } from 'lucide-react'
import { Modal, LoadingBox, CategoryFilter } from '@/components'

interface CategoryFilterModalProps {
  isOpen: boolean
  onClose: () => void
  categoryId: number | undefined
  onApply: (categoryId: number | undefined) => void
}

export function CategoryFilterModal({
  isOpen,
  onClose,
  categoryId,
  onApply,
}: CategoryFilterModalProps) {
  // 모달 내부 임시 선택 상태 (적용 전까지 URL에 반영 안 됨)
  const [tempCategoryId, setTempCategoryId] = useState<number | undefined>(
    categoryId
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[580px]"
      hideCloseButton
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setTempCategoryId(undefined)}
            className="flex h-[42px] shrink-0 items-center gap-2 rounded px-2 text-base text-gray-600 transition-colors hover:bg-gray-100 sm:w-[162px] sm:text-xl"
          >
            <RotateCw className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            선택 초기화
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(tempCategoryId)
              onClose()
            }}
            className="bg-primary hover:bg-primary-800 disabled:bg-disable h-[54px] min-w-0 flex-1 rounded px-4 text-base font-bold text-white transition-colors disabled:text-gray-400 sm:w-[278px] sm:flex-none sm:text-xl"
          >
            필터 적용하기
          </button>
        </div>
      }
    >
      {/* 커스텀 헤더 */}
      <div className="-mx-6 -mt-5 mb-0 flex items-center justify-between px-6 pt-8 sm:px-12 sm:pt-11">
        <h2 className="text-2xl leading-[1.4] font-bold text-gray-900 sm:text-[32px]">
          필터
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-900"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="-mx-6 min-h-[420px] px-6 pt-10 pb-8 sm:min-h-[700px] sm:px-12 sm:pt-[60px] sm:pb-10">
        <h3 className="mb-5 text-xl font-bold text-gray-600">카테고리 선택</h3>
        <Suspense
          fallback={
            <LoadingBox label="카테고리 불러오는 중..." className="py-8" />
          }
        >
          <CategoryFilter
            selectedId={tempCategoryId}
            onChange={setTempCategoryId}
          />
        </Suspense>
      </div>
    </Modal>
  )
}
