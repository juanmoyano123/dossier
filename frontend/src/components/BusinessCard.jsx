function BusinessCard({ business }) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-hover transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
          {business.name}
        </h3>
        {business.rating && (
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="font-bold text-sm text-gray-900">{business.rating}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-gray-400 mt-0.5">📍</span>
          <p className="text-gray-600 flex-1">{business.address}</p>
        </div>

        {business.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <a
              href={`tel:${business.phone}`}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              {business.phone}
            </a>
          </div>
        )}

        {business.website ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🌐</span>
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline truncate"
            >
              Ver sitio web
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🌐</span>
            <span className="text-gray-400 text-xs italic">Sin sitio web</span>
          </div>
        )}

        {business.review_count > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-gray-400">💬</span>
            <span className="text-gray-600 text-xs">
              {business.review_count} {business.review_count === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessCard
