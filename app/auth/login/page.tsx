"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Building2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Login attempt with email:", email)
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.log("[v0] Login error:", error)
        throw error
      }
      console.log("[v0] Login successful, user:", data?.user?.email)
      // Wait a moment for session to be established
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push("/dashboard")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred"
      console.log("[v0] Caught error:", message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Building2 className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-900">Lifespan AI</span>
        </div>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Login</CardTitle>
            <CardDescription>Access your building assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-blue-900">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-blue-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-blue-900">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-blue-200"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-blue-700">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="font-semibold hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
