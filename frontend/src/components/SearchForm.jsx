import { useState } from 'react'
import { Search, MapPin, Ruler, Building, Loader2, AlertCircle } from 'lucide-react'

const CATEGORIES = [
  { value: 'pool services', label: 'Servicios de Piscina', icon: '🏊' },
  { value: 'landscaping', label: 'Jardineria / Landscaping', icon: '🌿' },
  { value: 'beauty salon', label: 'Salones de Belleza', icon: '💇' },
  { value: 'restaurant', label: 'Restaurantes', icon: '🍽️' },
  { value: 'barbershop', label: 'Barberias', icon: '💈' },
  { value: 'auto repair', label: 'Talleres Mecanicos', icon: '🔧' },
  { value: 'plumber', label: 'Plomeros', icon: '🚿' },
  { value: 'electrician', label: 'Electricistas', icon: '⚡' },
  { value: 'dentist', label: 'Dentistas', icon: '🦷' },
  { value: 'gym fitness', label: 'Gimnasios', icon: '💪' },
  { value: 'veterinarian', label: 'Veterinarios', icon: '🐾' },
  { value: 'real estate', label: 'Bienes Raices', icon: '🏠' },
  { value: 'cleaning services', label: 'Servicios de Limpieza', icon: '🧹' },
  { value: 'accounting', label: 'Contadores', icon: '📊' },
  { value: 'lawyer attorney', label: 'Abogados', icon: '⚖️' },
]

const RADIUS_OPTIONS = [
  { value: 5, label: '5 millas' },
  { value: 10, label: '10 millas' },
  { value: 25, label: '25 millas' },
  { value: 50, label: '50 millas' },
]

function SearchForm({ onSearch, isLoading, hasApiKey }) {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState(10)
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const searchCategory = category === 'custom' ? customCategory : category
    if (!location || !searchCategory) return
    onSearch({ location, radius, category: searchCategory })
  }

  const selectedCategory = CATEGORIES.find(c => c.value === category)

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="gradient-bg p-3 rounded-xl shadow-lg shadow-purple-500/20">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Buscar Negocios</h2>
          <p className="text-sm text-gray-500">Encuentra proveedores en tu area</p>
        </div>
      </div>

      {!hasApiKey && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">API Key requerida</p>
            <p className="text-sm text-amber-600">
              Configura tu Google Places API Key para comenzar a buscar negocios.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main search inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Location Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin className="w-4 h-4 text-purple-600" />
              Ubicacion
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Miami, FL o 33101"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl input-focus text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {/* Radius Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Ruler className="w-4 h-4 text-purple-600" />
              Radio de busqueda
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl input-focus text-gray-900 appearance-none cursor-pointer"
            >
              {RADIUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Building className="w-4 h-4 text-purple-600" />
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl input-focus text-gray-900 appearance-none cursor-pointer"
              required
            >
              <option value="">Selecciona una categoria</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
              <option value="custom">✏️ Categoria personalizada</option>
            </select>
          </div>
        </div>

        {/* Custom category input */}
        {category === 'custom' && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              Categoria personalizada
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Ej: yoga studios, coffee shops, etc."
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl input-focus text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        )}

        {/* Selected category preview */}
        {selectedCategory && (
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl w-fit">
            <span className="text-lg">{selectedCategory.icon}</span>
            <span className="text-sm font-medium text-purple-700">
              {selectedCategory.label}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !hasApiKey}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando negocios...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Buscar Negocios</span>
            </>
          )}
        </button>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400">
          Los resultados provienen de Google Places API. Puedes buscar cualquier tipo de negocio.
        </p>
      </form>
    </div>
  )
}

export default SearchForm
