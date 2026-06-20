import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building2, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Building2 className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-900">Lifespan AI</span>
        </div>

        <Card className="border-blue-100">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-blue-700 mb-6">
              Please check your email and click the confirmation link to activate your account.
            </p>
            <Link href="/auth/login">
              <Button>Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
