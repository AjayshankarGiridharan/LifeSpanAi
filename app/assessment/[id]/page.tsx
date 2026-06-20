import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AssessmentClient from "./assessment-client"

export default async function AssessmentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  // Fetch building data
  const { data: building, error: buildingError } = await supabase
    .from("buildings")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", userData.user.id)
    .single()

  if (buildingError || !building) {
    redirect("/dashboard")
  }

  return <AssessmentClient building={building} />
}
