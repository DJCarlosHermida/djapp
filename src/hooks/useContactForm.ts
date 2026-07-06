import { useCallback, useState, type FormEvent } from 'react'

export type ContactSubmitStatus = 'idle' | 'loading' | 'success' | 'error'

type UseContactFormOptions = {
  onSuccess?: () => void
}

export function useContactForm({ onSuccess }: UseContactFormOptions = {}) {
  const [status, setStatus] = useState<ContactSubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetStatus = useCallback(() => {
    setStatus('idle')
    setErrorMessage(null)
    setSuccessMessage(null)
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<boolean> => {
    event.preventDefault()
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const name = formData.get('name')?.toString() ?? ''
    const lastname = formData.get('lastname')?.toString() ?? ''
    const phone = formData.get('phone')?.toString() ?? ''
    const email = formData.get('Email')?.toString() ?? ''
    const message = formData.get('message')?.toString() ?? ''
    const service = formData.get('service')?.toString() ?? ''
    const opcionDj = formData.get('opcionDj')?.toString() ?? ''

    setStatus('loading')
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastname, email, phone, message, service, opcionDj }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        message?: string
      }

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'No se pudo enviar la consulta.')
      }

      formElement.reset()
      setStatus('success')
      setSuccessMessage(data.message ?? '¡Consulta recibida! Te contactaré a la brevedad.')
      onSuccess?.()
      return true
    } catch (err) {
      setStatus('error')
      const fallback =
        err instanceof Error
          ? err.message
          : 'Error de conexión. Probá de nuevo o escribinos por WhatsApp.'
      setErrorMessage(fallback)
      return false
    }
  }

  return {
    handleSubmit,
    status,
    errorMessage,
    successMessage,
    resetStatus,
  }
}
