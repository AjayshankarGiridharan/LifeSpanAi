"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, AlertTriangle, Building2, DollarSign } from "lucide-react"

interface BuildingAssessment {
  building_name: string
  overall_health_score: number
  risk_level: string
  predicted_lifespan_years: number
  maintenance_cost_estimate: number
}

export default function AnalyticsDashboard() {
  const [assessments, setAssessments] = useState<BuildingAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const { data } = await supabase
        .from("assessment_results")
        .select(
          `
          id,
          building_id,
          overall_health_score,
          risk_level,
          predicted_lifespan_years,
          maintenance_cost_estimate,
          buildings(name)
        `,
        )
        .order("created_at", { ascending: false })

      const formattedData = (data || []).map((item: any) => ({
        building_name: item.buildings?.name || "Unknown Building",
        overall_health_score: item.overall_health_score,
        risk_level: item.risk_level,
        predicted_lifespan_years: item.predicted_lifespan_years,
        maintenance_cost_estimate: item.maintenance_cost_estimate,
      }))

      setAssessments(formattedData)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-blue-600">Loading analytics...</div>
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-blue-100">
        <p className="text-blue-700">No assessments yet. Run an assessment to see analytics.</p>
      </div>
    )
  }

  // Calculate statistics
  const avgHealthScore = (assessments.reduce((sum, a) => sum + a.overall_health_score, 0) / assessments.length).toFixed(
    1,
  )
  const totalMaintenanceCost = assessments.reduce((sum, a) => sum + a.maintenance_cost_estimate, 0).toFixed(0)
  const highRiskCount = assessments.filter((a) => a.risk_level === "high").length
  const avgLifespan = (
    assessments.reduce((sum, a) => sum + a.predicted_lifespan_years, 0) / assessments.length
  ).toFixed(1)

  // Data for risk distribution pie chart
  const riskDistribution = [
    { name: "Low", value: assessments.filter((a) => a.risk_level === "low").length, color: "#10b981" },
    { name: "Medium", value: assessments.filter((a) => a.risk_level === "medium").length, color: "#f59e0b" },
    { name: "High", value: assessments.filter((a) => a.risk_level === "high").length, color: "#ef4444" },
  ]

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Avg Health Score</p>
                <p className="text-3xl font-bold text-blue-900">{avgHealthScore}/100</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Total Annual Maintenance</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${(Number.parseFloat(totalMaintenanceCost) / 1000).toFixed(1)}K
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">High Risk Buildings</p>
                <p className="text-3xl font-bold text-blue-900">{highRiskCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Avg Lifespan</p>
                <p className="text-3xl font-bold text-blue-900">{avgLifespan} yrs</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Score Chart */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Health Score by Building</CardTitle>
            <CardDescription>Overall health assessment of all buildings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="building_name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="overall_health_score" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Risk Distribution</CardTitle>
            <CardDescription>Portfolio risk breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Cost Trend */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Maintenance Cost Estimates</CardTitle>
          <CardDescription>Annual maintenance budget by building</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={assessments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="building_name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="maintenance_cost_estimate"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">All Assessments</CardTitle>
          <CardDescription>Detailed view of all building assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-blue-200 bg-blue-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-blue-900">Building</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-900">Health Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-900">Risk Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-900">Lifespan</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-900">Annual Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment, idx) => (
                  <tr key={idx} className="border-b border-blue-100 hover:bg-blue-50">
                    <td className="py-3 px-4 text-blue-900">{assessment.building_name}</td>
                    <td className="py-3 px-4 text-blue-700">{assessment.overall_health_score.toFixed(1)}/100</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          assessment.risk_level === "low"
                            ? "bg-green-100 text-green-800"
                            : assessment.risk_level === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assessment.risk_level.charAt(0).toUpperCase() + assessment.risk_level.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-700">{assessment.predicted_lifespan_years} years</td>
                    <td className="py-3 px-4 text-blue-900 font-semibold">
                      ${(assessment.maintenance_cost_estimate / 1000).toFixed(1)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
