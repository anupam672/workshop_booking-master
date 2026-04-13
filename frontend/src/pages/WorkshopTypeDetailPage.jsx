import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Edit2, FileText } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import PageTitle from '../components/layout/PageTitle'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { useWorkshopTypeById, useWorkshopTypeTNC } from '../hooks/useWorkshops'
import useAuthStore from '../store/authStore'

export default function WorkshopTypeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const { data: workshopType, isLoading, isError, error } = useWorkshopTypeById(id)
  const { data: tncData } = useWorkshopTypeTNC(id)

  if (isError) {
    return (
      <PageWrapper title="Workshop Type">
        <div className="text-center py-12">
          <p className="text-danger text-lg mb-4">
            Failed to load workshop type: {error?.message}
          </p>
          <Button onClick={() => navigate('/workshop-types')}>
            Go Back to Workshop Types
          </Button>
        </div>
      </PageWrapper>
    )
  }

  if (isLoading) {
    return (
      <PageWrapper title="Workshop Type">
        <Skeleton.Card count={3} />
      </PageWrapper>
    )
  }

  const isOwnType = workshopType?.created_by === user?.id
  const canEdit = user?.is_instructor && isOwnType

  return (
    <PageWrapper title="Workshop Type Details">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/workshop-types')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              {workshopType?.title}
            </h1>
          </div>
          {canEdit && (
            <Link to={`/workshop-types/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit2 size={16} />
                Edit
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left column - main content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            {workshopType?.description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {workshopType.description}
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Instructions */}
            {workshopType?.instructions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Instructions
                    </h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {workshopType.instructions}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Resources & Attachments */}
            {workshopType?.resources && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Resources
                    </h2>
                    <div className="space-y-2">
                      {workshopType.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <FileText className="text-primary group-hover:text-primary-dark" size={20} />
                          <span className="text-sm text-gray-700 group-hover:text-primary flex-1 truncate">
                            {resource.name || resource.file.split('/').pop()}
                          </span>
                          <Download size={16} className="text-gray-400 group-hover:text-primary" />
                        </a>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* T&C */}
            {tncData?.tnc && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Terms & Conditions
                    </h2>
                    <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {tncData.tnc}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

          </div>

          {/* Right column - metadata */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            
            {/* Info card */}
            <Card variant="elevated">
              <Card.Body>
                <h3 className="font-semibold text-gray-900 mb-4">Workshop Details</h3>
                
                <div className="space-y-3 text-sm">
                  {workshopType?.expertise_level && (
                    <div>
                      <p className="text-gray-500 mb-1">Expertise Level</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {workshopType.expertise_level}
                      </p>
                    </div>
                  )}
                  
                  {workshopType?.created_by_name && (
                    <div>
                      <p className="text-gray-500 mb-1">Created By</p>
                      <Link
                        to={`/profile/${workshopType.created_by}`}
                        className="font-medium text-primary hover:text-primary-dark"
                      >
                        {workshopType.created_by_name}
                      </Link>
                    </div>
                  )}

                  {workshopType?.created_at && (
                    <div>
                      <p className="text-gray-500 mb-1">Created On</p>
                      <p className="font-medium text-gray-900">
                        {new Date(workshopType.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {workshopType?.workshop_count !== undefined && (
                    <div>
                      <p className="text-gray-500 mb-1">Associated Workshops</p>
                      <p className="font-medium text-gray-900">
                        {workshopType.workshop_count}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/workshops')}
                  >
                    View All Workshops
                  </Button>
                </div>
              </Card.Body>
            </Card>

          </motion.div>

        </div>

      </div>
    </PageWrapper>
  )
}
