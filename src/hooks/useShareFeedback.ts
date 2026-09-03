import { useCallback, useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'

export type ShareFeedbackToast = { message: string; tone: 'success' | 'error' }

type UseShareFeedbackOptions = {
  shareUrl: string
  itemModal: MediaItem | null
  eventoNombre?: string
}

export function useShareFeedback({ shareUrl, itemModal, eventoNombre }: UseShareFeedbackOptions) {
  const [feedbackToast, setFeedbackToast] = useState<ShareFeedbackToast | null>(null)
  const feedbackTimerRef = useRef<number | null>(null)

  const setFeedback = useCallback((message: string, tone: 'success' | 'error') => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current)
    }
    setFeedbackToast({ message, tone })
    feedbackTimerRef.current = window.setTimeout(() => setFeedbackToast(null), 2200)
  }, [])

  const copiarEnlace = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setFeedback('Enlace copiado', 'success')
    } catch {
      setFeedback('No se pudo copiar el enlace', 'error')
    }
  }, [shareUrl, setFeedback])

  const compartir = useCallback(async () => {
    if (!shareUrl || !itemModal) return
    const title = eventoNombre ? `${eventoNombre} · DJ Carlos Hermida` : 'DJ Carlos Hermida'
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: shareUrl })
        setFeedback('Contenido compartido', 'success')
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        await copiarEnlace()
      }
    } else {
      await copiarEnlace()
    }
  }, [shareUrl, itemModal, eventoNombre, copiarEnlace, setFeedback])

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current)
      }
    }
  }, [])

  return { feedbackToast, copiarEnlace, compartir }
}
