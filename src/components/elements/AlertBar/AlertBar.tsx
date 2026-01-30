import { useEffect, useState } from 'react'

export type AlertBarStatusType = 'success' | 'error'

export interface AlertBarProps {
  id?: string
  message: string
  status?: AlertBarStatusType
  autoDismiss?: boolean
}

const AlertBar = ({ message, status = 'success', autoDismiss = false }: AlertBarProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!autoDismiss || !message) return

    setVisible(false)

    const fadeIn = setTimeout(() => {
      setVisible(true)
    }, 10)

    const fadeOut = setTimeout(() => {
      setVisible(false)
    }, 3000)

    return () => {
      clearTimeout(fadeIn)
      clearTimeout(fadeOut)
    }
  }, [message, autoDismiss])

  return (
    <div
      className={`
        alert alert--${status}
        fixed top-0 left-0 z-40 w-full
        transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <p>{message}</p>
    </div>
  )
}

export default AlertBar
