import { Card } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle2, Zap } from "lucide-react"

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

interface ResultsViewProps {
  assessment: Assessment
}

export default function ResultsView({ assessment }: ResultsViewProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-900 border-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-900 border-yellow-300"
      case "High":
        return "bg-red-100 text-red-900 border-red-300"
      default:
        return "bg-blue-100 text-blue-900 border-blue-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-900">{assessment.buildingName}</h2>
          <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getRiskColor(assessment.riskLevel)}`}>
            {assessment.riskLevel} Risk
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-600">Health Score</p>
            </div>
            <p className="text-4xl font-bold text-blue-900">{assessment.healthScore}</p>
            <p className="text-xs text-blue-700 mt-2">Out of 100</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-600">Predicted Lifespan</p>
            </div>
            <p className="text-4xl font-bold text-green-900">{assessment.predictedLifespan}</p>
            <p className="text-xs text-green-700 mt-2">Years remaining</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-orange-600">Annual Cost</p>
            </div>
            <p className="text-4xl font-bold text-orange-900">${assessment.annualMaintenanceCost.toLocaleString()}</p>
            <p className="text-xs text-orange-700 mt-2">Maintenance estimate</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-purple-600">Total Investment</p>
            </div>
            <p className="text-4xl font-bold text-purple-900">
              ${(assessment.annualMaintenanceCost * assessment.predictedLifespan).toLocaleString()}
            </p>
            <p className="text-xs text-purple-700 mt-2">Over lifespan</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {assessment.recommendations.length > 0 ? (
            assessment.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-900">{rec}</p>
              </div>
            ))
          ) : (
            <p className="text-blue-600">No major recommendations at this time</p>
          )}
        </div>
      </Card>
    </div>
  )
}
