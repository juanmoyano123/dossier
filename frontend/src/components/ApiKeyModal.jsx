import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, Eye, EyeOff, ExternalLink } from 'lucide-react'

function ApiKeyModal({ isOpen, onClose, onSave, currentKey }) {
  const [apiKey, setApiKey] = useState(currentKey || '')
  const [showKey, setShowKey] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSave(apiKey.trim())
    }
  }

  const handleClear = () => {
    setApiKey('')
    localStorage.removeItem('google_places_api_key')
    onSave('')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="card w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                  <Key className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  API Key Configuration
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Info box */}
            <div className="mb-8 p-6 rounded-lg" style={{
              background: 'rgba(37, 99, 235, 0.1)',
              borderLeft: '3px solid var(--color-accent)'
            }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-accent)' }}>
                Your API Key is stored locally
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                The key is stored only in your browser and never sent to our servers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Key Input */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Google Places API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="input pr-12 numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Help text */}
              <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p>
                  You need a Google Cloud API Key with these services enabled:
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Places API</li>
                  <li>• Geocoding API</li>
                </ul>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium mt-2"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Get API Key in Google Cloud Console
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                {currentKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn btn-secondary"
                    style={{ color: 'var(--color-error)' }}
                  >
                    Remove Key
                  </button>
                )}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!apiKey.trim()}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ApiKeyModal
