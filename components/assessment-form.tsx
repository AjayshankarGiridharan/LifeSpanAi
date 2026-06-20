"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

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

interface AssessmentFormProps {
  building: Building
  onSubmit: (assessment: any) => void
}

export default function AssessmentForm({ building, onSubmit }: AssessmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    roofCondition: building.roofCondition,
    foundationCondition: building.foundationCondition,
    hvacCondition: "Good",
    electricalCondition: "Good",
    plumbingCondition: "Good",
    wallsCondition: "Good",
    lastMaintenanceYear: new Date().getFullYear() - 3,
    majorRepairsNeeded: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Year") ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate AI assessment
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Calculate health score based on conditions
    const conditionScores = {
      Excellent: 95,
      Good: 75,
      Fair: 50,
      Poor: 20,
    } as Record<string, number>

    const conditions = [
      formData.roofCondition,
      formData.foundationCondition,
      formData.hvacCondition,
      formData.electricalCondition,
      formData.plumbingCondition,
      formData.wallsCondition,
    ]

    const avgConditionScore =
      conditions.reduce((sum, condition) => sum + conditionScores[condition as keyof typeof conditionScores], 0) /
      conditions.length

    const buildingAge = new Date().getFullYear() - building.constructionYear
    const lifespan = Math.max(30, Math.min(100, 80 - buildingAge / 2 + (avgConditionScore / 100) * 20))

    const annualCost = Math.max(1000, (100 - avgConditionScore) * (building.squareFootage / 1000))

    const assessment = {
      buildingId: building.id,
      buildingName: building.name,
      healthScore: Math.round(avgConditionScore),
      predictedLifespan: Math.round(lifespan),
      annualMaintenanceCost: Math.round(annualCost),
      riskLevel: avgConditionScore > 70 ? "Low" : avgConditionScore > 50 ? "Medium" : "High",
      recommendations: [
        avgConditionScore < 75 && "Schedule immediate roof inspection",
        buildingAge > 30 && "Consider foundational assessment",
        conditionScores[formData.hvacCondition as keyof typeof conditionScores] < 75 && "Update HVAC systems",
        conditionScores[formData.electricalCondition as keyof typeof conditionScores] < 75 &&
          "Upgrade electrical systems",
        conditionScores[formData.plumbingCondition as keyof typeof conditionScores] < 75 && "Replace aging plumbing",
      ].filter((r) => r !== false) as string[],
      timestamp: new Date(),
    }

    setLoading(false)
    onSubmit(assessment)
  }

  return (
    <Card className="p-8 bg-white border-blue-100">
      <h2 className="text-3xl font-bold text-blue-900 mb-2">{building.name}</h2>
      <p className="text-blue-600 mb-8">{building.address}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["roofCondition", "Roof Condition"],
            ["foundationCondition", "Foundation Condition"],
            ["hvacCondition", "HVAC System Condition"],
            ["electricalCondition", "Electrical System Condition"],
            ["plumbingCondition", "Plumbing System Condition"],
            ["wallsCondition", "Walls & Structure Condition"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-blue-900 mb-2">{label}</label>
              <select
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Last Maintenance Year</label>
          <input
            type="number"
            name="lastMaintenanceYear"
            value={formData.lastMaintenanceYear}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running AI Analysis...
            </>
          ) : (
            "Run Assessment"
          )}
        </Button>
      </form>
    </Card>
  )
}
