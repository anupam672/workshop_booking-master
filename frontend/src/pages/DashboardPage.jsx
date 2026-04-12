import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  BarChart3,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  GraduationCap,
  PlusCircle,
} from 'lucide-react'

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
 * Mini Workshop Card - Reusable component for displaying workshop
 */
function MiniWorkshopCard({ workshop, isCoordinator }) {
  return (
    <Card
      hover
      variant="default"
      className="p-4"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <p className="font-semibold text-gray-900 flex-1">
            {workshop.workshop_type_name || 'Workshop'}
          </p>
          <div className="ml-2">
            {getStatusBadge(workshop.status)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          {formatDate(workshop.date)}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          {isCoordinator
            ? `${workshop.instructor_first_name} ${workshop.instructor_last_name || '(Awaiting assignment)'}`
            : `Coordinator: ${workshop.coordinator_first_name} ${workshop.coordinator_last_name}`}
        </div>

        <Link
          to={`/workshops/${workshop.id}`}
          className="text-sm text-primary hover:text-primary-dark font-medium inline-flex items-center gap-1"
        >
          View Details →
        </Link>
      </div>
    </Card>
  )
}

/**
 * Stat Card Component
 */
function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }

  return (
    <Card variant="elevated" className="p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  )
}

/**
 * Dashboard Page
 * Main dashboard with stats, upcoming workshops, and instructor panel
 */
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { workshops, acceptedWorkshops, pendingWorkshops, isLoading } =
    useWorkshops()
  const { accept: acceptWorkshop, isAccepting } = useAcceptWorkshop()
  const isCoordinator = user?.is_instructor === false
  const [acceptModalOpen, setAcceptModalOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Upcoming workshops for coordinator (accepted workshops with date >= today)
  const upcomingWorkshops = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return acceptedWorkshops
      .filter((w) => new Date(w.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
  }, [acceptedWorkshops])

  // Chart data for instructor (workshops per month)
  const chartData = useMemo(() => {
    const monthCounts = {}
    workshops.forEach((w) => {
      const date = new Date(w.date)
      const monthKey = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
    })

    return Object.entries(monthCounts)
      .sort(
        (a, b) =>
          new Date(a[0]).getTime() - new Date(b[0]).getTime()
      )
      .slice(-6)
      .map(([month, count]) => ({
        month,
        count,
      }))
  }, [workshops])

  // Upcoming workshops count for instructor
  const upcomingCount = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return acceptedWorkshops.filter(
      (w) => new Date(w.date) >= today
    ).length
  }, [acceptedWorkshops])

  const handleAcceptClick = (workshop) => {
    setSelectedWorkshop(workshop)
    setAcceptModalOpen(true)
  }

  const handleConfirmAccept = () => {
    if (selectedWorkshop) {
      acceptWorkshop(selectedWorkshop.id, {
        onSuccess: () => {
          setAcceptModalOpen(false)
          setSelectedWorkshop(null)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title="Dashboard">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Header skeleton */}
          <Skeleton.Card className="h-24" />

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} className="h-24" />
            ))}
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton.WorkshopCard key={i} />
            ))}
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Dashboard">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Greeting Card */}
        <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-heading font-bold">
                {getGreeting()}, {user?.first_name}! 👋
              </p>
              <p className="text-primary-light/90 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Badge
              variant={isCoordinator ? 'info' : 'primary'}
              size="md"
            >
              {isCoordinator ? 'Coordinator' : 'Instructor'}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isCoordinator ? (
            <>
              <StatCard
                icon={BarChart3}
                label="Total Workshops"
                value={workshops.length}
                color="primary"
              />
              <StatCard
                icon={CheckCircle}
                label="Accepted"
                value={acceptedWorkshops.length}
                color="success"
              />
              <StatCard
                icon={Clock}
                label="Pending"
                value={pendingWorkshops.length}
                color="warning"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={CheckCircle}
                label="Conducted"
                value={acceptedWorkshops.length}
                color="success"
              />
              <StatCard
                icon={Clock}
                label="Pending Requests"
                value={pendingWorkshops.length}
                color="warning"
              />
              <StatCard
                icon={Calendar}
                label="Upcoming"
                value={upcomingCount}
                color="primary"
              />
            </>
          )}
        </div>

        {/* Coordinator Content */}
        {isCoordinator && (
          <>
            {/* Upcoming Workshops Section */}
            {upcomingWorkshops.length > 0 && (
              <div>
                <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
                  Upcoming Workshops
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingWorkshops.map((workshop) => (
                    <MiniWorkshopCard
                      key={workshop.id}
                      workshop={workshop}
                      isCoordinator={isCoordinator}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA Card */}
            {workshops.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap
                  size={48}
                  className="text-primary/30 mb-4"
                />
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                  No workshops yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm">
                  Propose your first workshop to get started and start
                  building the learning community.
                </p>
                <Link to="/workshops/propose">
                  <Button variant="accent" size="md">
                    <PlusCircle size={18} />
                    Propose Workshop
                  </Button>
                </Link>
              </div>
            )}

            {workshops.length > 0 && upcomingWorkshops.length === 0 && (
              <Card
                variant="flat"
                className="p-6 border-l-4 border-accent text-center"
              >
                <p className="text-gray-600 mb-4">
                  Ready to propose another workshop?
                </p>
                <Link to="/workshops/propose">
                  <Button variant="accent" size="md">
                    <PlusCircle size={18} />
                    Propose Workshop
                  </Button>
                </Link>
              </Card>
            )}
          </>
        )}

        {/* Instructor Content */}
        {!isCoordinator && (
          <>
            {/* Pending Requests Section */}
            {pendingWorkshops.length > 0 && (
              <div>
                <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
                  Pending Requests
                </h2>
                <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingWorkshops.slice(0, 5).map((workshop) => (
                    <Card
                      key={workshop.id}
                      variant="default"
                      className="p-4 flex flex-col"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-gray-900">
                            {workshop.workshop_type_name}
                          </p>
                          <Badge variant="pending" pulse size="sm">
                            Pending
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          {formatDate(workshop.date)}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} />
                          {workshop.coordinator_first_name}{' '}
                          {workshop.coordinator_last_name}
                        </div>
                      </div>

                      <Button
                        variant="accent"
                        size="sm"
                        fullWidth
                        className="mt-4"
                        onClick={() => handleAcceptClick(workshop)}
                        loading={isAccepting}
                      >
                        Accept
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Chart Section */}
            {chartData.length > 0 && (
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">
                  Workshops per Month (Last 6 Months)
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0F4C81" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {workshops.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap
                  size={48}
                  className="text-primary/30 mb-4"
                />
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                  No workshops yet
                </h3>
                <p className="text-gray-600">
                  Wait for workshop proposals from coordinators.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Accept Workshop Confirmation Modal */}
      <Modal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="Accept Workshop?"
        size="md"
        footer={
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAcceptModalOpen(false)}
              disabled={isAccepting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isAccepting}
              onClick={handleConfirmAccept}
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
    </PageWrapper>
  )
}
