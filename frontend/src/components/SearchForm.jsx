import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

const CATEGORIES = [
  { value: 'pool services', label: 'Pool Services' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'beauty salon', label: 'Beauty Salons' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'barbershop', label: 'Barbershops' },
  { value: 'auto repair', label: 'Auto Repair' },
  { value: 'plumber', label: 'Plumbers' },
  { value: 'electrician', label: 'Electricians' },
  { value: 'dentist', label: 'Dentists' },
  { value: 'gym fitness', label: 'Gyms' },
  { value: 'veterinarian', label: 'Veterinarians' },
  { value: 'real estate', label: 'Real Estate' },
  { value: 'cleaning services', label: 'Cleaning Services' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'lawyer attorney', label: 'Lawyers' },
]

const RADIUS_OPTIONS = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
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

  return (
    <div className="card p-12">
      {!hasApiKey && (
        <div className="mb-8 p-6 rounded-lg" style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderLeft: '3px solid var(--color-warning)'
        }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-warning)' }}>
            API Key required. Click the button in the header to configure it.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Miami, FL or 33101"
              className="input"
              required
            />
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Search Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="input"
            >
              {RADIUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
              <option value="custom">Custom category...</option>
            </select>
          </div>
        </div>

        {/* Custom category input */}
        {category === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Custom Category
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g., yoga studios, coffee shops"
              className="input"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !hasApiKey}
          className="btn btn-primary w-full py-3 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Search Businesses</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default SearchForm
