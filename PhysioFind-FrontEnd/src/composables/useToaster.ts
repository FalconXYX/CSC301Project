const TOAST_DURATION = 4000

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  markdown?: boolean
  html?: string
  permanent?: boolean
}

interface ToastOptions {
  html?: Toast['html']
  permanent?: boolean
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToaster() {
  function add(toast: Omit<Toast, 'id'>): void {
    const id = nextId++
    toasts.value.push({ ...toast, id })

    if (!toast.permanent) {
      setTimeout(() => remove(id), TOAST_DURATION)
    }
  }

  function remove(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  // Convenience methods for common toast types
  const success = (msg: string, opts?: ToastOptions) =>
    add({ ...opts, message: msg, type: 'success' })
  const error = (msg: string, opts?: ToastOptions) => add({ ...opts, message: msg, type: 'error' })
  const info = (msg: string, opts?: ToastOptions) => add({ ...opts, message: msg, type: 'info' })

  return { toasts, add, remove, success, error, info }
}
