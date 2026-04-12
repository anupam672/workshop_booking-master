import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Plus, BookOpen, Clock } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

import { useAuthStore } from '../store/authStore'
import { useWorkshopTypes } from '../hooks/useWorkshops'

/**
 * Workshop Type List Page
 */
export default function WorkshopTypeListPage() {
  const user = useAuthStore((state) => state.user)
  const isInstructor = user?.is_instructor === true
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [searchTerm, setSearchTerm] = useState('')
  const { data: response, isLoading } = useWorkshopTypes(currentPage)

  const types = response?.results || []
  const count = response?.count || 0
  const pageSize = response?.results?.length || 10
  const totalPages = Math.ceil(count / pageSize)

  // Filter types by search term
  const filteredTypes = useMemo(
    () =>
      types.filter(
        (type) =>
          type.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (type.description || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [types, searchTerm]
  )

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() })
    window.scrollTo(0, 0)
  }

  if (isLoading) {
    return (
      <PageWrapper title="Workshop Types">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Loading...
            </h1>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton.Card key={i} className="h-56" />
            ))}
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Workshop Types">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Workshop Types
          </h1>
          {isInstructor && (
            <Link to="/workshop-types/add">
              <Button variant="accent" size="md">
                <Plus size={18} />
                Add Workshop Type
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search workshop types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>

        {/* Workshop Types Grid */}
        {filteredTypes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTypes.map((type) => (
                <Card
                  key={type.id}
                  hover
                  variant="default"
                  className="p-5 flex flex-col"
                >
                  {/* Header with icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen
                        size={24}
                        className="text-primary"
                      />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 flex-1">
                      {type.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                    {type.description ||
                      'No description available'}
                  </p>

                  {/* Duration badge */}
                  <Badge size="sm" variant="info" className="mb-4 w-fit">
                    <Clock size={14} />
                    {type.duration} day(s)
                  </Badge>

                  {/* View Details button */}
                  <Link
                    to={`/workshop-types/${type.id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handlePageChange(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>

                <span className="text-sm text-gray-600 ml-4">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen size={48} className="text-primary/30 mb-4" />
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
              {searchTerm
                ? 'No workshop types found'
                : 'No workshop types available'}
            </h3>
            <p className="text-gray-600 max-w-sm">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Contact an instructor to add workshop types.'}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
