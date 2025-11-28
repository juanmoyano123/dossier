function BusinessTable({ businesses }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Dirección
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Teléfono
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Website
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Rating
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Reviews
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {businesses.map((business, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {business.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {business.address}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {business.phone ? (
                  <a
                    href={`tel:${business.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {business.phone}
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {business.website ? (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver sitio
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {business.rating ? (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{business.rating}</span>
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {business.review_count || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BusinessTable
