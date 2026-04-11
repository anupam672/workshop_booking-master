import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  User,
  ChevronDown,
  LogOut,
  KeyRound,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import useAuth from '../../hooks/useAuth'
import { getInitials } from '../../utils/cn'

/**
 * Navbar Component
 * Fixed top navigation with responsive mobile menu and user dropdown
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuth()

  const isInstructor = user?.is_instructor === true

  const handleLogout = async () => {
    await logout()
    setIsUserDropdownOpen(false)
  }

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 flex-shrink-0"
          onClick={handleNavLinkClick}
        >
          <GraduationCap size={24} className="text-accent" />
          <span className="font-heading font-bold text-white text-lg">
            FOSSEE Workshops
          </span>
        </NavLink>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'text-accent border-b-2 border-accent pb-1 transition-colors'
                : 'text-white/80 hover:text-white pb-1 transition-colors'
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/workshops"
            className={({ isActive }) =>
              isActive
                ? 'text-accent border-b-2 border-accent pb-1 transition-colors'
                : 'text-white/80 hover:text-white pb-1 transition-colors'
            }
          >
            Workshops
          </NavLink>

          <NavLink
            to="/workshop-types"
            className={({ isActive }) =>
              isActive
                ? 'text-accent border-b-2 border-accent pb-1 transition-colors'
                : 'text-white/80 hover:text-white pb-1 transition-colors'
            }
          >
            Workshop Types
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              isActive
                ? 'text-accent border-b-2 border-accent pb-1 transition-colors'
                : 'text-white/80 hover:text-white pb-1 transition-colors'
            }
          >
            Statistics
          </NavLink>

          {isInstructor && (
            <NavLink
              to="/statistics/team"
              className={({ isActive }) =>
                isActive
                  ? 'text-accent border-b-2 border-accent pb-1 transition-colors'
                  : 'text-white/80 hover:text-white pb-1 transition-colors'
              }
            >
              Team Stats
            </NavLink>
          )}

          {!isInstructor && (
            <NavLink
              to="/workshops/propose"
              className={({ isActive }) =>
                isActive
                  ? 'text-accent border-b-2 border-accent pb-1 transition-colors'
                  : 'text-white/80 hover:text-white pb-1 transition-colors'
              }
            >
              Propose Workshop
            </NavLink>
          )}
        </div>

        {/* Right: Desktop User Dropdown + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Desktop User Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                {getInitials(`${user?.first_name || ''} ${user?.last_name || ''}`)}
              </div>
              <span className="text-white text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <ChevronDown
                size={16}
                className={`text-white transition-transform ${
                  isUserDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <User size={16} />
                  <span className="text-sm">My Profile</span>
                </NavLink>

                <NavLink
                  to="/change-password"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <KeyRound size={16} />
                  <span className="text-sm">Change Password</span>
                </NavLink>

                <div className="border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/5 transition-colors last:rounded-b-lg"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'block px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium'
                  : 'block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium'
              }
              onClick={handleNavLinkClick}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/workshops"
              className={({ isActive }) =>
                isActive
                  ? 'block px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium'
                  : 'block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium'
              }
              onClick={handleNavLinkClick}
            >
              Workshops
            </NavLink>

            <NavLink
              to="/workshop-types"
              className={({ isActive }) =>
                isActive
                  ? 'block px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium'
                  : 'block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium'
              }
              onClick={handleNavLinkClick}
            >
              Workshop Types
            </NavLink>

            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                isActive
                  ? 'block px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium'
                  : 'block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium'
              }
              onClick={handleNavLinkClick}
            >
              Statistics
            </NavLink>

            {isInstructor && (
              <NavLink
                to="/statistics/team"
                className={({ isActive }) =>
                  isActive
                    ? 'block px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium'
                    : 'block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium'
                }
                onClick={handleNavLinkClick}
              >
                Team Stats
              </NavLink>
            )}

            {!isInstructor && (
              <NavLink
                to="/workshops/propose"
                className={({ isActive }) =>
                  isActive
                    ? 'block px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium'
                    : 'block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium'
                }
                onClick={handleNavLinkClick}
              >
                Propose Workshop
              </NavLink>
            )}

            <div className="border-t border-gray-200 my-4 pt-4">
              <NavLink
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                onClick={handleNavLinkClick}
              >
                <User size={16} />
                My Profile
              </NavLink>

              <NavLink
                to="/change-password"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                onClick={handleNavLinkClick}
              >
                <KeyRound size={16} />
                Change Password
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/5 rounded-lg text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
