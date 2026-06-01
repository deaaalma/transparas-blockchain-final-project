import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: Validator<T>,
  onSubmit?: (values: T) => void | Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (validate) {
      const errs = validate(values)
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
    }
    setIsSubmitting(true)
    await onSubmit?.(values)
    setIsSubmitting(false)
  }

  function reset() { setValues(initialValues); setErrors({}) }

  return { values, errors, isSubmitting, handleChange, handleSubmit, reset }
}
