import { useState, useEffect, useRef } from 'react'
import { fetchAllComponentSchemaIds } from '~api/componentSchema'
import type { ComponentSchemaFormPayload } from '~api/componentSchema'

const useComponentSchemaForm = (initialValues: ComponentSchemaFormPayload = {} ) => {
  const [componentName, setComponentName] = useState(initialValues.name || '')
  const [componentId, setComponentId] = useState(initialValues.id || '')
  const [componentDescription, setComponentDescription] = useState(initialValues.description || '')
  const [category, setCategory] = useState(initialValues.category || '')
  const [allowedChildren, setAllowedChildren] = useState(initialValues.allowedChildren || [])
  const [maxInstances, setMaxInstances] = useState(initialValues.maxInstances || null)
  const [componentIdModified, setComponentIdModified] = useState(false)

  const [allowedChildrenOptions, setAllowedChildrenOptions] = useState([])

  // Ensure values update if initialValues change
  const initialValuesRef = useRef(initialValues)

  useEffect(() => {
    if (JSON.stringify(initialValuesRef.current) !== JSON.stringify(initialValues)) {
      initialValuesRef.current = initialValues
      setComponentName(initialValues.name || '')
      setComponentId(initialValues.id || '')
      setComponentDescription(initialValues.description || '')
      setCategory(initialValues.category || '')
      setAllowedChildren(initialValues.allowedChildren || [])
      setMaxInstances(initialValues.maxInstances || null)
    }
  }, [initialValues])

  useEffect(() => {
    const getComponentIds = async () => {
      const ids = await fetchAllComponentSchemaIds('title', 'ASC')
      const filteredIds = ids.filter((id: string) => id !== componentId) // Exclude the current component name
      setAllowedChildrenOptions(filteredIds)
    }
  
    getComponentIds()
  }, [componentId])

  const toggleAllowedChildren = (child: string) => {
    setAllowedChildren((prev: string[]) =>
      prev.includes(child) ? prev.filter((c) => c !== child) : [...prev, child]
    )
  }

  return {
    componentName, setComponentName,
    componentId, setComponentId,
    componentDescription, setComponentDescription,
    category, setCategory,
    allowedChildren, setAllowedChildren,
    maxInstances, setMaxInstances,
    componentIdModified, setComponentIdModified,
    allowedChildrenOptions,
    toggleAllowedChildren
  };
};

export { useComponentSchemaForm }
