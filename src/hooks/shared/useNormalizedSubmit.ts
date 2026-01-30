import type { EndpointType, FormActionType } from '~api/base'

export interface UseNormalizedSubmitArgs<TPayload> {
  resource: EndpointType
  action: FormActionType
  resourceId?: string
  buildPayload: () => TPayload
  normalize: (payload: TPayload) => TPayload
  onBeforeSubmit?: () => Promise<void> | void
  onAfterSubmit?: () => void
  handleAction: (endpoint: EndpointType, action: FormActionType, payload: TPayload, resourceId?: string) => void
}

const useNormalizedSubmit = <T>({
  resource,
  action,
  resourceId,
  buildPayload,
  normalize,
  onBeforeSubmit,
  onAfterSubmit,
  handleAction,
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

export default useNormalizedSubmit
