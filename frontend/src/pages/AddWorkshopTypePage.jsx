import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Upload } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import FormField from '../components/forms/FormField'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useWorkshopTypeById } from '../hooks/useWorkshops'
import toast from 'react-hot-toast'
import apiClient from '../api/client'

// Validation schemas for each step
const step1Schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  expertise_level: z.enum(['beginner', 'intermediate', 'advanced'], 'Select expertise level'),
})

const step2Schema = z.object({
  instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
  resources: z.string().optional(),
})

const step3Schema = z.object({
  tnc: z.string().min(10, 'T&C must be at least 10 characters'),
})

export default function AddWorkshopTypePage() {
  const navigate = useNavigate()
  const { id: typeId } = useParams()
  const isEdit = !!typeId

  const { data: existingType, isLoading: isLoadingExisting } = useWorkshopTypeById(typeId)

  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState({ title: '', description: '', expertise_level: '' })
  const [step2Data, setStep2Data] = useState({ instructions: '', resources: '' })
  const [step3Data, setStep3Data] = useState({ tnc: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing data if editing
  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: step1Data,
  })

  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: step2Data,
  })

  const form3 = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: step3Data,
  })

  // Step 1 handler
  const onStep1Submit = async (data) => {
    setStep1Data(data)
    setStep(2)
  }

  // Step 2 handler
  const onStep2Submit = async (data) => {
    setStep2Data(data)
    setStep(3)
  }

  // Step 3 handler (final submit)
  const onStep3Submit = async (data) => {
    setStep3Data(data)
    
    setIsSubmitting(true)
    try {
      const payload = {
        ...step1Data,
        ...step2Data,
        ...data,
      }

      if (isEdit) {
        await apiClient.patch(`/workshop-types/${typeId}/`, payload)
        toast.success('Workshop type updated successfully!')
      } else {
        await apiClient.post('/workshop-types/', payload)
        toast.success('Workshop type created successfully!')
      }

      navigate('/workshop-types')
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save workshop type'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const expertiseOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

  const steps = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Instructions' },
    { num: 3, title: 'T&C' },
  ]

  if (isLoadingExisting && isEdit) {
    return (
      <PageWrapper title={isEdit ? 'Edit Workshop Type' : 'Create Workshop Type'}>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading workshop type...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={isEdit ? 'Edit Workshop Type' : 'Create Workshop Type'}>
      <div className="max-w-2xl mx-auto">
        
        {/* Step Indicator */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress line background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
            
            {/* Progress line filled */}
            <motion.div
              className="absolute top-5 left-0 h-0.5 bg-primary -z-10"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />

            {/* Step circles */}
            {steps.map((s) => (
              <div
                key={s.num}
                className="flex flex-col items-center flex-1"
              >
                <motion.div
                  animate={{
                    backgroundColor: s.num <= step ? '#0F4C81' : '#E5E7EB',
                    scale: s.num === step ? 1.1 : 1,
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mb-2 relative z-10"
                >
                  {s.num}
                </motion.div>
                <p className={`text-sm font-medium ${ s.num <= step ? 'text-primary' : 'text-gray-500'}`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Steps */}
        <Card>
          <Card.Body>
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Basic Information
                  </h2>
                  <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
                    <FormField
                      label="Workshop Title"
                      name="title"
                      register={form1.register}
                      error={form1.formState.errors.title}
                      placeholder="e.g., Introduction to Python"
                      required
                    />

                    <FormField
                      label="Description"
                      name="description"
                      type="textarea"
                      rows={4}
                      register={form1.register}
                      error={form1.formState.errors.description}
                      placeholder="Describe what participants will learn"
                      required
                    />

                    <FormField
                      label="Expertise Level"
                      name="expertise_level"
                      type="select"
                      options={expertiseOptions}
                      register={form1.register}
                      error={form1.formState.errors.expertise_level}
                      required
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/workshop-types')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" fullWidth className="ml-auto">
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Instructions & Resources
                  </h2>
                  <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
                    <FormField
                      label="Instructions"
                      name="instructions"
                      type="textarea"
                      rows={5}
                      register={form2.register}
                      error={form2.formState.errors.instructions}
                      placeholder="Detailed instructions for conducting the workshop"
                      required
                    />

                    <FormField
                      label="Resources (Optional)"
                      name="resources"
                      type="textarea"
                      rows={3}
                      register={form2.register}
                      error={form2.formState.errors.resources}
                      placeholder="List of resources or materials needed"
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        <ChevronLeft size={16} />
                        Back
                      </Button>
                      <Button type="submit" variant="primary" fullWidth className="ml-auto">
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Terms & Conditions
                  </h2>
                  <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-4">
                    <FormField
                      label="Terms & Conditions"
                      name="tnc"
                      type="textarea"
                      rows={6}
                      register={form3.register}
                      error={form3.formState.errors.tnc}
                      placeholder="Enter terms and conditions for this workshop type"
                      required
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        <ChevronLeft size={16} />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isSubmitting}
                        className="ml-auto"
                      >
                        {isEdit ? 'Update' : 'Create'} Workshop Type
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </Card.Body>
        </Card>

      </div>
    </PageWrapper>
  )
}
