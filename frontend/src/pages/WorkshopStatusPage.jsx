import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, User, Building } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge, { getStatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'

import { useAuthStore } from '../store/authStore'
import { useWorkshops, useAcceptWorkshop } from '../hooks/useWorkshops'
import { formatDate } from '../utils/cn'

/**
 * Workshop Card Component
 */
function WorkshopCard({
  workshop,
  isCoordinator,
  onAccept,
  isAccepting,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleAccept = () => {
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    onAccept(workshop.id)
    setShowConfirmModal(false)
  }

  return (
    <>
      <motion.div
        variants={{
          item: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          },
        }}
      >
        <Card hover variant="default" className="p-5 flex flex-col h-full">
          <div className="space-y-4 flex-1">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                {workshop.workshop_type_name}
              </h3>
              {getStatusBadge(workshop.status)}
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="flex-shrink-0" />
              {formatDate(workshop.date)}
            </div>

            {/* Coordinator or Instructor */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} className="flex-shrink-0" />
              {isCoordinator
                ? `${workshop.instructor_first_name || 'Awaiting'} ${workshop.instructor_last_name || 'assignment'}`
                : `${workshop.coordinator_first_name} ${workshop.coordinator_last_name}`}
            </div>

            {/* Institute - Instructor view only */}
            {!isCoordinator && workshop.institute && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building size={16} className="flex-shrink-0" />
                {workshop.institute}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              to={`/workshops/${workshop.id}`}
              className="flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                fullWidth
              >
                View Details
              </Button>
            </Link>

            {!isCoordinator && workshop.status === 0 && (
              <Button
                variant="accent"
                size="sm"
                onClick={handleAccept}
                loading={isAccepting}
              >
                Accept
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Accept Workshop?"
        size="md"
        footer={
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmModal(false)}
              disabled={isAccepting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isAccepting}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 text-sm">
          Once accepted you cannot reject. You'll need to personally contact
          the coordinator to cancel. Confirm?
        </p>
      </Modal>
    </>
  )
}

/**
 * Workshop Status Page
 */
export default function WorkshopStatusPage() {
  const user = useAuthStore((state) => state.user)
  const { workshops, acceptedWorkshops, pendingWorkshops, isLoading } =
    useWorkshops()
  const { accept: acceptWorkshop, isAccepting } = useAcceptWorkshop()
  const isCoordinator = user?.is_instructor === false

  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [filterStatus, setFilterStatus] = useState('all')

  // Filter and sort workshops
  const { filteredAccepted, filteredPending } = useMemo(() => {
    let accepted = acceptedWorkshops || []
    let pending = pendingWorkshops || []

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      accepted = accepted.filter((w) =>
        w.workshop_type_name?.toLowerCase().includes(term)
      )
      pending = pending.filter((w) =>
        w.workshop_type_name?.toLowerCase().includes(term)
      )
    }

    // Instructor status filter
    if (!isCoordinator && filterStatus !== 'all') {
      if (filterStatus === 'accepted') {
        pending = []
      } else if (filterStatus === 'pending') {
        accepted = []
      }
    }

    // Sort
    const sortFn = (arr) => {
      const sorted = [...arr]
      if (sortOrder === 'newest') {
        sorted.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      } else if (sortOrder === 'oldest') {
        sorted.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      } else if (sortOrder === 'alphabetical') {
        sorted.sort((a, b) =>
          a.workshop_type_name.localeCompare(b.workshop_type_name)
        )
      }
      return sorted
    }

    return {
      filteredAccepted: sortFn(accepted),
      filteredPending: sortFn(pending),
    }
  }, [
    acceptedWorkshops,
    pendingWorkshops,
    searchTerm,
    sortOrder,
    filterStatus,
    isCoordinator,
  ])

  if (isLoading) {
    return (
      <PageWrapper title="Workshops">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Loading...
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton.WorkshopCard key={i} />
            ))}
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="My Workshops">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Workshops
            </h1>
            <Badge size="md" variant="info">
              {(filteredAccepted?.length || 0) +
                (filteredPending?.length || 0)}
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>

          {/* Instructor Filter */}
          {!isCoordinator && (
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('accepted')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'accepted'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted
              </button>
            </div>
          )}
        </div>

        {/* Accepted Workshops Section */}
        {filteredAccepted.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-heading font-bold text-gray-900">
                Accepted
              </h2>
              <Badge variant="accepted" size="md">
                {filteredAccepted.length}
              </Badge>
            </div>
            <motion.div
              variants={{
                container: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              initial="container"
              animate="container"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredAccepted.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    isCoordinator={isCoordinator}
                    onAccept={acceptWorkshop}
                    isAccepting={isAccepting}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Pending Workshops Section */}
        {filteredPending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-heading font-bold text-gray-900">
                Pending
              </h2>
              <Badge variant="pending" pulse size="md">
                {filteredPending.length}
              </Badge>
            </div>
            <motion.div
              variants={{
                container: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              initial="container"
              animate="container"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredPending.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    isCoordinator={isCoordinator}
                    onAccept={acceptWorkshop}
                    isAccepting={isAccepting}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {filteredAccepted.length === 0 && filteredPending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter size={48} className="text-primary/30 mb-4" />
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
              No workshops found
            </h3>
            <p className="text-gray-600 max-w-sm">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'You don't have any workshops yet'}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
