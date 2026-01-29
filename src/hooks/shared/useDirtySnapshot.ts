import { useEffect, useMemo, useState } from 'react'

export const useDirtySnapshot = <T, D extends unknown[]>({
  buildPayload,
  normalize,
  deps
}: {
  buildPayload: () => T
  normalize: (payload: T) => T
  deps: Readonly<D>
}) => {
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null)

  // Capture initial snapshot AFTER data hydrates
  useEffect(() => {
    if (!initialSnapshot) {
      const payload = normalize(buildPayload())
      setInitialSnapshot(JSON.stringify(payload))
    }
  }, deps)

  const isDirty = useMemo(() => {
    if (!initialSnapshot) return false
    const current = normalize(buildPayload())
    return JSON.stringify(current) !== initialSnapshot
  }, [...deps, initialSnapshot])

  const resetDirty = () => {
    const payload = normalize(buildPayload())
    setInitialSnapshot(JSON.stringify(payload))
  }

  return { isDirty, resetDirty }
}
