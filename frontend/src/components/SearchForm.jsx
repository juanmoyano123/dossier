import { useState } from 'react'

const CATEGORIES = [
  { value: 'pool services', label: 'Pool Services' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'beauty salon', label: 'Beauty Salons' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'barbershop', label: 'Barbershops' },
  { value: 'auto repair', label: 'Auto Repair' },
  { value: 'plumber', label: 'Plumbers' },
  { value: 'electrician', label: 'Electricians' },
]

function SearchForm({ onSearch, isLoading }) {
  const [location, setLocation] = useState('Hickory, NC')
  const [radius, setRadius] = useState(10)
  const [category, setCategory] = useState('pool services')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ location, radius, category })
  }

  return (
    <div className="glass-effect rounded-2xl shadow-soft p-8 mb-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Buscar Negocios</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Ciudad / ZIP Code
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Hickory, NC o 28601"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📏 Radio
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value={5}>5 millas</option>
              <option value={10}>10 millas</option>
              <option value={25}>25 millas</option>
              <option value={50}>50 millas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏢 Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Buscando negocios...
            </span>
          ) : (
            '🚀 Buscar Negocios'
          )}
        </button>
      </form>
    </div>
  )
}

export default SearchForm
