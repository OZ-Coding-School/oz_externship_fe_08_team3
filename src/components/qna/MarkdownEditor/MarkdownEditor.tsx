import {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Toast } from '@/components/common/Toast'
import { useGetPresignedUrl } from '@/features/qna/presigned-url'

const TOAST_ERROR_DURATION_MS = 3000

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  imageUrls: string[]
  onImageUrlsChange: (urls: string[]) => void
  error?: boolean
  height?: number
}

export interface MarkdownEditorHandle {
  focus: () => void
}

type UploadToast =
  | { visible: false }
  | { visible: true; message: string; variant: 'info' | 'error' }

export const MarkdownEditor = forwardRef<
  MarkdownEditorHandle,
  MarkdownEditorProps
>(function MarkdownEditor(
  {
    value,
    onChange,
    imageUrls,
    onImageUrlsChange,
    error = false,
    height = 400,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const valueRef = useRef(value)
  valueRef.current = value
  const imageUrlsRef = useRef(imageUrls)
  imageUrlsRef.current = imageUrls
  const [uploadToast, setUploadToast] = useState<UploadToast>({
    visible: false,
  })
  const { mutateAsync: getPresignedUrl } = useGetPresignedUrl()

  useImperativeHandle(ref, () => ({
    focus: () => {
      const textarea =
        containerRef.current?.querySelector<HTMLTextAreaElement>('textarea')
      textarea?.focus()
    },
  }))

  const uploadImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setUploadToast({
          visible: true,
          message: '이미지 파일만 업로드할 수 있습니다.',
          variant: 'error',
        })
        return
      }

      setUploadToast({
        visible: true,
        message: '이미지 업로드 중...',
        variant: 'info',
      })

      try {
        const { presigned_url, img_url } = await getPresignedUrl({
          file_name: file.name,
        })

        try {
          await fetch(presigned_url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          })
        } catch (err) {
          if (!import.meta.env.DEV) throw err
          // 개발 환경(MSW)에서만 S3 업로드 실패 무시
        }

        const imageMarkdown = `![image](${img_url})`
        const currentValue = valueRef.current
        onChange(
          currentValue ? `${currentValue}\n${imageMarkdown}` : imageMarkdown
        )
        onImageUrlsChange([...imageUrlsRef.current, img_url])
        setUploadToast({ visible: false })
      } catch {
        setUploadToast({
          visible: true,
          message: '이미지 업로드에 실패했습니다.',
          variant: 'error',
        })
      }
    },
    [getPresignedUrl, onChange, onImageUrlsChange]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) uploadImage(file)
      e.target.value = ''
    },
    [uploadImage]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file) uploadImage(file)
    },
    [uploadImage]
  )

  return (
    <div
      ref={containerRef}
      data-color-mode="light"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={[
        'rounded border',
        error ? 'border-error ring-error/30 ring-2' : 'border-border-base',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 이미지 첨부 버튼 */}
      <div className="border-border-base bg-bg-muted flex items-center gap-2 border-b px-3 py-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-primary hover:bg-primary-100 active:bg-primary-200 inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors"
        >
          <ImageIcon />
          이미지 첨부
        </button>
        <span className="text-text-muted text-xs">
          또는 에디터에 드래그 앤 드롭
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* MDEditor */}
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        preview="live"
        height={height}
        style={{ borderRadius: 0, border: 'none' }}
      />

      {/* 업로드 토스트 */}
      {uploadToast.visible && (
        <Toast
          message={uploadToast.message}
          variant={uploadToast.variant === 'info' ? 'info' : 'error'}
          duration={
            uploadToast.variant === 'error' ? TOAST_ERROR_DURATION_MS : 0
          }
          onClose={() => setUploadToast({ visible: false })}
        />
      )}
    </div>
  )
})

function ImageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path
        d="M21 15l-5-5L5 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
