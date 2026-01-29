import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PageContentCreate() {
  const [pageTitle, setPageTitle] = useState('')
  const navigate = useNavigate()

  const handleCreate = async (e) => {
    e.preventDefault()
    // Call API to create a page
    // For example:
    // await createPage({ title: pageTitle })
    navigate('/page-content') // Redirect to page overview
  }

  return (
    <>
      <h1>Create a New Page</h1>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          placeholder="Page Title"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button type="submit">Create</button>
      </form>
    </>
  )
}

export default PageContentCreate
