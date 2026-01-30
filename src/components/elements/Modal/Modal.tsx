import { type ReactNode, useEffect } from 'react'
import { Button } from '~elements'
import type { ButtonProps } from 'components/elements/Button/Button'

type ModalWidthType = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  width?: ModalWidthType
  headline?: string
  description?: string
  buttons?: ButtonProps[]
  children?: ReactNode
}

const Modal = ({ isOpen, onClose, width = 'md', headline, description, buttons = [], children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const coreClassNames = 'fixed inset-0 z-50 flex items-center justify-center'

  const overlayClassNames = 'absolute inset-0 bg-black/50 backdrop-blur-sm'

  const modalBaseClassNames = 'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto'

  const widthClassNamesMap: Record<ModalWidthType, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return (
    <div className={coreClassNames}>
      <div className={overlayClassNames} onClick={onClose} />

      <div className={`${modalBaseClassNames} ${widthClassNamesMap[width]} p-6`} onClick={e => e.stopPropagation()}>
        {(headline || description) && (
          <header className="mb-4">
            {headline && <h3 className="text-lg font-semibold text-gray-900">{headline}</h3>}
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          </header>
        )}

        {children && <div className="mb-6">{children}</div>}

        {buttons.length > 0 && (
          <footer className="flex justify-end gap-2">
            {buttons.map(button => (
              <Button key={button.id} {...button} />
            ))}
          </footer>
        )}
      </div>
    </div>
  )
}

export default Modal
