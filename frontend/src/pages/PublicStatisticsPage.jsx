import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { formatDate } from '../utils/cn'
import { getPublicStatistics, downloadStatisticsCSV } from '../api/statistics'

/**
 * Constants for Indian states
 */
const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Dadar and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const COLORS = ['#0F4C81', '#F97316', '#16A34A', '#CA8A04', '#6366F1', '#EC4899']

/**
 * Helper to get status badge color
 */
function getStatusBadge(status) {
  const statusMap = {
    0: { label: 'Pending', variant: 'pending' },
    1: { label: 'Accepted', variant: 'accepted' },
    2: { label: 'Rejected', variant: 'deleted' },
  }
  return statusMap[status] || { label: 'Unknown', variant: 'default' }
}

/**
 * Filter Panel Component
 */
function FilterPanel({
  filters,
  onFilterChange,
  onApply,
  onReset,
  workshopTypes,
  states,
  activeFilterCount,
  isOpen,
  onClose,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClose} className="p-1">
          <X size={20} />
        </button>
      </div>

      {/* From Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Date
        </label>
        <input
          type="date"
          value={filters.from_date || ''}
          onChange={(e) => onFilterChange('from_date', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* To Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          To Date
        </label>
        <input
          type="date"
          value={filters.to_date || ''}
          onChange={(e) => onFilterChange('to_date', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <select
          value={filters.state || ''}
          onChange={(e) => onFilterChange('state', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Workshop Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workshop Type
        </label>
        <select
          value={filters.workshop_type || ''}
          onChange={(e) => onFilterChange('workshop_type', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Types</option>
          {workshopTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By Date
        </label>
        <select
          value={filters.sort || ''}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Default</option>
          <option value="date_asc">Oldest First</option>
          <option value="date_desc">Newest First</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="primary" fullWidth onClick={onApply}>
          Apply Filters
        </Button>
        <Button variant="outline" fullWidth onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}

/**
 * Summary Card Component
 */
function SummaryCard({ icon: Icon, label, value, isLoading }) {
  if (isLoading) {
    return <Skeleton.Card className="h-24" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
      <div className="flex items-center gap-2 text-gray-600">
        {Icon && <Icon size={18} />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

/**
 * Public Statistics Page
 */
export default function PublicStatisticsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [localFilters, setLocalFilters] = useState({
    from_date: searchParams.get('from_date') || '',
    to_date: searchParams.get('to_date') || '',
    state: searchParams.get('state') || '',
    workshop_type: searchParams.get('workshop_type') || '',
    sort: searchParams.get('sort') || '',
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Build query params from URL
  const queryParams = {
    from_date: searchParams.get('from_date'),
    to_date: searchParams.get('to_date'),
    state: searchParams.get('state'),
    workshop_type: searchParams.get('workshop_type'),
    sort: searchParams.get('sort'),
    page: currentPage,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['publicStatistics', queryParams],
    queryFn: () => getPublicStatistics(queryParams),
  })

  const stats = data?.results || {}
  const workshops = stats.workshops || []
  const ws_states = stats.ws_states || []
  const ws_count = stats.ws_count || []
  const ws_type = stats.ws_type || []
  const ws_type_count = stats.ws_type_count || []
  const total_count = stats.total_count || 0
  const states_count = stats.states_count || 0
  const count = data?.count || 0

  // Filter count excluding pagination
  const activeFilterCount = Object.values(localFilters).filter((v) => v).length

  // Prepare chart data
  const statesChartData = useMemo(() => {
    const data = ws_states.map((state, idx) => ({
      name: state,
      count: ws_count[idx] || 0,
    }))
    return data.sort((a, b) => b.count - a.count)
  }, [ws_states, ws_count])

  const typeChartData = useMemo(
    () =>
      ws_type.map((type, idx) => ({
        name: type,
        value: ws_type_count[idx] || 0,
      })),
    [ws_type, ws_type_count]
  )

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (localFilters.from_date) params.set('from_date', localFilters.from_date)
    if (localFilters.to_date) params.set('to_date', localFilters.to_date)
    if (localFilters.state) params.set('state', localFilters.state)
    if (localFilters.workshop_type)
      params.set('workshop_type', localFilters.workshop_type)
    if (localFilters.sort) params.set('sort', localFilters.sort)
    params.set('page', '1')
    setSearchParams(params)
    setIsFilterOpen(false)
  }

  const handleResetFilters = () => {
    setLocalFilters({
      from_date: '',
      to_date: '',
      state: '',
      workshop_type: '',
      sort: '',
    })
    setSearchParams({})
    setIsFilterOpen(false)
  }

  const handleDownloadCSV = async () => {
    try {
      setIsDownloading(true)
      const downloadParams = {
        from_date: searchParams.get('from_date'),
        to_date: searchParams.get('to_date'),
        state: searchParams.get('state'),
        workshop_type: searchParams.get('workshop_type'),
        sort: searchParams.get('sort'),
      }
      const response = await downloadStatisticsCSV(downloadParams)
      const blob = response.data
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `statistics-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      // Silent error handling - user will see network error
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
    window.scrollTo(0, 0)
  }

  const pageSize = 20
  const totalPages = Math.ceil(count / pageSize)
  const hasData = workshops.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 pb-10 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Workshop Statistics
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Total Workshops"
              value={total_count}
              isLoading={isLoading}
            />
            <SummaryCard
              label="States Reached"
              value={states_count}
              isLoading={isLoading}
            />
            <SummaryCard
              label="Workshop Types"
              value={ws_type.length}
              isLoading={isLoading}
            />
            <SummaryCard
              label="Shown Period"
              value={
                localFilters.from_date && localFilters.to_date
                  ? `${localFilters.from_date} to ${localFilters.to_date}`
                  : 'All Time'
              }
              isLoading={isLoading}
            />
          </div>

          {/* Filter Section - Desktop */}
          <div className="hidden md:block">
            <FilterPanel
              filters={localFilters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              workshopTypes={ws_type}
              states={INDIAN_STATES}
              activeFilterCount={activeFilterCount}
              isOpen={true}
              onClose={() => {}}
            />
          </div>

          {/* Filter Button - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Filter size={18} />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge size="sm" variant="info">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Filter Drawer - Mobile */}
          {isFilterOpen && (
            <div className="md:hidden">
              <FilterPanel
                filters={localFilters}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                workshopTypes={ws_type}
                states={INDIAN_STATES}
                activeFilterCount={activeFilterCount}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}

          {/* Charts Row */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton.Card className="h-80" />
              <Skeleton.Card className="h-80" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* States Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Workshops by State
                </h3>
                {statesChartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height={statesChartData.length <= 5 ? 300 : 50 * statesChartData.length}
                  >
                    <BarChart
                      data={statesChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                        formatter={(value) => [`${value} workshops`, 'Count']}
                      />
                      <Bar dataKey="count" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>

              {/* Type Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Workshops by Type
                </h3>
                {typeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} workshops`} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workshops Table Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Workshop Schedule</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadCSV}
                loading={isDownloading}
              >
                <Download size={16} />
                Download CSV
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton.Card key={i} className="h-16" />
                ))}
              </div>
            ) : !hasData ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">
                  No workshops found for the selected filters
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Workshop Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Coordinator
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          State
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workshops.map((ws, idx) => {
                        const status = getStatusBadge(ws.status)
                        return (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                              {ws.workshop_type?.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {ws.coordinator?.first_name} {ws.coordinator?.last_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {ws.coordinator__profile__state}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(ws.date)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={status.variant} size="sm">
                                {status.label}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {workshops.map((ws, idx) => {
                    const status = getStatusBadge(ws.status)
                    return (
                      <Card key={idx} className="p-4 space-y-2">
                        <div className="font-semibold text-gray-900">
                          {ws.workshop_type?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {ws.coordinator?.first_name} {ws.coordinator?.last_name} •{' '}
                          {ws.coordinator__profile__state}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatDate(ws.date)}
                          </span>
                          <Badge variant={status.variant} size="sm">
                            {status.label}
                          </Badge>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}

            {/* Pagination */}
            {hasData && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-gray-600 min-w-fit">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
