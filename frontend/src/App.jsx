import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Building2,
  Download,
  LayoutGrid,
  List,
  Key,
  Loader2
} from 'lucide-react'
import SearchForm from './components/SearchForm'
import BusinessCard from './components/BusinessCard'
import BusinessTable from './components/BusinessTable'
import ApiKeyModal from './components/ApiKeyModal'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('cards')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('google_places_api_key') || '')
  const [showApiModal, setShowApiModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [searchInfo, setSearchInfo] = useState(null)

  useEffect(() => {
    if (!apiKey) {
      setShowApiModal(true)
    }
  }, [apiKey])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const saveApiKey = (key) => {
    localStorage.setItem('google_places_api_key', key)
    setApiKey(key)
    setShowApiModal(false)
    showToast('API Key saved successfully')
  }

  const handleSearch = async (searchParams) => {
    setIsLoading(true)
    setError(null)
    setBusinesses([])
    setSearchInfo(searchParams)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: searchParams.location,
          radius: searchParams.radius,
          category: searchParams.category
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search error')
      }

      const businessesWithDetails = data.businesses.map(business => ({
        ...business,
        is_open: null,
        business_status: null
      }))

      setBusinesses(businessesWithDetails)

      if (businessesWithDetails.length === 0) {
        showToast('No businesses found in this area', 'warning')
      } else {
        showToast(`Found ${businessesWithDetails.length} businesses`)
      }
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const exportToSpreadsheet = () => {
    if (businesses.length === 0) return

    // Create TSV format optimized for Google Sheets/Excel
    const headers = ['Business Name', 'Address', 'Phone', 'Website', 'Rating', 'Reviews']
    const rows = businesses.map(b => [
      b.name,
      b.address,
      b.phone || '',
      b.website || '',
      b.rating || '',
      b.review_count || 0
    ])

    const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n')

    navigator.clipboard.writeText(tsv).then(() => {
      showToast('Data copied! Paste into Google Sheets or Excel')
    }).catch(() => {
      showToast('Error copying data', 'error')
    })
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="border-b bg-white" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
              <span className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                Dossier
              </span>
            </div>
            <button
              onClick={() => setShowApiModal(true)}
              className="btn btn-secondary"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-12 py-20">
        {/* Title Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{ color: 'var(--color-text-primary)', lineHeight: '1.2' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Business Intelligence
          </motion.h1>
          <motion.p
            className="text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Find and export local business data in seconds
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchForm onSearch={handleSearch} isLoading={isLoading} hasApiKey={!!apiKey} />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card p-6 mt-12"
              style={{ borderColor: 'var(--color-error)' }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="empty-state"
            >
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Searching businesses...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {!isLoading && businesses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-24"
            >
              {/* Results Toolbar */}
              <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="numeric text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {businesses.length}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    results
                  </span>
                  {searchInfo && (
                    <span className="text-sm ml-2" style={{ color: 'var(--color-text-tertiary)' }}>
                      • {searchInfo.category} in {searchInfo.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={exportToSpreadsheet}
                    className="btn btn-primary"
                  >
                    <Download className="w-4 h-4" />
                    Export to Spreadsheet
                  </button>

                  {/* View Toggle */}
                  <div className="flex p-1 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-2 rounded font-medium text-sm transition-all ${
                        viewMode === 'cards'
                          ? 'bg-white shadow-sm'
                          : ''
                      }`}
                      style={{
                        color: viewMode === 'cards' ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                      }}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-2 rounded font-medium text-sm transition-all ${
                        viewMode === 'table'
                          ? 'bg-white shadow-sm'
                          : ''
                      }`}
                      style={{
                        color: viewMode === 'table' ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                      }}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              {viewMode === 'cards' ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.03 }
                    }
                  }}
                >
                  {businesses.map((business, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <BusinessCard business={business} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <BusinessTable businesses={businesses} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && businesses.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-bg)' }}
            >
              <Search className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Ready to search
            </h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Enter a location and category to find local businesses. Results can be exported directly to spreadsheets.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-24" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-12 py-8 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Powered by Google Places API
          </p>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={saveApiKey}
        currentKey={apiKey}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
