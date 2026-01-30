import { Aside, Header } from '~modules/layout'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import * as SchemaPages from '~pages/schema'
import * as ContentPages from '~pages/content'

const App = () => {
  return (
    <Router>
      <div className="App h-full bg-gray-100">
        <Header />
        <div className="container">
          <Aside />
          <div className="content pt-3">
            <Routes>
              {/* Component Schema Routes */}
              <Route path="/component-schemas" element={<SchemaPages.ComponentSchemaList />} />
              <Route path="/component-schemas/:_id" element={<SchemaPages.ComponentSchemaEdit />} />
              <Route path="/component-schemas/create" element={<SchemaPages.ComponentSchemaCreate />} />

              {/* Page Content Routes */}
              <Route path="/page-content" element={<ContentPages.PageContentList />} />
              <Route path="/page-content/:_id" element={<ContentPages.PageContentEdit />} />
              <Route path="/page-content/create" element={<ContentPages.PageContentCreate />} />

              {/* Component Content Routes */}
              <Route path="/component-content/:_id/list" element={<ContentPages.ComponentContentList />} />
              <Route path="/component-content/types" element={<ContentPages.ComponentContentTypesList />} />
              <Route path="/component-content/:_id/edit" element={<ContentPages.ComponentContentEdit />} />
              <Route path="/component-content/create/:schemaId" element={<ContentPages.ComponentContentCreate />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
