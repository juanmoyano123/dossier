import { Star, Phone, Globe } from 'lucide-react'

function BusinessTable({ businesses }) {
  const renderRating = (rating) => {
    if (!rating) return <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>

    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="numeric font-medium">{rating}</span>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-professional">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Business Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th className="text-right">Rating</th>
              <th className="text-right">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => (
              <tr key={index}>
                <td className="numeric" style={{ color: 'var(--color-text-tertiary)' }}>
                  {index + 1}
                </td>
                <td>
                  <div className="font-medium max-w-[250px]">
                    {business.name}
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="text-sm max-w-[300px]">
                    {business.address}
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    {business.phone && (
                      <a
                        href={`tel:${business.phone}`}
                        className="flex items-center gap-2 text-sm numeric"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        <Phone className="w-3 h-3" />
                        {business.phone}
                      </a>
                    )}
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    {!business.phone && !business.website && (
                      <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-right">
                  {renderRating(business.rating)}
                </td>
                <td className="text-right numeric" style={{ color: 'var(--color-text-secondary)' }}>
                  {business.review_count?.toLocaleString() || '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BusinessTable
