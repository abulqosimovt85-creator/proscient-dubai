import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200'
    const styles =
      variant === 'primary'
        ? 'bg-brand-700 text-white hover:bg-brand-800 shadow-[0_16px_40px_rgba(9,30,66,0.18)]'
        : 'border border-slate-300 bg-white text-slate-900 hover:border-slate-400'

    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
