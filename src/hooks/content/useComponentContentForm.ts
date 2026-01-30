import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAllComponentSchemas } from '~api/componentSchema'
import { fetchComponentContentById } from '~api/componentContent'
import type { ComponentContentApiPayloadItem, ComponentContentProps } from '~api/componentContent'
import type { ComponentSchemaApiPayloadItem } from '~api/componentSchema'

interface UseComponentContentFormOptions {
  initialValues?: Partial<ComponentContentApiPayloadItem>
  defaultSchemaId?: string | null
}

const useComponentContentForm = ({
  initialValues = {},
  defaultSchemaId = null,
}: UseComponentContentFormOptions = {}) => {
  const { _id } = useParams<{ _id: string }>()
  const isCreating = window.location.pathname.includes('/create')

  const [schema, setSchema] = useState<ComponentSchemaApiPayloadItem | null>(null)

  const [title, setTitle] = useState(initialValues.title || '')
  const [props, setProps] = useState<ComponentContentProps>(initialValues.props || {})

  const initialValuesRef = useRef(initialValues)

  useEffect(() => {
    const load = async () => {
      let schemaId = defaultSchemaId

      if (!isCreating && _id) {
        const content = await fetchComponentContentById(_id)
        if (content) {
          schemaId = content.schemaId
          setTitle(content.title || '')
          setProps(content.props || {})
        }
      }

      if (!schemaId) {
        setSchema(null)
        return
      }

      const schemas = await fetchAllComponentSchemas()
      const found = schemas.find((s: ComponentSchemaApiPayloadItem) => s._id === schemaId)

      setSchema(found ?? null)
    }

    load()
  }, [_id, defaultSchemaId, isCreating])

  useEffect(() => {
    if (JSON.stringify(initialValuesRef.current) !== JSON.stringify(initialValues)) {
      initialValuesRef.current = initialValues
      setTitle(initialValues.title || '')
      setProps(initialValues.props || {})
    }
  }, [initialValues])

  return { schema, title, setTitle, props, setProps }
}

export { useComponentContentForm }
