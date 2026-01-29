import { useParams } from 'react-router-dom'

const PageContentEdit = () => {
  const { id } = useParams()

  return (
    <div>
      <h1>Page Details for ID: {id}</h1>
      {/* Fetch and display details for the page */}
      {/* Example: */}
      <div>Details about page {id}</div>
    </div>
  )
}

export default PageContentEdit
