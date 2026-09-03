export function toggleFullscreen(el: HTMLElement | null) {
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen().catch(() => {})
  } else {
    void document.exitFullscreen()
  }
}
