"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2 } from "lucide-react"

interface BuildingFormProps {
  onSubmit: (data: any) => void
}

export default function BuildingForm({ onSubmit }: BuildingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    constructionYear: new Date().getFullYear() - 20,
    squareFootage: 5000,
    constructionType: "Commercial",
    roofCondition: "Good",
    foundationCondition: "Good",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Year") || name.includes("Footage") ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.address) {
      onSubmit(formData)
      setFormData({
        name: "",
        address: "",
        constructionYear: new Date().getFullYear() - 20,
        squareFootage: 5000,
        constructionType: "Commercial",
        roofCondition: "Good",
        foundationCondition: "Good",
      })
    }
  }

  return (
    <Card className="p-6 bg-white border-blue-100 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-900">Add Building</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Building Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Downtown Office Complex"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., 123 Main St"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Construction Year</label>
          <input
            type="number"
            name="constructionYear"
            value={formData.constructionYear}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Square Footage</label>
          <input
            type="number"
            name="squareFootage"
            value={formData.squareFootage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Construction Type</label>
          <select
            name="constructionType"
            value={formData.constructionType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
          >
            <option>Commercial</option>
            <option>Residential</option>
            <option>Industrial</option>
            <option>Mixed-Use</option>
          </select>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Add Building
        </Button>
      </form>
    </Card>
  )
}
