import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import FormField from '../components/forms/FormField'
import useAuth from '../hooks/useAuth';

// Zod Schemas for each step
const step1Schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, dots, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

const step2Schema = z.object({
  title: z.string().optional().default(''),  // blank=True on backend
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  phone_number: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
});

const step3Schema = z.object({
  institute: z.string().min(5, 'Institute name must be at least 5 characters'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().optional().default(''),  // blank=True on backend
  state: z.string().min(1, 'State is required'),
  position: z.string().min(1, 'Position is required'),
  how_did_you_hear_about_us: z.string().optional().default(''),  // blank=True on backend
});

// Departments from Django model
const DEPARTMENTS = [
  ['computer engineering', 'Computer Science'],
  ['information technology', 'Information Technology'],
  ['civil engineering', 'Civil Engineering'],
  ['electrical engineering', 'Electrical Engineering'],
  ['mechanical engineering', 'Mechanical Engineering'],
  ['chemical engineering', 'Chemical Engineering'],
  ['aerospace engineering', 'Aerospace Engineering'],
  ['biosciences and bioengineering', 'Biosciences and BioEngineering'],
  ['electronics', 'Electronics'],
  ['energy science and engineering', 'Energy Science and Engineering'],
];

// States from Django model
const STATES = [
  ['IN-AP', 'Andhra Pradesh'],
  ['IN-AR', 'Arunachal Pradesh'],
  ['IN-AS', 'Assam'],
  ['IN-BR', 'Bihar'],
  ['IN-CT', 'Chhattisgarh'],
  ['IN-GA', 'Goa'],
  ['IN-GJ', 'Gujarat'],
  ['IN-HR', 'Haryana'],
  ['IN-HP', 'Himachal Pradesh'],
  ['IN-JK', 'Jammu and Kashmir'],
  ['IN-JH', 'Jharkhand'],
  ['IN-KA', 'Karnataka'],
  ['IN-KL', 'Kerala'],
  ['IN-MP', 'Madhya Pradesh'],
  ['IN-MH', 'Maharashtra'],
  ['IN-MN', 'Manipur'],
  ['IN-ML', 'Meghalaya'],
  ['IN-MZ', 'Mizoram'],
  ['IN-NL', 'Nagaland'],
  ['IN-OR', 'Odisha'],
  ['IN-PB', 'Punjab'],
  ['IN-RJ', 'Rajasthan'],
  ['IN-SK', 'Sikkim'],
  ['IN-TN', 'Tamil Nadu'],
  ['IN-TG', 'Telangana'],
  ['IN-TR', 'Tripura'],
  ['IN-UT', 'Uttarakhand'],
  ['IN-UP', 'Uttar Pradesh'],
  ['IN-WB', 'West Bengal'],
  ['IN-AN', 'Andaman and Nicobar Islands'],
  ['IN-CH', 'Chandigarh'],
  ['IN-DN', 'Dadra and Nagar Haveli'],
  ['IN-DD', 'Daman and Diu'],
  ['IN-DL', 'Delhi'],
  ['IN-LD', 'Lakshadweep'],
  ['IN-PY', 'Puducherry'],
];

const TITLES = [
  ['Professor', 'Prof.'],
  ['Doctor', 'Dr.'],
  ['Shriman', 'Shri'],
  ['Shrimati', 'Smt'],
  ['Kumari', 'Ku'],
  ['Mr', 'Mr.'],
  ['Mrs', 'Mrs.'],
  ['Miss', 'Ms.'],
];

const SOURCES = [
  ['FOSSEE website', 'FOSSEE website'],
  ['Google', 'Google'],
  ['Social Media', 'Social Media'],
  ['From other College', 'From other College'],
];

// Step Indicator Component
function StepIndicator({ currentStep, steps }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? <Check size={20} /> : index + 1}
            </div>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step title */}
      <p className="text-center text-sm font-medium text-gray-700">{steps[currentStep]}</p>
    </div>
  );
}

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const steps = ['Account Details', 'Personal Info', 'Institution'];

  // Three separate forms for each step
  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: stepData.step1 || {},
  });

  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: stepData.step2 || {},
  });

  const form3 = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: stepData.step3 || {},
  });

  const handleNextStep = async () => {
    if (currentStep === 0) {
      const isValid = await form1.trigger();
      if (isValid) {
        setStepData({ ...stepData, step1: form1.getValues() });
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      const isValid = await form2.trigger();
      if (isValid) {
        setStepData({ ...stepData, step2: form2.getValues() });
        setCurrentStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form3.trigger();
    if (!isValid) return;

    const step1Data = stepData.step1 || {};
    const step2Data = stepData.step2 || {};
    const step3Data = form3.getValues();

    // Restructure data to match API expectations
    const formData = {
      // User account fields
      username: step1Data.username,
      email: step1Data.email,
      password: step1Data.password,
      password2: step1Data.confirm_password,  // API expects password2, not confirm_password
      // User personal fields
      first_name: step2Data.first_name,
      last_name: step2Data.last_name,
      // Nested profile object
      profile: {
        title: step2Data.title,
        phone_number: step2Data.phone_number,
        institute: step3Data.institute,
        department: step3Data.department,
        location: step3Data.location,
        state: step3Data.state,
        position: step3Data.position,
        how_did_you_hear_about_us: step3Data.how_did_you_hear_about_us,
      }
    };

    try {
      await registerUser(formData);
    } catch (err) {
      // Error handled by useAuth hook
    }
  };

  const slideVariants = {
    enter: { x: 1000, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -1000, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Sora' }}>
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">Join FOSSEE Workshops</p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={steps} />

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.form
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <FormField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  register={form1.register}
                  error={form1.formState.errors.username}
                  required
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  register={form1.register}
                  error={form1.formState.errors.email}
                  required
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  register={form1.register}
                  error={form1.formState.errors.password}
                  required
                />

                <FormField
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm password"
                  register={form1.register}
                  error={form1.formState.errors.confirm_password}
                  required
                />
              </motion.form>
            )}

            {currentStep === 1 && (
              <motion.form
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <FormField
                  label="Title"
                  name="title"
                  type="select"
                  register={form2.register}
                  error={form2.formState.errors.title}
                  required
                  options={TITLES.map(([value, label]) => ({ value, label }))}
                />

                <FormField
                  label="First Name"
                  name="first_name"
                  type="text"
                  placeholder="First name"
                  register={form2.register}
                  error={form2.formState.errors.first_name}
                  required
                />

                <FormField
                  label="Last Name"
                  name="last_name"
                  type="text"
                  placeholder="Last name"
                  register={form2.register}
                  error={form2.formState.errors.last_name}
                  required
                />

                <FormField
                  label="Phone Number"
                  name="phone_number"
                  type="tel"
                  placeholder="10 digit phone number"
                  register={form2.register}
                  error={form2.formState.errors.phone_number}
                  required
                />
              </motion.form>
            )}

            {currentStep === 2 && (
              <motion.form
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <FormField
                  label="Institute"
                  name="institute"
                  type="text"
                  placeholder="Institute name"
                  register={form3.register}
                  error={form3.formState.errors.institute}
                  required
                />

                <FormField
                  label="Department"
                  name="department"
                  type="select"
                  register={form3.register}
                  error={form3.formState.errors.department}
                  required
                  options={DEPARTMENTS.map(([value, label]) => ({ value, label }))}
                />

                <FormField
                  label="Location"
                  name="location"
                  type="text"
                  placeholder="City/Location"
                  register={form3.register}
                  error={form3.formState.errors.location}
                  required
                />

                <FormField
                  label="State"
                  name="state"
                  type="select"
                  register={form3.register}
                  error={form3.formState.errors.state}
                  required
                  options={STATES.map(([value, label]) => ({ value, label }))}
                />

                <FormField
                  label="Position"
                  name="position"
                  type="select"
                  register={form3.register}
                  error={form3.formState.errors.position}
                  required
                  options={[
                    { value: 'coordinator', label: 'Coordinator' },
                    { value: 'instructor', label: 'Instructor' }
                  ]}
                />

                <FormField
                  label="How did you hear about us?"
                  name="how_did_you_hear_about_us"
                  type="select"
                  register={form3.register}
                  error={form3.formState.errors.how_did_you_hear_about_us}
                  required
                  options={SOURCES.map(([value, label]) => ({ value, label }))}
                />
              </motion.form>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}

            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 ml-auto px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 ml-auto px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            )}
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
