"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, TrendingUp, Shield, Clock, Plus, BarChart3 } from "lucide-react"
import BuildingForm from "@/components/building-form"
import AssessmentForm from "@/components/assessment-form"
import ResultsView from "@/components/results-view"
import AnalyticsDashboard from "@/components/analytics-dashboard"

interface Building {
  id: string
  name: string
  address: string
  constructionYear: number
  squareFootage: number
  constructionType: string
  roofCondition: string
  foundationCondition: string
}

interface Assessment {
  buildingId: string
  buildingName: string
  healthScore: number
  predictedLifespan: number
  annualMaintenanceCost: number
  riskLevel: string
  recommendations: string[]
  timestamp: Date
}

export default function Home() {
  const [view, setView] = useState<"landing" | "buildings" | "assessment" | "results" | "analytics">("landing")
  const [buildings, setBuildings] = useState<Building[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null)

  const handleAddBuilding = (building: Building) => {
    const newBuilding = {
      ...building,
      id: Date.now().toString(),
    }
    setBuildings([...buildings, newBuilding])
    setView("buildings")
  }

  const handleRunAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment)
    setAssessments([...assessments, assessment])
    setView("results")
  }

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building)
    setView("assessment")
  }

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">Lifespan AI</span>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="px-6 py-20 md:px-12 md:py-32">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 text-balance">
              Predict Your Building's Lifespan with AI
            </h1>
            <p className="text-xl text-blue-700 mb-8 text-balance">
              Get accurate predictions about building health, maintenance needs, and cost estimates using advanced
              artificial intelligence.
            </p>
            <Button size="lg" className="text-lg" onClick={() => setView("buildings")}>
              Start Analysis
            </Button>
          </div>

          {/* Features Grid */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Accurate Predictions</h3>
              <p className="text-sm text-blue-700">AI-powered analysis of building materials and condition</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Maintenance Planning</h3>
              <p className="text-sm text-blue-700">Create detailed schedules and track maintenance tasks</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <Shield className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Risk Assessment</h3>
              <p className="text-sm text-blue-700">Identify potential risks and get actionable recommendations</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <Building2 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Multiple Buildings</h3>
              <p className="text-sm text-blue-700">Manage and analyze data for all your properties</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (view === "buildings") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Buildings</h1>
              <p className="text-blue-700">Manage and analyze your properties</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setView("landing")}>
                Home
              </Button>
              <Button onClick={() => setView("analytics")} disabled={assessments.length === 0}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button onClick={() => setView("analytics")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Building
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Add Building Form */}
            <div className="md:col-span-1">
              <BuildingForm onSubmit={handleAddBuilding} />
            </div>

            {/* Buildings List */}
            <div className="md:col-span-2">
              {buildings.length === 0 ? (
                <Card className="p-12 text-center bg-white border-blue-100">
                  <Building2 className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No buildings yet</h3>
                  <p className="text-blue-600">Add your first building to get started with AI analysis</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {buildings.map((building) => (
                    <Card
                      key={building.id}
                      className="p-6 bg-white border-blue-100 hover:border-blue-300 cursor-pointer transition-colors"
                      onClick={() => handleSelectBuilding(building)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-blue-900 mb-2">{building.name}</h3>
                          <p className="text-blue-600 mb-4">{building.address}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700">Construction Year:</span>
                              <p className="font-medium text-blue-900">{building.constructionYear}</p>
                            </div>
                            <div>
                              <span className="text-blue-700">Square Footage:</span>
                              <p className="font-medium text-blue-900">
                                {building.squareFootage.toLocaleString()} sqft
                              </p>
                            </div>
                            <div>
                              <span className="text-blue-700">Type:</span>
                              <p className="font-medium text-blue-900">{building.constructionType}</p>
                            </div>
                            <div>
                              <span className="text-blue-700">Age:</span>
                              <p className="font-medium text-blue-900">
                                {new Date().getFullYear() - building.constructionYear} years
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectBuilding(building)
                          }}
                        >
                          Run Assessment
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === "assessment" && selectedBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setView("buildings")}>
              ← Back to Buildings
            </Button>
          </div>
          <AssessmentForm building={selectedBuilding} onSubmit={handleRunAssessment} />
        </div>
      </div>
    )
  }

  if (view === "results" && currentAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-8">
            <Button variant="ghost" onClick={() => setView("buildings")}>
              ← Back to Buildings
            </Button>
            <Button variant="outline" onClick={() => setView("analytics")}>
              View All Assessments
            </Button>
          </div>
          <ResultsView assessment={currentAssessment} />
        </div>
      </div>
    )
  }

  if (view === "analytics") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-8">
            <Button variant="ghost" onClick={() => setView("buildings")}>
              ← Back to Buildings
            </Button>
          </div>
          <AnalyticsDashboard buildings={buildings} assessments={assessments} />
        </div>
      </div>
    )
  }

  return null
}
