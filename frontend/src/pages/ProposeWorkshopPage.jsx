import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

import { useWorkshopTypes, useWorkshopTypeTNC, useProposeWorkshop } from '../hooks/useWorkshops'
import { formatDate } from '../utils/cn'

/**
 * Step Indicator
 */
function StepIndicator({ currentStep }) {
  const steps = ['Select Workshop', 'Choose Date', 'Confirm']

  return (
    <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
      {steps.map((label, idx) => (
        <div key={idx} className="flex items-center flex-1">
          {/* Circle */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              idx + 1 <= currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {idx + 1}
          </div>

          {/* Line */}
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 transition-all ${
                idx + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Propose Workshop Page
 */
export default function ProposeWorkshopPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedWorkshopType, setSelectedWorkshopType] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [tncAccepted, setTncAccepted] = useState(false)
  const [showTNC, setShowTNC] = useState(false)

  const { data: workshopTypes, isLoading: isLoadingTypes } =
    useWorkshopTypes(1)
  const { data: tncData } = useWorkshopTypeTNC(
    selectedWorkshopType?.id
  )
  const { propose, isProposing } = useProposeWorkshop()

  const types = workshopTypes?.results || []

  const handlePropose = () => {
    if (selectedWorkshopType && selectedDate) {
      propose({
        workshop_type: selectedWorkshopType.id,
        date: selectedDate.toISOString().split('T')[0],
        tnc_accepted: tncAccepted,
      })
    }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 3)

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 365)

  // Generate calendar days for simple date picker
  const generateCalendar = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const days = []

    // Previous month days
    const prevMonthDays = firstDay.getDay()
    const prevMonth = new Date(year, month, 0)
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return { daysOfWeek, days }
  }

  const { daysOfWeek, days } = generateCalendar()

  const isDateValid = (date) => {
    if (!date) return false
    const day = date.getDay()
    return date >= minDate && date <= maxDate && day !== 0 && day !== 6
  }

  return (
    <PageWrapper title="Propose Workshop">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step 1: Select Workshop */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                What type of workshop do you want to propose?
              </h2>
              <p className="text-gray-600">
                Select from available workshop types
              </p>
            </div>

            {isLoadingTypes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton.Card key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {types.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedWorkshopType(type)}
                    className="cursor-pointer"
                  >
                    <Card
                      variant={
                        selectedWorkshopType?.id === type.id
                          ? 'bordered'
                          : 'default'
                      }
                      className="p-5 relative h-full hover:shadow-lg transition-shadow"
                    >
                      {selectedWorkshopType?.id === type.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                          ✓
                        </div>
                      )}

                      <h3 className="text-lg font-heading font-semibold text-gray-900">
                        {type.name}
                      </h3>

                      <div className="mt-3">
                        <Badge size="sm" variant="info">
                          <Clock size={14} />
                          {type.duration} day(s)
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {type.description || 'No description available'}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* TNC Section */}
            {selectedWorkshopType && tncData && (
              <Card variant="flat" className="p-4">
                <button
                  onClick={() => setShowTNC(!showTNC)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">
                    View Terms & Conditions
                  </span>
                  {showTNC ? (
                    <ChevronUp size={20} className="text-primary" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {showTNC && (
                  <div className="mt-3 max-h-32 overflow-y-auto text-sm text-gray-600 border-t border-gray-200 pt-3">
                    {tncData.terms_and_conditions}
                  </div>
                )}
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <div />
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedWorkshopType}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Date */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                When would you like to hold the workshop?
              </h2>
              <p className="text-gray-600">
                Select a date at least 3 days from now (weekdays only)
              </p>
            </div>

            {/* Calendar */}
            <Card variant="elevated" className="p-6">
              <div className="max-w-sm mx-auto">
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {days.map((dayObj, idx) => {
                    const isDisabled =
                      !isDateValid(dayObj.date) ||
                      !dayObj.isCurrentMonth
                    const isSelected =
                      selectedDate &&
                      dayObj.date.toDateString() ===
                        selectedDate.toDateString()

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDate(dayObj.date)
                          }
                        }}
                        disabled={isDisabled}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-white'
                            : isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {dayObj.date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* Selected Date Display */}
            <div className="text-center">
              {selectedDate ? (
                <p className="text-gray-900 font-medium">
                  Selected: <span className="text-primary">{formatDate(selectedDate)}</span>
                </p>
              ) : (
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <AlertCircle size={16} />
                  No date selected yet
                </p>
              )}
            </div>

            {/* T&C Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="tnc"
                checked={tncAccepted}
                onChange={(e) => setTncAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary cursor-pointer"
              />
              <label htmlFor="tnc" className="text-sm text-gray-700 cursor-pointer">
                I have read and accept the Terms and Conditions
              </label>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(3)}
                disabled={!selectedDate || !tncAccepted}
              >
                Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                Confirm Your Workshop Proposal
              </h2>
              <p className="text-gray-600">
                Review your details before submitting
              </p>
            </div>

            {/* Summary Card */}
            <Card variant="elevated" className="p-6">
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                Workshop Details
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Workshop Type:</span>
                  <span className="font-medium text-gray-900">
                    {selectedWorkshopType?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {selectedWorkshopType?.duration} day(s)
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">T&C Accepted:</span>
                  <span className="font-medium text-success">✓ Yes</span>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(2)}
                disabled={isProposing}
              >
                Back
              </Button>
              <Button
                variant="accent"
                fullWidth
                loading={isProposing}
                onClick={handlePropose}
              >
                Submit Proposal
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
