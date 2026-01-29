import { apiFetch } from '~api'

export interface PageContent {
  _id: string
  title: string
  content: any
  createdAt?: string
  updatedAt?: string
}

export const fetchAllPages = async (): Promise<PageContent[]> =>
  apiFetch('/page-content')

export const fetchPageById = async (id: string): Promise<PageContent> =>
  apiFetch(`/page-content/${id}`)

export const createPage = async (data: Partial<PageContent>): Promise<PageContent> =>
  apiFetch('/page-content', { method: 'POST', body: JSON.stringify(data) })

export const updatePage = async (id: string, data: Partial<PageContent>): Promise<PageContent> =>
  apiFetch(`/page-content/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deletePage = async (id: string): Promise<void> =>
  apiFetch(`/page-content/${id}`, { method: 'DELETE' })

