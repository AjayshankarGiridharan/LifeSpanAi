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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Sign up attempt with email:", email)
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/sign-up-success`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        console.log("[v0] Sign up error:", signUpError)
        throw signUpError
      }

      console.log("[v0] Sign up successful, attempting auto-login")

      // Try to sign in immediately to establish session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.log("[v0] Auto sign in error, redirecting to confirmation:", signInError)
        // If auto sign in fails, show confirmation page
        router.push("/auth/sign-up-success")
      } else {
        console.log("[v0] Auto sign in successful")
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/dashboard")
      }
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
            <CardTitle className="text-2xl text-blue-900">Create Account</CardTitle>
            <CardDescription>Start analyzing your buildings today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-blue-900">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-blue-200"
                  />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="repeatPassword" className="text-blue-900">
                    Repeat Password
                  </Label>
                  <Input
                    id="repeatPassword"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="border-blue-200"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-blue-700">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
