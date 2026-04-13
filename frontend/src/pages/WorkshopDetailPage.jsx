import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft,
  Calendar,
  User,
  Building,
  Clock,
  MessageSquare,
} from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge, { getStatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'
import FormField from '../components/forms/FormField'

import { useAuthStore } from '../store/authStore'
import {
  useWorkshopById,
  useWorkshopComments,
  usePostComment,
  useAcceptWorkshop,
} from '../hooks/useWorkshops'
import {
  formatDate,
  getInitials,
  generateAvatarColor,
} from '../utils/cn'

/**
 * Workshop Detail Page
 */
export default function WorkshopDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data: workshop, isLoading } = useWorkshopById(id)
  const { data: comments } = useWorkshopComments(id)
  const { postComment, isPosting } = usePostComment(id)
  const { accept: acceptWorkshop, isAccepting } = useAcceptWorkshop()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { comment: '' },
  })

  const isCoordinator = user?.is_instructor === false
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [commentPublic, setCommentPublic] = useState(true)

  const onCommentSubmit = ({ comment }) => {
    postComment(
      { comment, public: commentPublic },
      {
        onSuccess: () => reset(),
      }
    )
  }

  const handleAccept = () => {
    acceptWorkshop(id, {
      onSuccess: () => {
        setShowAcceptModal(false)
      },
    })
  }

  if (isLoading) {
    return (
      <PageWrapper title="Workshop Details">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <Skeleton.Card className="h-24" />
          <Skeleton.Card className="h-72" />
          <Skeleton.Card className="h-96" />
        </div>
      </PageWrapper>
    )
  }

  if (!workshop) {
    return (
      <PageWrapper title="Workshop Details">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Workshop not found</p>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const commentsList = Array.isArray(comments) ? comments : (comments?.results || [])

  return (
    <PageWrapper title="Workshop Details">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Workshops
        </button>

        {/* Workshop Info Card */}
        <Card variant="elevated" className="p-6">
          <Card.Header className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                {workshop.workshop_type_name}
              </h1>
              {getStatusBadge(workshop.status)}
            </div>
          </Card.Header>

          <Card.Body className="space-y-4">
            {/* Grid of details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar - Date */}
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(workshop.date)}
                  </p>
                </div>
              </div>

              {/* User - Coordinator or Instructor */}
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {isCoordinator ? 'Instructor' : 'Coordinator'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {isCoordinator
                      ? `${workshop.instructor_first_name} ${workshop.instructor_last_name || 'Awaiting'}`
                      : `${workshop.coordinator_first_name} ${workshop.coordinator_last_name}`}
                  </p>
                </div>
              </div>

              {/* Building - Institute */}
              {!isCoordinator && workshop.institute && (
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Institute</p>
                    <p className="font-medium text-gray-900">
                      {workshop.institute}
                    </p>
                  </div>
                </div>
              )}

              {/* Clock - Duration */}
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">
                    {workshop.workshop_duration || 'Not specified'} day(s)
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>

          {/* Accept Button for Instructor on Pending Workshops */}
          {!isCoordinator && workshop.status === 0 && (
            <Card.Footer className="border-t border-gray-100 flex items-center justify-end">
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowAcceptModal(true)}
              >
                Accept Workshop
              </Button>
            </Card.Footer>
          )}
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            <h2 className="text-xl font-heading font-bold text-gray-900">
              Discussion ({commentsList.length})
            </h2>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {commentsList.length === 0 ? (
              <Card variant="flat" className="p-6 text-center">
                <p className="text-gray-600">
                  No comments yet. Be the first to comment!
                </p>
              </Card>
            ) : (
              commentsList.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold`}
                    style={{
                      backgroundColor: generateAvatarColor(comment.author_name || 'Guest'),
                    }}
                  >
                    {getInitials(comment.author_name || 'Guest')}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900">
                        {comment.author_name || 'Guest'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.created_date)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.comment}
                    </p>
                    {!isCoordinator && (
                      <p className="text-xs text-gray-500 mt-2">
                        {comment.public ? 'Public' : 'Private'}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <Card variant="flat" className="p-6">
            <form onSubmit={handleSubmit(onCommentSubmit)} className="space-y-4">
              <FormField
                label="Add a Comment"
                name="comment"
                register={register}
                rules={{
                  required: 'Comment is required',
                  minLength: {
                    value: 1,
                    message: 'Comment must be at least 1 character',
                  },
                }}
                type="textarea"
                rows={3}
                placeholder="Share your thoughts..."
              />

              <div className="flex items-center justify-between">
                {!isCoordinator && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commentPublic}
                      onChange={(e) =>
                        setCommentPublic(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary"
                    />
                    <span className="text-sm text-gray-600">
                      Public comment
                    </span>
                  </label>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  loading={isPosting}
                  type="submit"
                >
                  Post Comment
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Workshop?"
        size="md"
        footer={
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAcceptModal(false)}
              disabled={isAccepting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isAccepting}
              onClick={handleAccept}
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
