import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

/**
 * PageWrapper Component
 * Wraps all authenticated pages with Navbar, BottomNav, and page transition animations
 * @param {React.ReactNode} children - Page content
 * @param {string} title - Page title (optional). Used to set document.title
 */
export default function PageWrapper({ children, title }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} — FOSSEE Workshops`
    }
  }, [title])

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />

      <main className="pt-16 pb-20 md:pb-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
