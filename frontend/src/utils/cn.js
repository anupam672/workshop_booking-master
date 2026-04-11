import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Handles conflicts by giving Tailwind utilities priority
 * @param {...Array<any>} inputs - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to "DD MMM YYYY" format
 * @param {string | Date} dateString - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  return new Intl.DateTimeFormat('en-US', options).format(date)
}

/**
 * Get initials from a full name
 * @param {string} fullName - Full name of person
 * @returns {string} Two-character initials in uppercase
 */
export function getInitials(fullName) {
  if (!fullName) return '?'

  const names = fullName.trim().split(/\s+/)
  if (names.length === 0) return '?'

  const firstInitial = names[0].charAt(0).toUpperCase()
  const secondInitial =
    names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : names[0].charAt(1).toUpperCase() || ''

  return firstInitial + secondInitial
}

/**
 * Generate a consistent avatar background color based on name
 * @param {string} name - Name to generate color from
 * @returns {string} Hex color code
 */
export function generateAvatarColor(name) {
  const colors = [
    '#0F4C81', // primary
    '#F97316', // accent
    '#16A34A', // success
    '#CA8A04', // warning
    '#DC2626', // danger
    '#7C3AED', // violet
    '#06B6D4', // cyan
    '#EC4899', // pink
  ]

  if (!name) return colors[0]

  let charCode = 0
  for (let i = 0; i < name.length; i++) {
    charCode += name.charCodeAt(i)
  }

  return colors[charCode % colors.length]
}
