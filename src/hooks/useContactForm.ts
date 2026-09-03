import { useCallback, useState, type FormEvent } from 'react'
import { validateContactFields } from '../contactValidation'

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

    const fields = {
      name: formData.get('name')?.toString() ?? '',
      lastname: formData.get('lastname')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      message: formData.get('message')?.toString() ?? '',
      service: formData.get('service')?.toString() ?? '',
      opcionDj: formData.get('opcionDj')?.toString() ?? '',
      website: formData.get('website')?.toString() ?? '',
    }

    const parsed = validateContactFields(fields)
    if (!parsed.ok) {
      setStatus('error')
      setErrorMessage(parsed.error)
      setSuccessMessage(null)
      return false
    }

    setStatus('loading')
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, website: fields.website }),
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
