"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddBuildingFormProps {
  onBuildingAdded: () => void
}

export default function AddBuildingForm({ onBuildingAdded }: AddBuildingFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("buildings").insert({
        user_id: user.id,
        name: formData.get("name"),
        address: formData.get("address"),
        year_built: Number.parseInt(formData.get("year_built") as string),
        square_feet: Number.parseFloat(formData.get("square_feet") as string),
        construction_type: formData.get("construction_type"),
        roof_type: formData.get("roof_type"),
        foundation_type: formData.get("foundation_type"),
        hvac_system: formData.get("hvac_system"),
        electrical_system: formData.get("electrical_system"),
        plumbing_system: formData.get("plumbing_system"),
        exterior_condition: formData.get("exterior_condition"),
        notes: formData.get("notes"),
      })

      if (insertError) throw insertError
      onBuildingAdded()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add building")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-900">Add New Building</CardTitle>
        <CardDescription>Enter your building information for assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Building Name *</Label>
              <Input id="name" name="name" required placeholder="e.g., Main Office Building" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" required placeholder="123 Main St" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year_built">Year Built *</Label>
              <Input id="year_built" name="year_built" type="number" required placeholder="2000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input id="square_feet" name="square_feet" type="number" step="0.01" placeholder="50000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="construction_type">Construction Type *</Label>
              <Select name="construction_type" required>
                <SelectTrigger id="construction_type">
                  <SelectValue placeholder="Select construction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brick">Brick</SelectItem>
                  <SelectItem value="concrete">Concrete</SelectItem>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="mixed">Mixed Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roof_type">Roof Type *</Label>
              <Select name="roof_type" required>
                <SelectTrigger id="roof_type">
                  <SelectValue placeholder="Select roof type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asphalt">Asphalt Shingles</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="tile">Tile</SelectItem>
                  <SelectItem value="flat">Flat/Membrane</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="foundation_type">Foundation Type *</Label>
              <Select name="foundation_type" required>
                <SelectTrigger id="foundation_type">
                  <SelectValue placeholder="Select foundation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concrete_slab">Concrete Slab</SelectItem>
                  <SelectItem value="basement">Basement</SelectItem>
                  <SelectItem value="crawl">Crawl Space</SelectItem>
                  <SelectItem value="piles">Piles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hvac_system">HVAC System</Label>
              <Select name="hvac_system">
                <SelectTrigger id="hvac_system">
                  <SelectValue placeholder="Select HVAC system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central Air</SelectItem>
                  <SelectItem value="units">Individual Units</SelectItem>
                  <SelectItem value="radiant">Radiant</SelectItem>
                  <SelectItem value="none">None/Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="electrical_system">Electrical System</Label>
              <Select name="electrical_system">
                <SelectTrigger id="electrical_system">
                  <SelectValue placeholder="Select electrical system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copper">Copper Wiring</SelectItem>
                  <SelectItem value="aluminum">Aluminum Wiring</SelectItem>
                  <SelectItem value="old_cloth">Cloth/Knob & Tube</SelectItem>
                  <SelectItem value="modern">Modern PVC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plumbing_system">Plumbing System</Label>
              <Select name="plumbing_system">
                <SelectTrigger id="plumbing_system">
                  <SelectValue placeholder="Select plumbing system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copper">Copper</SelectItem>
                  <SelectItem value="pvc">PVC</SelectItem>
                  <SelectItem value="galvanized">Galvanized Steel</SelectItem>
                  <SelectItem value="cast_iron">Cast Iron</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exterior_condition">Exterior Condition *</Label>
              <Select name="exterior_condition" required>
                <SelectTrigger id="exterior_condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any additional information about the building..."
                className="p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Building"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
