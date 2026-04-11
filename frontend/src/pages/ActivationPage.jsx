import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { activateUser } from '../api/auth';

function CheckmarkIcon() {
  const checkmarkVariants = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <svg className="w-20 h-20 mx-auto mb-6" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="2" />
      <motion.path
        d="M 30 50 L 45 65 L 70 40"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={checkmarkVariants}
        initial="initial"
        animate="animate"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-20 h-20 mx-auto mb-6 text-red-500" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
      <path d="M 30 30 L 70 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M 70 30 L 30 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EnvelopeIcon() {
  const bounceVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <motion.svg
      className="w-20 h-20 mx-auto mb-6 text-primary"
      viewBox="0 0 100 100"
      fill="none"
      variants={bounceVariants}
      initial="initial"
      animate="animate"
    >
      <rect x="15" y="30" width="70" height="50" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M 15 30 L 50 55 L 85 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

export default function ActivationPage() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!key) {
      setState('waiting');
      return;
    }

    const activate = async () => {
      try {
        await activateUser(key);
        setState('success');
      } catch (err) {
        setError(err.response?.data?.error || 'Activation failed');
        setState('error');
      }
    };

    activate();
  }, [key]);

  if (state === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
        >
          <EnvelopeIcon />
          <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Sora' }}>
            Check Your Email
          </h1>
          <p className="text-gray-600 mb-6">
            We sent an activation link to your email. Click it to verify your account.
          </p>
          <p className="text-sm text-gray-500">Link expires in 24 hours</p>
        </motion.div>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-600 font-medium">Activating your account...</p>
        </motion.div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
        >
          <CheckmarkIcon />
          <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Sora' }}>
            Email Verified!
          </h1>
          <p className="text-gray-600 mb-8">Your account is ready. You can now sign in.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
        >
          <ErrorIcon />
          <h1 className="text-2xl font-bold text-red-600 mb-2" style={{ fontFamily: 'Sora' }}>
            Link Expired or Invalid
          </h1>
          <p className="text-gray-600 mb-8">This activation link has expired. Please register again.</p>
          <button
            onClick={() => navigate('/register')}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Register Again
          </button>
        </motion.div>
      </div>
    );
  }
}

