import { Star, MapPin, Phone, Globe, ExternalLink, Clock } from 'lucide-react'

function BusinessCard({ business }) {
  const renderRating = (rating) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-gray-200'
            }`}
          />
        ))}
        <span className="ml-1 font-semibold text-gray-900">{rating}</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 card-hover border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">
          {business.name}
        </h3>
        {business.is_open !== null && (
          <span
            className={`badge flex-shrink-0 ${
              business.is_open ? 'badge-success' : 'badge-warning'
            }`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {business.is_open ? 'Abierto' : 'Cerrado'}
          </span>
        )}
      </div>

      {/* Rating */}
      {business.rating && (
        <div className="mb-4 flex items-center gap-2">
          {renderRating(business.rating)}
          {business.review_count > 0 && (
            <span className="text-sm text-gray-500">
              ({business.review_count.toLocaleString()} resenas)
            </span>
          )}
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 flex-1">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
            <MapPin className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {business.address}
          </p>
        </div>

        {/* Phone */}
        {business.phone && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
              <Phone className="w-4 h-4 text-gray-500" />
            </div>
            <a
              href={`tel:${business.phone}`}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
            >
              {business.phone}
            </a>
          </div>
        )}

        {/* Website */}
        {business.website && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1 truncate max-w-[200px]"
            >
              Visitar sitio web
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex-1 py-2 px-3 text-sm font-medium text-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
          >
            Llamar
          </a>
        )}
        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 text-sm font-medium text-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Web
          </a>
        )}
        {!business.phone && !business.website && (
          <span className="text-sm text-gray-400 italic">
            Sin informacion de contacto
          </span>
        )}
      </div>
    </div>
  )
}

export default BusinessCard
