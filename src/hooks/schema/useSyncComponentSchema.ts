import { useCallback } from 'react'
import { bulkUpdateComponentContent, fetchAllComponentContent } from '~api/componentContent'
import { getRenamedFields } from '~helpers'
import type { ComponentContentApiPayloadItem } from '~api/componentContent'
import type { ComponentSchemaField } from '~api/componentSchema'

const useSyncComponentSchema = () => {
  const syncSchema = useCallback(
    async ({
      schemaId,
      prevSchema,
      nextSchema,
    }: {
      schemaId: string
      prevSchema: ComponentSchemaField[]
      nextSchema: ComponentSchemaField[]
    }) => {
      if (!schemaId || !prevSchema || !nextSchema) return

      let instances: ComponentContentApiPayloadItem[] = []

      try {
        instances = await fetchAllComponentContent({ schemaId })
      } catch (err) {
        console.error(`Failed to fetch component content with schema id ${schemaId}:`, err)
        return
      }

      const renames = getRenamedFields(prevSchema, nextSchema)
      if (!renames.length) return

      const updates = instances.map(instance => {
        const updatedProps = { ...instance.props }
        renames.forEach(({ from, to }) => {
          if (from in updatedProps) {
            updatedProps[to] = updatedProps[from]
            delete updatedProps[from]
          }
        })
        return { id: instance._id, props: updatedProps }
      })

      if (!updates.length) return

      try {
        await bulkUpdateComponentContent(updates)
      } catch (err) {
        console.error('Bulk update failed', err)
      }
    },
    []
  )

  return { syncSchema }
}

export default useSyncComponentSchema
