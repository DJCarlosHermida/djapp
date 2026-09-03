import { useCallback, useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { isInlineYoutubeItem } from '../components/galeria/galeriaUtils'
import { toggleFullscreen } from '../dom/fullscreen'

export function useGaleriaLightbox(items: MediaItem[]) {
  const [itemModal, setItemModal] = useState<MediaItem | null>(null)
  const lightboxYoutubeWrapRef = useRef<HTMLDivElement>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const closeModal = useCallback(() => {
    setItemModal(null)
    window.setTimeout(() => {
      lastFocusedElementRef.current?.focus()
    }, 0)
  }, [])

  const currentIndex = itemModal ? items.findIndex((it) => it.id === itemModal.id && it.url === itemModal.url) : -1

  const goPrev = useCallback(() => {
    let idx = currentIndex
    while (idx > 0) {
      idx--
      const it = items[idx]
      if (!isInlineYoutubeItem(it)) {
        setItemModal(it)
        return
      }
    }
  }, [items, currentIndex])

  const goNext = useCallback(() => {
    let idx = currentIndex
    while (idx < items.length - 1) {
      idx++
      const it = items[idx]
      if (!isInlineYoutubeItem(it)) {
        setItemModal(it)
        return
      }
    }
  }, [items, currentIndex])

  const rememberFocus = useCallback((el: HTMLElement | null) => {
    lastFocusedElementRef.current = el
  }, [])

  const openItem = useCallback((item: MediaItem, focusEl?: HTMLElement | null) => {
    if (focusEl) lastFocusedElementRef.current = focusEl
    setItemModal(item)
  }, [])

  const toggleYoutubeFullscreen = useCallback(() => {
    toggleFullscreen(lightboxYoutubeWrapRef.current)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!itemModal) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'Tab') {
        const overlay = modalOverlayRef.current
        if (!overlay) return
        const focusable = Array.from(
          overlay.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }
    if (itemModal) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
      window.setTimeout(() => closeButtonRef.current?.focus(), 0)
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [itemModal, closeModal, goPrev, goNext])

  return {
    itemModal,
    currentIndex,
    closeModal,
    goPrev,
    goNext,
    openItem,
    rememberFocus,
    modalOverlayRef,
    closeButtonRef,
    touchStartXRef,
    lightboxYoutubeWrapRef,
    toggleYoutubeFullscreen,
  }
}
