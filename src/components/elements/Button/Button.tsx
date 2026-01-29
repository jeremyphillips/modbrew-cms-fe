import type { ReactElement } from "react"
import { useNavigate } from "react-router-dom"

type ButtonThemeType = 'primary' | 'secondary' | 'danger'
type ButtonSizeType = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  id?: string
  className?: string
  disabled?: boolean
  hideTitle?: boolean
  href?: string
  icon?: ReactElement
  onClick?: () => void
  size?: ButtonSizeType
  text: string
  theme?: ButtonThemeType
  type?: 'submit' | ''
}

const Button = ({
  className = '',
  disabled = false,
  hideTitle = false,
  href,
  icon,
  onClick,
  size = 'md',
  text,
  theme = 'secondary',
  type
}: ButtonProps) => {
  const navigate = useNavigate()

  const handleOnClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      navigate(href)
    }
  }

  const coreClassNames = 'flex gap-1 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 items-center disabled:opacity-50'

  const sizeClassNames = 
    size === 'sm' ?
      'px-2 py-1'
    : size === 'lg' ?
      'px-8 py-4'
    : 'px-6 py-3'

  const themeClassNames = 
    theme === 'primary' ?
      'text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
    : theme === 'secondary' ?
      'text-black bg-gray-50 hover:bg-gray-200 focus:ring-gray-200'
    : theme === 'danger' ? 
      'text-white bg-red-500 hover:bg-red-600 focus:ring-red-400'
    : ''   
  
  return (
    <button
      className={`${coreClassNames} ${sizeClassNames} ${themeClassNames} ${className}`}
      onClick={handleOnClick}
      {...(type ? { type } : {})}
      {...(disabled ? { disabled } : {})}
    >
      {icon && icon}
      <span {...(hideTitle ? { className: 'sr-only' } : {})}>{text}</span>
    </button>  
  )
}

export default Button