"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Building {
  id: string
  name: string
}

interface Assessment {
  buildingId: string
  buildingName: string
  healthScore: number
  predictedLifespan: number
  annualMaintenanceCost: number
  riskLevel: string
}

interface AnalyticsDashboardProps {
  buildings: Building[]
  assessments: Assessment[]
}

export default function AnalyticsDashboard({ buildings, assessments }: AnalyticsDashboardProps) {
  if (assessments.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-blue-100">
        <p className="text-blue-600 text-lg">No assessments yet. Run an assessment to see analytics.</p>
      </Card>
    )
  }

  const avgHealthScore = Math.round(assessments.reduce((sum, a) => sum + a.healthScore, 0) / assessments.length)
  const totalMaintenanceCost = assessments.reduce((sum, a) => sum + a.annualMaintenanceCost, 0)
  const highRiskCount = assessments.filter((a) => a.riskLevel === "High").length

  const healthScoreData = assessments.map((a) => ({
    name: a.buildingName.slice(0, 15),
    score: a.healthScore,
  }))

  const riskDistribution = [
    { name: "Low Risk", value: assessments.filter((a) => a.riskLevel === "Low").length },
    { name: "Medium Risk", value: assessments.filter((a) => a.riskLevel === "Medium").length },
    { name: "High Risk", value: assessments.filter((a) => a.riskLevel === "High").length },
  ].filter((d) => d.value > 0)

  const costData = assessments.map((a) => ({
    name: a.buildingName.slice(0, 15),
    cost: Math.round(a.annualMaintenanceCost),
  }))

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-2">Average Health Score</p>
          <p className="text-4xl font-bold text-blue-900">{avgHealthScore}</p>
        </Card>

        <Card className="p-6 bg-white border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-2">Total Annual Maintenance</p>
          <p className="text-4xl font-bold text-blue-900">${totalMaintenanceCost.toLocaleString()}</p>
        </Card>

        <Card className="p-6 bg-white border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-2">High Risk Buildings</p>
          <p className="text-4xl font-bold text-blue-900">{highRiskCount}</p>
        </Card>
      </div>

      <Card className="p-6 bg-white border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Health Scores by Building</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={healthScoreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={{ fill: "#1e3a8a" }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Annual Maintenance Costs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 bg-white border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-4">All Assessments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="text-left py-3 px-4 font-semibold text-blue-900">Building</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-900">Health Score</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-900">Lifespan</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-900">Annual Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-900">Risk</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.buildingId} className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="py-3 px-4 text-blue-900">{assessment.buildingName}</td>
                  <td className="py-3 px-4 text-blue-900 font-semibold">{assessment.healthScore}</td>
                  <td className="py-3 px-4 text-blue-900">{assessment.predictedLifespan} years</td>
                  <td className="py-3 px-4 text-blue-900">${assessment.annualMaintenanceCost.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        assessment.riskLevel === "Low"
                          ? "bg-green-100 text-green-900"
                          : assessment.riskLevel === "Medium"
                            ? "bg-yellow-100 text-yellow-900"
                            : "bg-red-100 text-red-900"
                      }`}
                    >
                      {assessment.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
