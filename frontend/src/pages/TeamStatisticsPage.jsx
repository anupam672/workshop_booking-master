import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import PageWrapper from '../components/layout/PageWrapper'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { useAuthStore } from '../store/authStore'
import { getTeamStatistics } from '../api/statistics'

/**
 * Generate shades of primary color
 */
function getPrimaryShades(count) {
  const baseColor = '#0F4C81'
  const shades = []
  for (let i = 0; i < count; i++) {
    const factor = 1 - (i / count) * 0.3
    const r = Math.floor(15 * factor)
    const g = Math.floor(76 * factor)
    const b = Math.floor(129 * factor)
    shades.push(`rgb(${r}, ${g}, ${b})`)
  }
  return shades
}

/**
 * Team Statistics Page
 */
export default function TeamStatisticsPage() {
  const user = useAuthStore((state) => state.user)
  const isInstructor = user?.is_instructor === true
  const [selectedTeamId, setSelectedTeamId] = useState(null)

  // Check authorization
  if (!isInstructor) {
    return (
      <PageWrapper title="Team Statistics">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-danger mb-2">Access Denied</h2>
            <p className="text-gray-600">
              Only instructors can view team statistics.
            </p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const { data, isLoading } = useQuery({
    queryKey: ['teamStatistics', selectedTeamId],
    queryFn: () => getTeamStatistics(selectedTeamId),
  })

  const teamLabels = data?.team_labels || []
  const wsCounts = data?.ws_count || []
  const allTeams = data?.all_teams || []

  // Set default team on first load
  const displayTeamId = selectedTeamId === null && allTeams.length > 0
    ? allTeams[0].id
    : selectedTeamId

  // Update when teamLabels are available
  const isInitialized = displayTeamId !== null && teamLabels.length > 0

  // Prepare chart data
  const chartData = useMemo(() => {
    return teamLabels.map((label, idx) => ({
      name: label,
      count: wsCounts[idx] || 0,
    }))
  }, [teamLabels, wsCounts])

  // Sort by count descending for table
  const sortedMembers = useMemo(
    () =>
      [...chartData]
        .sort((a, b) => b.count - a.count)
        .map((member, idx) => ({
          ...member,
          rank: idx + 1,
        })),
    [chartData]
  )

  const maxCount = Math.max(...wsCounts, 1)
  const shades = getPrimaryShades(chartData.length)

  const currentTeamName = allTeams.find((t) => t.id === (displayTeamId || allTeams[0]?.id))?.name || 'Team'

  return (
    <PageWrapper title="Team Statistics">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          Team Statistics
        </h1>

        {/* Team Selector Tabs */}
        {allTeams.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-3 overflow-x-auto">
            <div className="flex gap-2 min-w-min">
              {allTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    (displayTeamId || allTeams[0]?.id) === team.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentTeamName} Performance
          </h2>

          {isLoading ? (
            <Skeleton.Card className="h-96" />
          ) : chartData.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    formatter={(value, name) => [
                      `${value} workshops`,
                      name === 'count' ? 'Count' : name,
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="count"
                    isAnimationActive={true}
                    animationDuration={800}
                    radius={[8, 8, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={shades[index % shades.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-600">No team data available</p>
            </div>
          )}
        </div>

        {/* Members Table Section */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton.Card key={i} className="h-12" />
            ))}
          </div>
        ) : sortedMembers.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-12">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                      Workshops
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((member, idx) => {
                    const progress = (member.count / maxCount) * 100
                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant={
                              member.rank === 1
                                ? 'info'
                                : member.rank === 2
                                  ? 'info'
                                  : 'default'
                            }
                            size="sm"
                          >
                            #{member.rank}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.count}
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-600">No team data available</p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
