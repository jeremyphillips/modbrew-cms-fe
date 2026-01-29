import { useCallback, useState } from 'react'

export const useModal = (initialOpen = false) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(initialOpen)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])
  const toggleModal = useCallback(() => setIsModalOpen(prev => !prev), [])

  return {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal
  }
}