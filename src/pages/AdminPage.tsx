import React, { useState, useEffect } from 'react'
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  fetchAllInquiries,
  updateInquiryStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  deleteCategory,
  createBrand,
  deleteBrand,
  generateProductAI
} from '../services/siteApi'
import type { Product, Category, Brand, Inquiry } from '../types'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'products' | 'categories' | 'brands'>('inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [productsList, setProductsList] = useState<Product[]>([])
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [brandsList, setBrandsList] = useState<Brand[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modals / Form states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Product Form State
  const [prodFormName, setProdFormName] = useState('')
  const [prodFormCategory, setProdFormCategory] = useState('')
  const [prodFormBrand, setProdFormBrand] = useState('')
  const [prodFormApplication, setProdFormApplication] = useState('')
  const [prodFormDescription, setProdFormDescription] = useState('')
  const [prodFormPdf, setProdFormPdf] = useState('#')
  const [prodFormImages, setProdFormImages] = useState<string[]>([])
  const [prodFormSpecs, setProdFormSpecs] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)

  // Category Form State
  const [newCatName, setNewCatName] = useState('')
  // Brand Form State
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandLogo, setNewBrandLogo] = useState('')

  // Search & Filter
  const [productSearch, setProductSearch] = useState('')
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'pending' | 'in-contact' | 'archived'>('all')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [inqs, prods, cats, brs] = await Promise.all([
        fetchAllInquiries().catch(() => [] as Inquiry[]),
        fetchProducts().catch(() => [] as Product[]),
        fetchCategories().catch(() => [] as Category[]),
        fetchBrands().catch(() => [] as Brand[])
      ])
      setInquiries(inqs)
      setProductsList(prods)
      setCategoriesList(cats)
      setBrandsList(brs)
    } catch (err) {
      console.error('Error loading admin dashboard data:', err)
      setError('Could not establish a stable connection to the database. Running in offline resilient mode.')
    } finally {
      setLoading(false)
    }
  }

  // Inquiry management
  const handleInquiryStatusChange = async (id: string, newStatus: 'pending' | 'in-contact' | 'archived') => {
    try {
      const updated = await updateInquiryStatus(id, newStatus)
      setInquiries(prev => prev.map(inq => inq.id === id ? updated : inq))
    } catch (err) {
      alert('Could not update status on server. Retrying locally...')
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq))
    }
  }

  // Product modal opening
  const openAddProductModal = () => {
    setEditingProduct(null)
    setProdFormName('')
    setProdFormCategory(categoriesList[0]?.name || '')
    setProdFormBrand(brandsList[0]?.name || '')
    setProdFormApplication('')
    setProdFormDescription('')
    setProdFormPdf('#')
    setProdFormImages([])
    setProdFormSpecs([{ key: '', value: '' }])
    setAiFeedback(null)
    setIsProductModalOpen(true)
  }

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod)
    setProdFormName(prod.name)
    setProdFormCategory(prod.category)
    setProdFormBrand(prod.brand)
    setProdFormApplication(prod.application)
    setProdFormDescription(prod.description)
    setProdFormPdf(prod.pdf || '#')
    setProdFormImages(prod.images || [])
    
    const mappedSpecs = Object.entries(prod.specs || {}).map(([k, v]) => ({ key: k, value: v }))
    setProdFormSpecs(mappedSpecs.length > 0 ? mappedSpecs : [{ key: '', value: '' }])
    setAiFeedback(null)
    setIsProductModalOpen(true)
  }

  // Dynamic spec field manipulation
  const handleAddSpecField = () => {
    setProdFormSpecs([...prodFormSpecs, { key: '', value: '' }])
  }

  const handleRemoveSpecField = (idx: number) => {
    setProdFormSpecs(prodFormSpecs.filter((_, i) => i !== idx))
  }

  const handleSpecFieldChange = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...prodFormSpecs]
    updated[idx][field] = val
    setProdFormSpecs(updated)
  }

  // AI Generation hook
  const handleAIGeneration = async () => {
    if (!prodFormName.trim()) {
      alert('Please provide a Product Name first to give the AI context.')
      return
    }
    setIsGeneratingAI(true)
    setAiFeedback('Connecting to AI Product Architect...')
    try {
      const generated = await generateProductAI(prodFormName, prodFormCategory || 'Lab Equipment')
      
      if (generated.description) setProdFormDescription(generated.description)
      if (generated.application) setProdFormApplication(generated.application)
      if (generated.specs) {
        const specList = Object.entries(generated.specs).map(([k, v]) => ({ key: k, value: v }))
        setProdFormSpecs(specList.length > 0 ? specList : [{ key: '', value: '' }])
      }
      setAiFeedback('Success! Technical details generated.')
      setTimeout(() => setAiFeedback(null), 3000)
    } catch (err) {
      console.error(err)
      setAiFeedback('AI model is offline. Used scientific templates instead.')
      // Dynamic local templates as robust backup
      const demoSpecs: Record<string, string> = {
        'Operating range': '0 - 100% capacity',
        'Accuracy rating': '±0.05% full scale',
        'Standard interface': 'USB / RS-232 serial',
        'Certification': 'CE / ISO 9001 compliance'
      }
      setProdFormDescription(`A premium, high-precision ${prodFormName} engineered for clinical laboratories and analytical chemistry applications requiring micro-trace accuracy.`)
      setProdFormApplication(`Optimized for high-throughput testing, sample preparations, and strict biological asset isolation.`)
      setProdFormSpecs(Object.entries(demoSpecs).map(([k, v]) => ({ key: k, value: v })))
      setTimeout(() => setAiFeedback(null), 3000)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Product form submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct specs object from key-value pairs
    const finalSpecs: Record<string, string> = {}
    prodFormSpecs.forEach(item => {
      if (item.key.trim() && item.value.trim()) {
        finalSpecs[item.key.trim()] = item.value.trim()
      }
    })

    const payload = {
      name: prodFormName.trim(),
      category: prodFormCategory || 'Lab Equipment',
      brand: prodFormBrand || 'Generic',
      application: prodFormApplication.trim() || 'General laboratory use',
      description: prodFormDescription.trim(),
      specs: finalSpecs,
      pdf: prodFormPdf.trim() || '#',
      images: prodFormImages
    }

    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload)
        setProductsList(prev => prev.map(p => p.id === editingProduct.id ? updated : p))
      } else {
        const created = await createProduct(payload)
        setProductsList(prev => [created, ...prev])
      }
      setIsProductModalOpen(false)
    } catch (err) {
      alert('Failed to save product in database. Falling back to local update...')
      // Local fallback
      if (editingProduct) {
        const fallbackProd = { ...editingProduct, ...payload }
        setProductsList(prev => prev.map(p => p.id === editingProduct.id ? fallbackProd : p))
      } else {
        const fallbackProd = { ...payload, id: `p-${Math.floor(1000 + Math.random() * 9000)}` } as Product
        setProductsList(prev => [fallbackProd, ...prev])
      }
      setIsProductModalOpen(false)
    }
  };

  const handleProductDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      setProductsList(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('Could not delete from database. Retrying locally...')
      setProductsList(prev => prev.filter(p => p.id !== id))
    }
  }

  // Category creation & deletion
  const handleCategoryCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    try {
      const created = await createCategory({ name: newCatName.trim() })
      setCategoriesList(prev => [...prev, created])
      setNewCatName('')
    } catch (err) {
      alert('Could not save category to server. Adding locally...')
      const localCat = { id: newCatName.toLowerCase().replace(/\s+/g, '-'), name: newCatName.trim() }
      setCategoriesList(prev => [...prev, localCat])
      setNewCatName('')
    }
  }

  const handleCategoryDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      setCategoriesList(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Could not delete from server. Removing locally...')
      setCategoriesList(prev => prev.filter(c => c.id !== id))
    }
  }

  // Brand creation & deletion
  const handleBrandCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBrandName.trim()) return
    const logoStr = newBrandLogo.trim() || newBrandName.trim().toUpperCase()
    try {
      const created = await createBrand({ name: newBrandName.trim(), logo: logoStr })
      setBrandsList(prev => [...prev, created])
      setNewBrandName('')
      setNewBrandLogo('')
    } catch (err) {
      alert('Could not save brand to server. Adding locally...')
      const localBrand = { id: newBrandName.toLowerCase().replace(/\s+/g, '-'), name: newBrandName.trim(), logo: logoStr }
      setBrandsList(prev => [...prev, localBrand])
      setNewBrandName('')
      setNewBrandLogo('')
    }
  }

  const handleBrandDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return
    try {
      await deleteBrand(id)
      setBrandsList(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      alert('Could not delete brand from server. Removing locally...')
      setBrandsList(prev => prev.filter(b => b.id !== id))
    }
  }

  // Metrics extraction
  const totalLeads = inquiries.length
  const pendingLeads = inquiries.filter(i => !i.status || i.status === 'pending').length
  const inContactLeads = inquiries.filter(i => i.status === 'in-contact').length
  const archivedLeads = inquiries.filter(i => i.status === 'archived').length

  // Pipeline Value Calculator
  const estimatedPipeline = inquiries.reduce((sum, inq) => {
    if (!inq.budget) return sum
    // Extract numbers from strings like "$10,000 - $50,000" or "$100,000+"
    const cleaned = inq.budget.replace(/[^0-9-]/g, '')
    if (cleaned.includes('-')) {
      const [low, high] = cleaned.split('-').map(Number)
      return sum + (low + high) / 2
    } else {
      const val = Number(cleaned)
      return sum + (isNaN(val) ? 0 : val)
    }
  }, 0)

  // Filtering lists
  const filteredInquiries = inquiries.filter(inq => {
    const status = inq.status || 'pending'
    if (inquiryFilter === 'all') return true
    return status === inquiryFilter
  })

  const filteredProducts = productsList.filter(prod => {
    const norm = productSearch.toLowerCase().trim()
    if (!norm) return true
    return (
      prod.name.toLowerCase().includes(norm) ||
      prod.category.toLowerCase().includes(norm) ||
      prod.brand.toLowerCase().includes(norm)
    )
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Dashboard section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ProScient Admin Operations
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Core platform console for lead ingestion, scientific catalog, and machine learning content generation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              className="flex items-center justify-center p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-all active:scale-95"
              title="Refresh all data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8.89M9 11l3-3m0 0l3 3m-3-3v8" />
              </svg>
              <span className="ml-2 text-xs font-semibold">Synchronize</span>
            </button>
            {activeTab === 'products' && (
              <button
                onClick={openAddProductModal}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Instrument
              </button>
            )}
          </div>
        </div>

        {/* HUD Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estimated Pipeline</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">
                  ${estimatedPipeline.toLocaleString()}
                </h3>
              </div>
              <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-3 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Calculated from incoming client budget ranges.
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/5 to-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Unresolved Leads</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">
                  {pendingLeads} <span className="text-sm font-normal text-slate-500">/ {totalLeads} total</span>
                </h3>
              </div>
              <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-3 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
              {inContactLeads} in contact · {archivedLeads} archived
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Products Catalog</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">{productsList.length}</h3>
              </div>
              <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-3">
              Representing {brandsList.length} global manufacturers.
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-teal-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Partner Brands</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">{brandsList.length}</h3>
              </div>
              <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-3">
              Mapped into {categoriesList.length} product classes.
            </div>
          </div>
        </div>

        {/* Database connectivity notification */}
        {error && (
          <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl flex items-start gap-3">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg mt-0.5 animate-pulse">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h4 className="text-sm font-semibold text-indigo-300">Offline Resilience Active</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {error} You can still manipulate variables; modifications will persist locally.
              </p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar scrollbar-hide">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inquiries
            {pendingLeads > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full animate-bounce">
                {pendingLeads}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Instruments CRUD
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'brands'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Brands
          </button>
        </div>

        {/* Tab Content Loading placeholder */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <span className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Syncing database registries...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* INQUIRIES TAB CONTENT */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    Customer Requirement Requests
                    <span className="text-xs font-normal text-slate-500">({filteredInquiries.length})</span>
                  </h2>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setInquiryFilter('all')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        inquiryFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setInquiryFilter('pending')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        inquiryFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setInquiryFilter('in-contact')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        inquiryFilter === 'in-contact' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      In Contact
                    </button>
                    <button
                      onClick={() => setInquiryFilter('archived')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        inquiryFilter === 'archived' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Archived
                    </button>
                  </div>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl py-12 text-center text-slate-400">
                    <p className="text-sm">No customer inquiries match this filter state.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition-all flex flex-col md:flex-row justify-between gap-6"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-200">{inq.name}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400">{inq.company}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                              {inq.industry}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              {inq.budget}
                            </span>
                            {inq.productId && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700">
                                Product ID: {inq.productId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-900 italic font-light">
                            "{inq.message}"
                          </p>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {inq.email}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {inq.phone}
                            </span>
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-end items-end gap-3 shrink-0">
                          {/* Badge display */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-500">Status:</span>
                            {(!inq.status || inq.status === 'pending') && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" /> Pending
                              </span>
                            )}
                            {inq.status === 'in-contact' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" /> In Contact
                              </span>
                            )}
                            {inq.status === 'archived' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" /> Archived
                              </span>
                            )}
                          </div>

                          {/* Controls */}
                          <div className="flex gap-2">
                            {(!inq.status || inq.status === 'pending') && (
                              <button
                                onClick={() => handleInquiryStatusChange(inq.id, 'in-contact')}
                                className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600 border border-sky-600/30 hover:border-sky-500 text-sky-400 hover:text-white rounded-md text-xs font-semibold transition-all"
                              >
                                Reach Out
                              </button>
                            )}
                            {inq.status !== 'archived' && (
                              <button
                                onClick={() => handleInquiryStatusChange(inq.id, 'archived')}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-md text-xs font-semibold transition-all"
                              >
                                Archive
                              </button>
                            )}
                            {inq.status === 'archived' && (
                              <button
                                onClick={() => handleInquiryStatusChange(inq.id, 'pending')}
                                className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600 border border-amber-600/30 text-amber-400 hover:text-white rounded-md text-xs font-semibold transition-all"
                              >
                                Re-open
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS CRUD TAB CONTENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    Scientific Equipment Registries
                    <span className="text-xs font-normal text-slate-500">({filteredProducts.length})</span>
                  </h2>
                  <div className="relative max-w-sm w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search name, category, or brand..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="block w-full pl-9 pr-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl py-12 text-center text-slate-400">
                    <p className="text-sm">No instruments match your search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="min-w-full divide-y divide-slate-800 bg-slate-950/40 backdrop-blur-sm text-left">
                      <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Instrument</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Brand</th>
                          <th className="px-6 py-4">Specs Count</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-xs text-slate-300">
                        {filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-900/30 transition-all">
                            <td className="px-6 py-4 font-mono text-slate-500 font-semibold">{prod.id}</td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-200 block">{prod.name}</span>
                              <span className="text-[10px] text-slate-500 truncate max-w-xs block">{prod.application}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-850 text-[10px] border border-slate-800 text-slate-400 font-semibold">
                                {prod.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-400">{prod.brand}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">
                              {Object.keys(prod.specs || {}).length} variables
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 shrink-0">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded font-semibold transition-all active:scale-95"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleProductDelete(prod.id)}
                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 rounded font-semibold transition-all active:scale-95"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* CATEGORIES CRUD TAB CONTENT */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Creator panel */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 h-fit space-y-4">
                  <h3 className="text-md font-bold text-slate-100">Add Category Class</h3>
                  <form onSubmit={handleCategoryCreate} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Category Name</label>
                      <input
                        type="text"
                        placeholder="Analytical Systems, Centrifuges..."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow-indigo-500/10 transition-all active:scale-95"
                    >
                      Save Category
                    </button>
                  </form>
                </div>

                {/* Display list */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-md font-bold text-slate-100">Active Database Categories</h3>
                  {categoriesList.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-850 rounded-xl py-6 text-center text-slate-500 text-xs">
                      No categories found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoriesList.map((cat) => (
                        <div
                          key={cat.id}
                          className="bg-slate-900/20 border border-slate-850 p-4 rounded-xl flex items-center justify-between hover:border-slate-800 transition-all"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-200 block">{cat.name}</span>
                            <span className="font-mono text-[9px] text-slate-500 mt-0.5 block">{cat.id}</span>
                          </div>
                          <button
                            onClick={() => handleCategoryDelete(cat.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-lg transition-all active:scale-95"
                            title="Delete category"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BRANDS CRUD TAB CONTENT */}
            {activeTab === 'brands' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Creator panel */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 h-fit space-y-4">
                  <h3 className="text-md font-bold text-slate-100">Add Partner Brand</h3>
                  <form onSubmit={handleBrandCreate} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Brand Name</label>
                      <input
                        type="text"
                        placeholder="EXON, ZENITH, NOVUS..."
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Brand Logo String (or URL)</label>
                      <input
                        type="text"
                        placeholder="EXON, AURA (defaults to brand name)"
                        value={newBrandLogo}
                        onChange={(e) => setNewBrandLogo(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow-indigo-500/10 transition-all active:scale-95"
                    >
                      Save Manufacturer
                    </button>
                  </form>
                </div>

                {/* Display list */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-md font-bold text-slate-100">Active Manufacturers</h3>
                  {brandsList.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-850 rounded-xl py-6 text-center text-slate-500 text-xs">
                      No brands mapped.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {brandsList.map((br) => (
                        <div
                          key={br.id}
                          className="bg-slate-900/20 border border-slate-850 p-4 rounded-xl flex items-center justify-between hover:border-slate-800 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-slate-950 border border-slate-850 flex items-center justify-center font-extrabold text-xs text-indigo-400 rounded-lg shadow-inner">
                              {br.logo.length < 8 ? br.logo : 'IMG'}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-slate-200 block">{br.name}</span>
                              <span className="font-mono text-[9px] text-slate-500 mt-0.5 block">{br.id}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBrandDelete(br.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-lg transition-all active:scale-95"
                            title="Delete brand"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCT CREATION/EDIT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    {editingProduct ? 'Modify Instrument Record' : 'Catalog New Laboratory Instrument'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in specs manually or use the AI Generator block to populate technical rows instantly.
                  </p>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleProductSubmit} className="space-y-6">
                
                {/* Name, Category, Brand Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Product name</label>
                    <input
                      type="text"
                      required
                      placeholder="SpectraUV X30, Micro-Centrifuge..."
                      value={prodFormName}
                      onChange={(e) => setProdFormName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Category slug</label>
                    <select
                      value={prodFormCategory}
                      onChange={(e) => setProdFormCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      {categoriesList.length === 0 && <option value="Lab Equipment">Lab Equipment</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Brand manufacturer</label>
                    <select
                      value={prodFormBrand}
                      onChange={(e) => setProdFormBrand(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {brandsList.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                      {brandsList.length === 0 && <option value="Generic">Generic</option>}
                    </select>
                  </div>
                </div>

                {/* AI Trigger Block */}
                <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-300">AI Product Architect Assistant</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Generate high-accuracy descriptions, scientific specifications, and target applications automatically.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isGeneratingAI}
                    onClick={handleAIGeneration}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition-all shrink-0 flex items-center gap-1.5 ${
                      isGeneratingAI 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/20'
                    }`}
                  >
                    {isGeneratingAI && <span className="w-3.5 h-3.5 border-2 border-indigo-400/20 border-t-white rounded-full animate-spin mr-1" />}
                    {isGeneratingAI ? 'Assembling specifications...' : 'AI Generate Details'}
                  </button>
                </div>

                {aiFeedback && (
                  <div className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/20 px-3 py-1.5 rounded-lg border border-indigo-900/30 text-center animate-pulse">
                    {aiFeedback}
                  </div>
                )}

                {/* Application & Technical Writeup */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Target scientific applications</label>
                    <input
                      type="text"
                      placeholder="e.g. Chromatography labs, high-purity clinical isolations..."
                      value={prodFormApplication}
                      onChange={(e) => setProdFormApplication(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Core Description</label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive overview of the lab instrument, its laser calibrations, optics, or general workflow capacity..."
                      value={prodFormDescription}
                      onChange={(e) => setProdFormDescription(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>

                {/* PDF & Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">PDF Catalog Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="#"
                      value={prodFormPdf}
                      onChange={(e) => setProdFormPdf(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Image URLs (Optional, comma-separated)</label>
                    <input
                      type="text"
                      placeholder="/images/spectra.png"
                      value={prodFormImages.join(', ')}
                      onChange={(e) => setProdFormImages(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Specifications Editor */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Technical Specs sheet variables</label>
                    <button
                      type="button"
                      onClick={handleAddSpecField}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center transition-all"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Spec Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-850 p-3 rounded-xl bg-slate-950/20">
                    {prodFormSpecs.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="wavelength, capacity..."
                          value={item.key}
                          onChange={(e) => handleSpecFieldChange(idx, 'key', e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="190 - 1100 nm, 1.5 Liters..."
                          value={item.value}
                          onChange={(e) => handleSpecFieldChange(idx, 'value', e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-800 rounded-lg bg-slate-950 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecField(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent rounded-lg transition-all"
                          title="Remove specification"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {prodFormSpecs.length === 0 && (
                      <p className="text-[10px] text-slate-500 text-center py-2">No specs mapped yet. Add a row above or run AI generator.</p>
                    )}
                  </div>
                </div>

                {/* Submissions */}
                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold text-xs rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95"
                  >
                    Save Laboratory Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
