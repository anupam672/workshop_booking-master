import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { useCoordinatorProfile } from '../hooks/useProfile'
import { getInitials, generateAvatarColor, formatDate } from '../utils/cn'

/**
 * Helper to get status badge style
 */
function getStatusBadge(status) {
  const statusMap = {
    0: { label: 'Pending', variant: 'pending' },
    1: { label: 'Accepted', variant: 'accepted' },
    2: { label: 'Rejected', variant: 'deleted' },
  }
  return statusMap[status] || { label: 'Unknown', variant: 'default' }
}

/**
 * Profile Loading Skeleton
 */
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton.Card className="h-64" />
      <Skeleton.Card className="h-96" />
    </div>
  )
}

/**
 * Coordinator Profile Card
 */
function CoordinatorProfileCard({ user, profile }) {
  if (!user || !profile) return null

  const fullName = `${user.first_name} ${user.last_name}`
  const avatar_bg = generateAvatarColor(user.first_name)
  const isInstructor = user.is_instructor === true

  return (
    <Card className="space-y-4">
      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl"
        style={{ backgroundColor: avatar_bg }}
      >
        {getInitials(fullName)}
      </div>

      {/* Name and Title */}
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-gray-900">{fullName}</h2>
        <Badge variant="info" size="sm" className="mt-3">
          {isInstructor ? 'Instructor' : 'Coordinator'}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex items-start gap-3">
          <Mail size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
            <p className="text-sm text-gray-900 break-all">{user.email}</p>
          </div>
        </div>

        {profile.phone_number && (
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
              <p className="text-sm text-gray-900">{profile.phone_number}</p>
            </div>
          </div>
        )}

        {profile.institute && (
          <div className="flex items-start gap-3">
            <Building size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Institute</p>
              <p className="text-sm text-gray-900">{profile.institute}</p>
              {profile.department && (
                <p className="text-xs text-gray-600">{profile.department}</p>
              )}
            </div>
          </div>
        )}

        {profile.location && (
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
              <p className="text-sm text-gray-900">
                {profile.location}
                {profile.state && `, ${profile.state}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * View Coordinator Profile Page
 */
export default function ViewCoordinatorProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: authUser } = useAuthStore()

  const { user, profile, workshops, isLoading } = useCoordinatorProfile(
    userId ? parseInt(userId, 10) : null
  )

  // Authorization check - only instructors can view coordinator profiles
  const isInstructor = authUser?.is_instructor === true
  if (!isInstructor) {
    return (
      <PageWrapper title="Coordinator Profile">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-danger mb-2">Access Denied</h2>
            <p className="text-gray-600">
              Only instructors can view coordinator profiles.
            </p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (isLoading) {
    return (
      <PageWrapper title="Coordinator Profile">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <ProfileSkeleton />
        </div>
      </PageWrapper>
    )
  }

  if (!user || !profile) {
    return (
      <PageWrapper title="Coordinator Profile">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-600">Profile not found</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const workshopCount = workshops?.length || 0

  return (
    <PageWrapper title={`${user.first_name} ${user.last_name}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        {/* Profile Card */}
        <CoordinatorProfileCard user={user} profile={profile} />

        {/* Workshops Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Workshop History
            </h2>
            <Badge variant="info">
              {workshopCount} workshop{workshopCount !== 1 ? 's' : ''}
            </Badge>
          </div>

          {workshopCount === 0 ? (
            <Card className="p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">
                No workshops proposed by this coordinator
              </p>
            </Card>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Workshop Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshops.map((ws, idx) => {
                      const status = getStatusBadge(ws.status)
                      return (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {ws.workshop_type?.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(ws.date)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={status.variant} size="sm">
                              {status.label}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {workshops.map((ws, idx) => {
                  const status = getStatusBadge(ws.status)
                  return (
                    <Card key={idx} className="p-4 space-y-2">
                      <p className="font-semibold text-gray-900">
                        {ws.workshop_type?.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {formatDate(ws.date)}
                        </span>
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
