"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Building2, LogOut, Plus } from "lucide-react"
import BuildingsList from "./buildings-list"
import AddBuildingForm from "./add-building-form"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import AnalyticsDashboard from "./analytics-dashboard"

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshBuildings, setRefreshBuildings] = useState(0)
  const [activeTab, setActiveTab] = useState<"buildings" | "analytics">("buildings")
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleBuildingAdded = () => {
    setRefreshBuildings((prev) => prev + 1)
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("buildings")}
              className={`py-4 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "buildings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-blue-700 hover:text-blue-600"
              }`}
            >
              Buildings
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-4 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-blue-700 hover:text-blue-600"
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === "buildings" ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">Your Buildings</h2>
                <p className="text-blue-700">Welcome back, {user.email}</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)} size="lg" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Building
              </Button>
            </div>

            {showAddForm && (
              <div className="mb-8">
                <AddBuildingForm onBuildingAdded={handleBuildingAdded} />
              </div>
            )}

            <BuildingsList refreshTrigger={refreshBuildings} />
          </>
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  )
}
