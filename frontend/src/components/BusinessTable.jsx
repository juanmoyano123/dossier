import { Star, ExternalLink, Phone, Globe, MapPin } from 'lucide-react'

function BusinessTable({ businesses }) {
  const renderRating = (rating) => {
    if (!rating) return <span className="text-gray-400">-</span>

    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="font-medium">{rating}</span>
      </div>
    )
  }

  return (
    <div className="table-container bg-white rounded-xl overflow-hidden shadow-sm">
      <table>
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th>Nombre</th>
            <th>Direccion</th>
            <th>Telefono</th>
            <th>Website</th>
            <th className="text-center">Rating</th>
            <th className="text-center">Reviews</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business, index) => (
            <tr key={index}>
              <td className="font-medium text-gray-400">{index + 1}</td>
              <td>
                <div className="font-semibold text-gray-900 max-w-[200px]">
                  {business.name}
                </div>
              </td>
              <td>
                <div className="flex items-start gap-2 max-w-[250px]">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{business.address}</span>
                </div>
              </td>
              <td>
                {business.phone ? (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    {business.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td>
                {business.website ? (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">Ver sitio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="text-center">{renderRating(business.rating)}</td>
              <td className="text-center">
                <span className="text-gray-600">
                  {business.review_count?.toLocaleString() || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BusinessTable
