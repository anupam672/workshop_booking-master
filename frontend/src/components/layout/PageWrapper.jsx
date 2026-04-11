/**
 * PageWrapper Layout Component
 * Wraps all pages with common layout elements
 */
export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Add Navbar component here when ready */}
      {/* <Navbar /> */}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer - Add Footer component here when ready */}
      {/* <Footer /> */}
    </div>
  )
}
