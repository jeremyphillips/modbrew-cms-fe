import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPages } from '~api'

const PageContentList = () => {
  const [pages, setPages] = useState([])

  useEffect(() => {
    const getPages = async () => {
      const data = await fetchAllPages({ sortBy: 'createdAt', sortOrder: 'DESC'})
      setPages(data)
    }
    getPages()
  }, [])
  
  return (
    <>
      <h1>All Pages</h1>
      <Link to="/pages-content/create">Create New Page</Link>

      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <strong>
              <Link to={`/page-content/${page.id}`}>{page.name}</Link>
            </strong> - {page.description}
          </li>
        ))}
      </ul>
    </>
  )
}

export default PageContentList
