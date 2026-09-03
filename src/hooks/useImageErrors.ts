import { useCallback, useState } from 'react'

export function useImageErrors() {
  const [imagenesConError, setImagenesConError] = useState<Set<string>>(new Set())

  const marcarImagenError = useCallback((imageKey: string) => {
    setImagenesConError((prev) => {
      if (prev.has(imageKey)) return prev
      const next = new Set(prev)
      next.add(imageKey)
      return next
    })
  }, [])

  return { imagenesConError, marcarImagenError }
}
