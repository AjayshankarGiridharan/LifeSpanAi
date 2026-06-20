"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, TrendingUp, DollarSign, Clock } from "lucide-react"

interface AssessmentResultsProps {
  building: {
    id: string
    name: string
  }
  results: {
    predicted_lifespan_years: number
    overall_health_score: number
    maintenance_cost_estimate: number
    risk_level: string
    component_scores: Record<string, number>
    recommendations: string[]
  }
}

export default function AssessmentResults({ building, results }: AssessmentResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-blue-900">{building.name} - Assessment Results</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Health Score</p>
                  <p className="text-3xl font-bold text-blue-900">{results.overall_health_score.toFixed(1)}/100</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Predicted Lifespan</p>
                  <p className="text-3xl font-bold text-blue-900">{results.predicted_lifespan_years} years</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Annual Maintenance</p>
                  <p className="text-3xl font-bold text-blue-900">
                    ${(results.maintenance_cost_estimate / 1000).toFixed(1)}K
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${getRiskColor(results.risk_level)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1">Risk Level</p>
                  <p className="text-2xl font-bold capitalize">{results.risk_level}</p>
                </div>
                <AlertTriangle className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Scores */}
        <Card className="border-blue-100 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-900">Component Health Scores</CardTitle>
            <CardDescription>Individual assessment of building systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(results.component_scores).map(([component, score]) => (
                <div key={component}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-900 capitalize">{component.replace(/_/g, " ")}</span>
                    <span className="text-blue-700 font-semibold">{score.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">AI Recommendations</CardTitle>
            <CardDescription>Priority maintenance and improvement suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-blue-700">
                  <span className="font-bold text-blue-600 mt-1">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/dashboard?tab=analytics">
            <Button>View Analytics</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
