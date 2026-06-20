"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Building {
  id: string
  name: string
  address: string
  year_built: number
  construction_type: string
  exterior_condition: string
}

interface BuildingsListProps {
  refreshTrigger: number
}

export default function BuildingsList({ refreshTrigger }: BuildingsListProps) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadBuildings()
  }, [refreshTrigger])

  const loadBuildings = async () => {
    try {
      setLoading(true)
      const { data } = await supabase.from("buildings").select("*")
      setBuildings(data || [])
    } catch (error) {
      console.error("Error loading buildings:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-blue-600">Loading buildings...</p>
      </div>
    )
  }

  if (buildings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-blue-100">
        <p className="text-blue-700 mb-4">No buildings added yet. Create your first building assessment!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {buildings.map((building) => (
        <Card key={building.id} className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-blue-900 text-lg">{building.name}</CardTitle>
            <CardDescription>{building.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4 text-sm">
              <p className="text-blue-700">
                <span className="font-semibold">Built:</span> {building.year_built}
              </p>
              <p className="text-blue-700">
                <span className="font-semibold">Type:</span> {building.construction_type}
              </p>
              <p className="text-blue-700">
                <span className="font-semibold">Condition:</span> {building.exterior_condition}
              </p>
            </div>
            <Link href={`/assessment/${building.id}`}>
              <Button className="w-full flex items-center justify-center gap-2">
                Run Assessment
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
