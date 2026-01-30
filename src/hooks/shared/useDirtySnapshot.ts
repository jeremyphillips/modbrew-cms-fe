import { useEffect, useMemo, useState, useCallback } from 'react'

const useDirtySnapshot = <T, D extends unknown[]>({
  buildPayload,
  normalize,
  deps,
}: {
  buildPayload: () => T
  normalize: (payload: T) => T
  deps: Readonly<D>
}) => {
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null)

  // Wrap buildPayload and normalize in useCallback to stabilize references
  const memoizedBuild = useCallback(buildPayload, deps)
  const memoizedNormalize = useCallback(normalize, deps)

  // Capture initial snapshot AFTER data hydrates
  useEffect(() => {
    if (!initialSnapshot) {
      const payload = memoizedNormalize(memoizedBuild())
      setInitialSnapshot(JSON.stringify(payload))
    }
  }, [initialSnapshot, memoizedBuild, memoizedNormalize])

  const isDirty = useMemo(() => {
    if (!initialSnapshot) return false
    const current = memoizedNormalize(memoizedBuild())
    return JSON.stringify(current) !== initialSnapshot
  }, [initialSnapshot, memoizedBuild, memoizedNormalize])

  const resetDirty = useCallback(() => {
    const payload = memoizedNormalize(memoizedBuild())
    setInitialSnapshot(JSON.stringify(payload))
  }, [memoizedBuild, memoizedNormalize])

  return { isDirty, resetDirty }
}

export default useDirtySnapshot
