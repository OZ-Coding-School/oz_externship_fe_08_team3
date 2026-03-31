import { forwardRef, useState } from 'react'
import { Input, type InputProps } from '../Input'
import { EyeOpenIcon, EyeClosedIcon } from './icons'

export interface PasswordInputProps extends Omit<
  InputProps,
  'type' | 'rightElement'
> {
  defaultVisible?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ defaultVisible = false, ...props }, ref) {
    const [visible, setVisible] = useState(defaultVisible)

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightElement={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
            className="cursor-pointer p-0.5 text-gray-400 transition-colors duration-150 hover:text-gray-600"
          >
            {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        }
        {...props}
      />
    )
  }
)
