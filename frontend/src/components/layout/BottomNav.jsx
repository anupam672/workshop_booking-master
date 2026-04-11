import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BookOpen,
  BarChart2,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

/**
 * BottomNav Component
 * Mobile-only navigation tabs at bottom of screen
 * Shows 5 tabs for coordinators, 4 tabs for instructors (no "Propose" for instructors)
 */
export default function BottomNav() {
  const user = useAuthStore((state) => state.user)
  const isInstructor = user?.is_instructor === true

  const tabItems = isInstructor
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ClipboardList, label: 'Workshops', path: '/workshops' },
        { icon: BookOpen, label: 'Types', path: '/workshop-types' },
        { icon: BarChart2, label: 'Stats', path: '/statistics' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ClipboardList, label: 'My Workshops', path: '/workshops' },
        { icon: PlusCircle, label: 'Propose', path: '/workshops/propose' },
        { icon: BookOpen, label: 'Types', path: '/workshop-types' },
        { icon: BarChart2, label: 'Stats', path: '/statistics' },
      ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <nav className="bg-white border-t border-gray-200 shadow-lg h-16">
        <div className="flex items-center justify-around h-full">
          {tabItems.map(({ icon: Icon, label, path }) => (
            <NavLink key={path} to={path}>
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center justify-center w-16 h-16 cursor-pointer"
                >
                  <Icon
                    size={20}
                    className={`transition-colors ${
                      isActive ? 'text-accent' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-xs mt-0.5 font-medium transition-colors ${
                      isActive ? 'text-accent' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
