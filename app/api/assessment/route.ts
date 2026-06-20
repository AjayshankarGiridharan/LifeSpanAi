import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { buildingId, buildingData, assessmentData } = await request.json()

    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // Create assessment prompt for AI
    const assessmentPrompt = `You are an expert building inspector and AI system for predicting building lifespan and maintenance needs.

Analyze this building data and provide a comprehensive assessment:

Building Information:
- Age: ${new Date().getFullYear() - buildingData.year_built} years (built in ${buildingData.year_built})
- Construction Type: ${buildingData.construction_type}
- Roof Type: ${buildingData.roof_type}
- Foundation: ${buildingData.foundation_type}
- HVAC System: ${buildingData.hvac_system}
- Electrical System: ${buildingData.electrical_system}
- Plumbing System: ${buildingData.plumbing_system}
- Exterior Condition: ${buildingData.exterior_condition}

Current Assessment:
- Roof Condition: ${assessmentData.roof_condition}
- Foundation Condition: ${assessmentData.foundation_condition}
- Interior Condition: ${assessmentData.interior_condition}
- System Age Estimate: ${assessmentData.system_age_estimate}

Provide your analysis in the following JSON format:
{
  "predicted_lifespan_years": <number>,
  "overall_health_score": <0-100>,
  "maintenance_cost_estimate": <annual cost in dollars>,
  "risk_level": "<low|medium|high>",
  "component_scores": {
    "roof": <0-100>,
    "foundation": <0-100>,
    "hvac": <0-100>,
    "electrical": <0-100>,
    "plumbing": <0-100>,
    "interior": <0-100>
  },
  "recommendations": [<list of 5-7 specific, actionable recommendations as strings>]
}

Respond ONLY with valid JSON, no additional text.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: assessmentPrompt,
    })

    const result = JSON.parse(text)

    // Save assessment to database
    const { error: insertError } = await supabase.from("assessment_results").insert({
      building_id: buildingId,
      user_id: userData.user.id,
      predicted_lifespan_years: result.predicted_lifespan_years,
      overall_health_score: result.overall_health_score,
      maintenance_cost_estimate: result.maintenance_cost_estimate,
      risk_level: result.risk_level,
      component_scores: result.component_scores,
      recommendations: result.recommendations,
    })

    if (insertError) {
      console.error("Database insert error:", insertError)
      return new Response(JSON.stringify({ error: "Failed to save assessment" }), { status: 500 })
    }

    return new Response(JSON.stringify({ result }), { status: 200 })
  } catch (error) {
    console.error("Assessment error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate assessment" }), { status: 500 })
  }
}
