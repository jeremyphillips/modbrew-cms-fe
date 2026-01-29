import type { EndpointType, FormActionType } from '~api/base'

type UseNormalizedSubmitArgs<T> = {
  resource: EndpointType
  action: FormActionType
  resourceId: string | null
  buildPayload: () => T
  handleAction: (endpoint: EndpointType, action: FormActionType, payload: T, resourceId?: string | null) => void
  normalize: (payload: T) => T
  onBeforeSubmit?: () => Promise<void> | void
  onAfterSubmit?: () => void
}

export const useNormalizedSubmit = <T>({
  resource,
  action,
  resourceId,
  buildPayload,
  normalize,
  onBeforeSubmit,
  onAfterSubmit,
  handleAction
}: UseNormalizedSubmitArgs<T>) => {
  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (onBeforeSubmit) {
      await onBeforeSubmit()
    }

    const payload = normalize(buildPayload())
    handleAction(resource, action, payload, resourceId)

    onAfterSubmit?.()
  }

  return { submit }
}
