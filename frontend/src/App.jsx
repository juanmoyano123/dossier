import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Building2,
  Copy,
  Check,
  Download,
  LayoutGrid,
  List,
  Settings,
  X,
  Key,
  ExternalLink,
  Star,
  Phone,
  Globe,
  Loader2,
  Sparkles,
  Github
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
    // Check if API key exists on mount
    if (!apiKey) {
      setShowApiModal(true)
    }
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const saveApiKey = (key) => {
    localStorage.setItem('google_places_api_key', key)
    setApiKey(key)
    setShowApiModal(false)
    showToast('API Key guardada correctamente')
  }

  const handleSearch = async (searchParams) => {
    if (!apiKey) {
      setShowApiModal(true)
      return
    }

    setIsLoading(true)
    setError(null)
    setBusinesses([])
    setSearchInfo(searchParams)

    try {
      // First, geocode the location
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchParams.location)}&key=${apiKey}`
      const geocodeResponse = await fetch(geocodeUrl)
      const geocodeData = await geocodeResponse.json()

      if (geocodeData.status !== 'OK' || !geocodeData.results?.length) {
        throw new Error(`No se pudo encontrar la ubicacion: ${searchParams.location}`)
      }

      const { lat, lng } = geocodeData.results[0].geometry.location
      const radiusMeters = searchParams.radius * 1609.34 // Convert miles to meters

      // Search for places using Text Search
      const query = `${searchParams.category} near ${searchParams.location}`
      const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=${radiusMeters}&key=${apiKey}`

      const placesResponse = await fetch(placesUrl)
      const placesData = await placesResponse.json()

      if (placesData.status === 'REQUEST_DENIED') {
        throw new Error('API Key invalida o sin permisos. Verifica tu configuracion en Google Cloud Console.')
      }

      if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
        throw new Error(`Error de Google API: ${placesData.status}`)
      }

      const results = placesData.results || []

      // Get details for each place
      const businessesWithDetails = await Promise.all(
        results.slice(0, 20).map(async (place) => {
          try {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,business_status&key=${apiKey}`
            const detailsResponse = await fetch(detailsUrl)
            const detailsData = await detailsResponse.json()

            if (detailsData.status === 'OK' && detailsData.result) {
              const result = detailsData.result
              return {
                name: result.name || place.name,
                address: result.formatted_address || place.formatted_address,
                phone: result.formatted_phone_number || null,
                website: result.website || null,
                rating: result.rating || place.rating || null,
                review_count: result.user_ratings_total || place.user_ratings_total || 0,
                is_open: result.opening_hours?.open_now ?? null,
                business_status: result.business_status || null
              }
            }

            // Fallback to basic info
            return {
              name: place.name,
              address: place.formatted_address,
              phone: null,
              website: null,
              rating: place.rating || null,
              review_count: place.user_ratings_total || 0,
              is_open: place.opening_hours?.open_now ?? null,
              business_status: place.business_status || null
            }
          } catch {
            return {
              name: place.name,
              address: place.formatted_address,
              phone: null,
              website: null,
              rating: place.rating || null,
              review_count: place.user_ratings_total || 0,
              is_open: null,
              business_status: null
            }
          }
        })
      )

      setBusinesses(businessesWithDetails)

      if (businessesWithDetails.length === 0) {
        showToast('No se encontraron negocios en esta area', 'warning')
      } else {
        showToast(`Se encontraron ${businessesWithDetails.length} negocios`, 'success')
      }
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (businesses.length === 0) return

    // Create TSV format (Tab Separated Values) for easy paste to spreadsheet
    const headers = ['Nombre', 'Direccion', 'Telefono', 'Website', 'Rating', 'Reviews']
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
      showToast('Datos copiados al portapapeles. Listos para pegar en tu spreadsheet!')
    }).catch(() => {
      showToast('Error al copiar', 'error')
    })
  }

  const downloadCSV = () => {
    if (businesses.length === 0) return

    const headers = ['Nombre', 'Direccion', 'Telefono', 'Website', 'Rating', 'Reviews']
    const rows = businesses.map(b => [
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.address || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.website || '').replace(/"/g, '""')}"`,
      b.rating || '',
      b.review_count || 0
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `negocios_${searchInfo?.category || 'busqueda'}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)

    showToast('Archivo CSV descargado')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="gradient-bg p-2 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Dossier</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Ver en GitHub"
              >
                <Github className="w-5 h-5 text-gray-600" />
              </a>
              <button
                onClick={() => setShowApiModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">API Key</span>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Busqueda inteligente de negocios
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="gradient-text">Encuentra proveedores</span>
              <br />
              <span className="text-gray-900">en segundos</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Busca negocios locales, obtiene sus datos de contacto y exportalos
              directamente a tu spreadsheet. Sin complicaciones.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Busqueda por categoria</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Por ubicacion</span>
              </div>
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                <span>Copia y pega</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
              className="glass border border-red-200 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error en la busqueda</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
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
              className="glass rounded-2xl p-12 text-center"
            >
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full gradient-bg animate-pulse-ring absolute inset-0" />
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin relative z-10" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Buscando negocios...</p>
              <p className="text-sm text-gray-400 mt-2">
                Esto puede tomar unos segundos
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
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Resultados
                    <span className="badge badge-info">
                      {businesses.length}
                    </span>
                  </h2>
                  {searchInfo && (
                    <p className="text-gray-500 text-sm mt-1">
                      {searchInfo.category} en {searchInfo.location} ({searchInfo.radius} millas)
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        viewMode === 'cards'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        viewMode === 'table'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      Tabla
                    </button>
                  </div>

                  {/* Export Buttons */}
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-emerald-500/25"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-500/25"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Results Display */}
              {viewMode === 'cards' ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                >
                  {businesses.map((business, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
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
            className="glass rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center animate-float">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Listo para buscar
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Completa el formulario de busqueda para encontrar negocios locales.
              Los resultados se mostraran aqui y podras exportarlos facilmente.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="gradient-bg p-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold gradient-text">Dossier</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-500">
                Herramienta de prospeccion de negocios
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Desarrollado con React + Google Places API
            </p>
          </div>
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
