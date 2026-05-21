import { brands, caseStudies, blogPosts, industries, products, services, solutions, categories } from '../data/content'
import type { Brand, CaseStudy, BlogPost, Industry, Product, Service, Solution, Category, Inquiry } from '../types'

const API_BASE = 'http://localhost:3000/api'

// Helper for resilient fetch
async function apiFetch<T>(path: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.warn(`[API Info] Endpoint ${path} not available. Using high-fidelity local content.`, error)
    return fallbackData
  }
}

// PUBLIC PRODUCTS API
export async function fetchProducts(search = '', category = ''): Promise<Product[]> {
  try {
    const query = new URLSearchParams()
    if (search) query.append('search', search)
    if (category) query.append('category', category)
    
    const res = await fetch(`${API_BASE}/products?${query.toString()}`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.warn(`[API Info] Products API offline. Using local filtering.`, error)
    const normalized = search.trim().toLowerCase()
    return products.filter(product => {
      const matchesCategory = category ? product.category === category || product.category.toLowerCase().replace(/\s+/g, '-') === category : true
      const matchesSearch = normalized
        ? [product.name, product.brand, product.application, product.description]
            .join(' ')
            .toLowerCase()
            .includes(normalized)
        : true
      return matchesCategory && matchesSearch
    })
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.warn(`[API Info] Product detail API offline. Using local lookup for ID: ${id}`)
    return products.find(product => product.id === id)
  }
}

// CONTENT API (Resilient)
export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories', categories)
}

export async function fetchSolutions(): Promise<Solution[]> {
  return apiFetch<Solution[]>('/solutions', solutions)
}

export async function fetchServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services', services)
}

export async function fetchIndustries(): Promise<Industry[]> {
  return apiFetch<Industry[]>('/industries', industries)
}

export async function fetchBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>('/brands', brands)
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  return apiFetch<CaseStudy[]>('/case-studies', caseStudies)
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>('/blog-posts', blogPosts)
}

// INQUIRIES & LEADS API
export async function submitInquiry(inquiry: Omit<Inquiry, 'id'>): Promise<Inquiry> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  })
  if (!res.ok) throw new Error('Submission failed')
  return await res.json()
}

// ADMIN SECTION OPERATIONS
export async function fetchAllInquiries(): Promise<Inquiry[]> {
  const res = await fetch(`${API_BASE}/inquiries`)
  if (!res.ok) throw new Error('Failed to fetch inquiries')
  return await res.json()
}

export async function updateInquiryStatus(id: string, status: 'pending' | 'in-contact' | 'archived'): Promise<Inquiry> {
  const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update inquiry status')
  return await res.json()
}

// ADMIN PRODUCT CRUD
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return await res.json()
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return await res.json()
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete product')
}

// ADMIN CATEGORY CRUD
export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })
  if (!res.ok) throw new Error('Failed to create category')
  return await res.json()
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Failed to update category')
  return await res.json()
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete category')
}

// ADMIN BRAND CRUD
export async function createBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
  const res = await fetch(`${API_BASE}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand),
  })
  if (!res.ok) throw new Error('Failed to create brand')
  return await res.json()
}

export async function updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
  const res = await fetch(`${API_BASE}/brands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand),
  })
  if (!res.ok) throw new Error('Failed to update brand')
  return await res.json()
}

export async function deleteBrand(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/brands/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete brand')
}

// AI SERVICE
export async function generateProductAI(name: string, category: string): Promise<Partial<Product>> {
  const res = await fetch(`${API_BASE}/ai/generate-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category }),
  })
  if (!res.ok) throw new Error('AI Generation failed')
  return await res.json()
}
