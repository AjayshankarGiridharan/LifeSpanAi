"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Building2, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AssessmentResults from "./assessment-results"

interface AssessmentClientProps {
  building: {
    id: string
    name: string
    year_built: number
    construction_type: string
    roof_type: string
    foundation_type: string
    hvac_system: string
    electrical_system: string
    plumbing_system: string
    exterior_condition: string
  }
}

interface AssessmentData {
  roof_condition: string
  foundation_condition: string
  interior_condition: string
  system_age_estimate: string
}

interface AssessmentResult {
  predicted_lifespan_years: number
  overall_health_score: number
  maintenance_cost_estimate: number
  risk_level: string
  component_scores: Record<string, number>
  recommendations: string[]
}

export default function AssessmentClient({ building }: AssessmentClientProps) {
  const [assessment, setAssessment] = useState<AssessmentData>({
    roof_condition: "",
    foundation_condition: "",
    interior_condition: "",
    system_age_estimate: "",
  })
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRunAssessment = async () => {
    if (
      !assessment.roof_condition ||
      !assessment.foundation_condition ||
      !assessment.interior_condition ||
      !assessment.system_age_estimate
    ) {
      alert("Please fill in all assessment fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buildingId: building.id,
          buildingData: building,
          assessmentData: assessment,
        }),
      })

      if (!response.ok) throw new Error("Assessment failed")
      const data = await response.json()
      setResults(data.result)
    } catch (error) {
      console.error("Error running assessment:", error)
      alert("Failed to run assessment")
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    return <AssessmentResults building={building} results={results} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">{building.name}</h1>
              <p className="text-blue-700 text-sm">Building Assessment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Building Summary */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Building Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">Year Built:</span> {building.year_built}
                </p>
                <p className="text-blue-600 text-xs">{new Date().getFullYear() - building.year_built} years old</p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">Construction:</span> {building.construction_type}
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">Roof:</span> {building.roof_type}
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">Foundation:</span> {building.foundation_type}
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">HVAC:</span> {building.hvac_system}
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">Electrical:</span> {building.electrical_system}
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-semibold">Plumbing:</span> {building.plumbing_system}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Form */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Run Assessment
              </CardTitle>
              <CardDescription>Provide current condition details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="roof_condition" className="text-blue-900">
                    Roof Condition *
                  </Label>
                  <Select
                    value={assessment.roof_condition}
                    onValueChange={(value) => setAssessment({ ...assessment, roof_condition: value })}
                  >
                    <SelectTrigger id="roof_condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Recently replaced/new</SelectItem>
                      <SelectItem value="good">Good - Minor wear</SelectItem>
                      <SelectItem value="fair">Fair - Some damage/aging</SelectItem>
                      <SelectItem value="poor">Poor - Significant damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="foundation_condition" className="text-blue-900">
                    Foundation Condition *
                  </Label>
                  <Select
                    value={assessment.foundation_condition}
                    onValueChange={(value) => setAssessment({ ...assessment, foundation_condition: value })}
                  >
                    <SelectTrigger id="foundation_condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - No visible issues</SelectItem>
                      <SelectItem value="good">Good - Minor cracks</SelectItem>
                      <SelectItem value="fair">Fair - Some settlement/damage</SelectItem>
                      <SelectItem value="poor">Poor - Significant structural issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="interior_condition" className="text-blue-900">
                    Interior Condition *
                  </Label>
                  <Select
                    value={assessment.interior_condition}
                    onValueChange={(value) => setAssessment({ ...assessment, interior_condition: value })}
                  >
                    <SelectTrigger id="interior_condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Well maintained</SelectItem>
                      <SelectItem value="good">Good - Normal wear</SelectItem>
                      <SelectItem value="fair">Fair - Some repairs needed</SelectItem>
                      <SelectItem value="poor">Poor - Major renovations needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="system_age" className="text-blue-900">
                    System Age Estimate *
                  </Label>
                  <Select
                    value={assessment.system_age_estimate}
                    onValueChange={(value) => setAssessment({ ...assessment, system_age_estimate: value })}
                  >
                    <SelectTrigger id="system_age">
                      <SelectValue placeholder="Select age estimate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New - 0-5 years</SelectItem>
                      <SelectItem value="young">Young - 5-15 years</SelectItem>
                      <SelectItem value="mid">Middle age - 15-30 years</SelectItem>
                      <SelectItem value="old">Old - 30+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleRunAssessment} disabled={loading} className="w-full" size="lg">
                {loading ? "Running Assessment..." : "Generate AI Assessment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
