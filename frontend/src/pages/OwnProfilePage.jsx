import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Edit2, Mail, Phone, Building, MapPin, Save, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import FormField from '../components/forms/FormField'
import { useAuthStore } from '../store/authStore'
import { useOwnProfile, useUpdateProfile } from '../hooks/useProfile'
import { getInitials, generateAvatarColor, formatDate, cn } from '../utils/cn'

/**
 * Constants for form choices
 */
const TITLE_CHOICES = [
  { value: 'Professor', label: 'Prof.' },
  { value: 'Doctor', label: 'Dr.' },
  { value: 'Mr', label: 'Mr.' },
  { value: 'Mrs', label: 'Mrs.' },
  { value: 'Miss', label: 'Ms.' },
  { value: 'Shriman', label: 'Shri' },
  { value: 'Shrimati', label: 'Smt' },
  { value: 'Kumari', label: 'Ku' },
]

const DEPARTMENT_CHOICES = [
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'Mechanical', label: 'Mechanical Engineering' },
  { value: 'Electronics', label: 'Electronics Engineering' },
  { value: 'Electrical', label: 'Electrical Engineering' },
  { value: 'Chemical', label: 'Chemical Engineering' },
  { value: 'Computer', label: 'Computer Engineering' },
  { value: 'Aerospace', label: 'Aerospace Engineering' },
  { value: 'Biomedical', label: 'Biomedical Engineering' },
  { value: 'Metallurgy', label: 'Metallurgy and Materials' },
  { value: 'Other', label: 'Other' },
]

const STATE_CHOICES = [
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Puducherry', label: 'Puducherry' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tripura', label: 'Tripura' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'West Bengal', label: 'West Bengal' },
]

/**
 * Zod schema for profile form validation
 */
const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone_number: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  institute: z.string().min(5, 'Institute name must be at least 5 characters'),
  department: z.string().min(1, 'Please select a department'),
  location: z.string().min(1, 'Location is required'),
  state: z.string().min(1, 'Please select a state'),
  title: z.string().min(1, 'Please select a title'),
})

/**
 * Profile Loading Skeleton
 */
function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="space-y-4">
        <Skeleton className="w-20 h-20 rounded-full mx-auto" />
        <Skeleton.Text lines={3} />
      </div>
      <div className="col-span-2">
        <Skeleton.Card className="h-96" />
      </div>
    </div>
  )
}

/**
 * Profile Card (Left Column)
 */
function ProfileInfoCard({ user, profile, isInstructor, onEditClick }) {
  if (!user || !profile) return null

  const fullName = `${user.first_name} ${user.last_name}`
  const avatar_bg = generateAvatarColor(user.first_name)

  return (
    <Card className="sticky top-24 space-y-4">
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl"
        style={{ backgroundColor: avatar_bg }}
      >
        {getInitials(fullName)}
      </div>

      {/* Name */}
      <div className="text-center">
        <h2 className="font-heading text-xl font-bold text-gray-900">{fullName}</h2>
        <Badge variant="info" size="sm" className="mt-2">
          {isInstructor ? 'Instructor' : 'Coordinator'}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex items-start gap-3">
          <Mail size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-600 break-all">{user.email}</p>
          </div>
        </div>

        {profile.phone_number && (
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{profile.phone_number}</p>
          </div>
        )}

        {profile.institute && (
          <div className="flex items-start gap-3">
            <Building size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{profile.institute}</p>
          </div>
        )}

        {profile.location && (
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              {profile.location}
              {profile.state && `, ${profile.state}`}
            </p>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <Button
        variant="outline"
        fullWidth
        className="mt-4"
        onClick={onEditClick}
      >
        <Edit2 size={16} />
        Edit Profile
      </Button>
    </Card>
  )
}

/**
 * View Mode Content
 */
function ViewMode({ user, profile }) {
  const isInstructor = user?.is_instructor === true

  return (
    <Card className="space-y-6">
      {/* Account Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Username</p>
            <p className="text-sm text-gray-900 mt-1">{user?.username}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
            <p className="text-sm text-gray-900 mt-1">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Role</p>
            <p className="text-sm text-gray-900 mt-1">
              {isInstructor ? 'Instructor' : 'Coordinator'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
            <p className="text-sm text-gray-900 mt-1">
              {user?.date_joined ? formatDate(user.date_joined) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Academic Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Academic Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Title</p>
            <p className="text-sm text-gray-900 mt-1">{profile?.title}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Department</p>
            <p className="text-sm text-gray-900 mt-1">{profile?.department}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium text-gray-500 uppercase">Institute</p>
            <p className="text-sm text-gray-900 mt-1">{profile?.institute}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">City</p>
            <p className="text-sm text-gray-900 mt-1">{profile?.location}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">State</p>
            <p className="text-sm text-gray-900 mt-1">{profile?.state}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Edit Mode Form
 */
function EditMode({ user, profile, onCancel, onSave, isSaving }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: profile?.phone_number || '',
      institute: profile?.institute || '',
      department: profile?.department || '',
      location: profile?.location || '',
      state: profile?.state || '',
      title: profile?.title || '',
    },
  })

  useEffect(() => {
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: profile?.phone_number || '',
      institute: profile?.institute || '',
      department: profile?.department || '',
      location: profile?.location || '',
      state: profile?.state || '',
      title: profile?.title || '',
    })
  }, [user, profile, reset])

  return (
    <Card className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="first_name"
            register={register}
            error={errors.first_name?.message}
            required
          />
          <FormField
            label="Last Name"
            name="last_name"
            register={register}
            error={errors.last_name?.message}
            required
          />
        </div>

        {/* Email (Read-only) */}
        <FormField
          label="Email"
          name="email"
          type="email"
          register={register}
          disabled
          hint="Email cannot be changed"
        />

        {/* Phone Number */}
        <FormField
          label="Phone Number"
          name="phone_number"
          type="tel"
          register={register}
          error={errors.phone_number?.message}
          placeholder="10-digit number"
          required
        />

        {/* Title */}
        <FormField
          label="Title"
          name="title"
          type="select"
          register={register}
          options={TITLE_CHOICES}
          error={errors.title?.message}
          required
        />

        {/* Institute */}
        <FormField
          label="Institute"
          name="institute"
          register={register}
          error={errors.institute?.message}
          placeholder="Institution name"
          required
        />

        {/* Department */}
        <FormField
          label="Department"
          name="department"
          type="select"
          register={register}
          options={DEPARTMENT_CHOICES}
          error={errors.department?.message}
          required
        />

        {/* Location */}
        <FormField
          label="Location/City"
          name="location"
          register={register}
          error={errors.location?.message}
          placeholder="City or location"
          required
        />

        {/* State */}
        <FormField
          label="State"
          name="state"
          type="select"
          register={register}
          options={STATE_CHOICES}
          error={errors.state?.message}
          required
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

/**
 * Own Profile Page
 */
export default function OwnProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { user: authUser } = useAuthStore()
  const { user, profile, isLoading } = useOwnProfile()
  const { update, isUpdating } = useUpdateProfile()

  const handleSaveProfile = (formData) => {
    update(formData, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  if (isLoading) {
    return (
      <PageWrapper title="My Profile">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileSkeleton />
        </div>
      </PageWrapper>
    )
  }

  const isInstructor = authUser?.is_instructor === true

  return (
    <PageWrapper title="My Profile">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1">
            <ProfileInfoCard
              user={user}
              profile={profile}
              isInstructor={isInstructor}
              onEditClick={() => setIsEditing(true)}
            />
          </div>

          {/* Right Column - View or Edit Mode */}
          <div className="md:col-span-2">
            {isEditing ? (
              <EditMode
                user={user}
                profile={profile}
                onCancel={() => setIsEditing(false)}
                onSave={handleSaveProfile}
                isSaving={isUpdating}
              />
            ) : (
              <ViewMode user={user} profile={profile} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
