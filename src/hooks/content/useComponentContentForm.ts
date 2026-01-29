import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAllComponentSchemas } from '~api/componentSchema'
import { fetchComponentContentById } from '~api/componentContent'
import type {
  ComponentContentApiPayloadItem,
  ComponentContentFormState,
  ComponentContentProps
} from '~api/componentContent'
// import type { ComponentSchemaApiPayloadItem } from '~api/componentSchema'

interface UseComponentContentFormOptions {
  initialValues?: Partial<ComponentContentApiPayloadItem>
  defaultSchemaId?: string | null
}

const useComponentContentForm = ({
  initialValues = {},
  defaultSchemaId = null
}: UseComponentContentFormOptions = {}) => {
  const { _id } = useParams<{ _id: string }>()
  const isCreating = window.location.pathname.includes('/create')

  // Form state
  const [componentSchemas, setComponentSchemas] = useState<ComponentContentFormState | null>({ schema: [] })
  const [props, setProps] = useState<ComponentContentProps>(initialValues.props || {})
  const [title, setTitle] = useState(initialValues.title || '')

  const initialValuesRef = useRef(initialValues)

  useEffect(() => {
    const loadSchema = async () => {
      try {
        let schemaId: string | null = defaultSchemaId

        // If editing existing component-content, fetch it
        if (!isCreating && _id) {
          const componentContent = await fetchComponentContentById(_id)
          if (componentContent) {
            schemaId = componentContent.schemaId
            setProps(componentContent.props || {})
            setTitle(componentContent.title || '')
          }
        }

        if (!schemaId) {
          console.warn("No schema ID provided for ComponentContentForm")
          setComponentSchemas({ schema: [] })
          return
        }

        // Fetch all schemas and find the one matching schemaId
        const schemas = await fetchAllComponentSchemas()
        const schema = schemas.find((s: ComponentContentApiPayloadItem) => s._id === schemaId)

        if (!schema) {
          console.warn(`No schema found for schemaId: ${schemaId}`)
          setComponentSchemas({ schema: [] })
          return
        }

        setComponentSchemas(schema)
      } catch (error) {
        console.error("Error loading component schema:", error)
        setComponentSchemas({ schema: [] })
      }
    }

    loadSchema()
  }, [_id, defaultSchemaId, isCreating])

  // Update state if initialValues change
  useEffect(() => {
    if (JSON.stringify(initialValuesRef.current) !== JSON.stringify(initialValues)) {
      initialValuesRef.current = initialValues
      setProps(initialValues.props || {})
      setTitle(initialValues.title || '')
    }
  }, [initialValues])

  return { componentSchemas, setComponentSchemas, title, setTitle, props, setProps }
}

export { useComponentContentForm }
