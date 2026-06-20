"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [env, setEnv] = useState<Record<string, string | boolean>>({})

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

    setEnv({
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      hasRedirect: !!redirectUrl,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseKey?.length || 0,
    })

    console.log("[v0] Supabase URL:", supabaseUrl)
    console.log("[v0] Supabase Key exists:", !!supabaseKey)
    console.log("[v0] Redirect URL:", redirectUrl)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="w-full max-w-md">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Debug Info</CardTitle>
            <CardDescription>Environment variables check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</p>
              <p className={`text-sm ${env.hasUrl ? "text-green-600" : "text-red-600"}`}>
                {env.hasUrl ? `Loaded (${env.urlLength} chars)` : "Missing"}
              </p>
            </div>
            <div>
              <p className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
              <p className={`text-sm ${env.hasKey ? "text-green-600" : "text-red-600"}`}>
                {env.hasKey ? `Loaded (${env.keyLength} chars)` : "Missing"}
              </p>
            </div>
            <div>
              <p className="font-semibold">NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL</p>
              <p className={`text-sm ${env.hasRedirect ? "text-green-600" : "text-yellow-600"}`}>
                {env.hasRedirect ? "Loaded" : "Not configured (optional)"}
              </p>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded text-sm text-blue-900">
              <p>
                If any variables show as Missing, you need to set them in your Vercel project settings or in the sidebar
                Vars section.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
