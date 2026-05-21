export interface Product {
  id: string
  name: string
  category: string
  brand: string
  application: string
  description: string
  specs: Record<string, string>
  pdf: string
  images: string[]
}

export interface Category {
  id: string
  name: string
}

export interface Brand {
  id: string
  name: string
  logo: string
}

export interface Inquiry {
  id: string
  name: string
  company: string
  email: string
  phone: string
  message: string
  productId?: string
  industry: string
  budget: string
  status?: 'pending' | 'in-contact' | 'archived'
}

export interface CaseStudy {
  id: string
  title: string
  industry: string
  summary: string
  problem: string
  solution: string
  result: string
  images: string[]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  tags: string[]
  date: string
}

export interface Service {
  id: string
  title: string
  description: string
  highlight: string
}

export interface Solution {
  id: string
  title: string
  description: string
  highlight: string
}

export interface Industry {
  id: string
  title: string
  description: string
}
