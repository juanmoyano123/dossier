import { useState } from 'react'
import SearchForm from './components/SearchForm'
import BusinessCard from './components/BusinessCard'
import BusinessTable from './components/BusinessTable'
import './App.css'

const API_URL = 'http://localhost:5001'

function App() {
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'

  const handleSearch = async (searchParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar negocios')
      }

      setBusinesses(data.businesses || [])
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    if (businesses.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businesses }),
      })

      const data = await response.json()

      if (data.sheet_url) {
        alert('Exportado exitosamente! (Funcionalidad en desarrollo)')
      }
    } catch (err) {
      console.error('Error al exportar:', err)
      alert('Error al exportar a Google Sheets')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Herramienta Personal de Prospección
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Dossier
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra y analiza negocios locales al instante. Exporta resultados a Google Sheets con un click.
          </p>
        </header>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {businesses.length > 0 && (
          <div className="glass-effect rounded-2xl shadow-soft p-8 border border-white/20">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  Resultados
                </h2>
                <p className="text-gray-500">
                  {businesses.length} {businesses.length === 1 ? 'negocio encontrado' : 'negocios encontrados'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* View Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📊 Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📋 Tabla
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  📤 Exportar a Sheets
                </button>
              </div>
            </div>

            {/* Results Display */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business, index) => (
                  <BusinessCard key={index} business={business} />
                ))}
              </div>
            ) : (
              <BusinessTable businesses={businesses} />
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && businesses.length === 0 && !error && (
          <div className="glass-effect rounded-2xl shadow-soft p-12 text-center border border-white/20">
            <div className="text-gray-300 text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Listo para buscar
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Completa el formulario de arriba para encontrar negocios locales en tu área
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
