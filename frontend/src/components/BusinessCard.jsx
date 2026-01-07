import { Star, MapPin, Phone, Globe } from 'lucide-react'

function BusinessCard({ business }) {
  const renderRating = (rating) => {
    if (!rating) return null

    return (
      <div className="flex items-center gap-1">
        <span className="numeric font-medium text-lg">{rating}</span>
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      </div>
    )
  }

  return (
    <div className="card p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {business.name}
        </h3>
        <div className="flex items-center gap-3">
          {renderRating(business.rating)}
          {business.review_count > 0 && (
            <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              ({business.review_count.toLocaleString()} reviews)
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 flex-1 text-sm">
        {/* Address */}
        <div className="flex gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {business.address}
          </p>
        </div>

        {/* Phone */}
        {business.phone && (
          <div className="flex gap-2">
            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }} />
            <a
              href={`tel:${business.phone}`}
              className="numeric"
              style={{ color: 'var(--color-accent)' }}
            >
              {business.phone}
            </a>
          </div>
        )}

        {/* Website */}
        {business.website && (
          <div className="flex gap-2">
            <Globe className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }} />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate"
              style={{ color: 'var(--color-accent)' }}
            >
              Website
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      {(business.phone || business.website) && (
        <div className="flex gap-2 mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="btn btn-secondary flex-1 text-sm"
            >
              Call
            </a>
          )}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary flex-1 text-sm"
            >
              Visit
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default BusinessCard
