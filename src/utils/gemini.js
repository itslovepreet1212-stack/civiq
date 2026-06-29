import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const MODEL = "gemini-2.0-flash";

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGemini(systemPrompt, imageFile) {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const parts = [{ text: systemPrompt }];
  if (imageFile) {
    const base64 = await fileToBase64(imageFile);
    parts.push({
      inlineData: { mimeType: imageFile.type, data: base64 },
    });
  }
  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  return result.response.text();
}

export async function analyzeImage(file) {
  try {
    const text = await callGemini(
      `You are an AI for a civic issue platform in India.
Analyze this image of a public area problem.
Return ONLY valid JSON — no markdown, no explanation:
{
  "category": one of ["Pothole","Garbage","Broken Streetlight","Water Leakage","Open Drain","Damaged Road","Other"],
  "severity": integer 1-10,
  "description": "2-3 sentence impact description",
  "suggested_department": "responsible Indian municipal department",
  "materials_needed": "List of 1-3 specific materials to fix this (e.g. '2 bags of cold-mix asphalt, 1 tamper')",
  "estimated_cost": "Cost estimate in INR (e.g. '₹2,500 - ₹4,000')",
  "estimated_time": "Time estimate (e.g. '2-4 hours')",
  "butterfly_effect": "1 highly specific, dramatic sentence predicting the cascading negative consequences if THIS EXACT visual issue is ignored. Must strictly relate to the specific objects, surroundings, and hazards visible in the photo."
}`,
      file
    );
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    if (err.message?.includes("RATE_LIMIT") || err.message?.includes("429") || err.status === 429) {
      console.warn("Gemini Rate Limit hit, returning mock analysis data.");
      return {
        category: "Pothole",
        severity: 7,
        description: "The road has a large pothole creating a severe hazard for two-wheelers and cars.",
        suggested_department: "Public Works Department",
        materials_needed: "2 bags of cold-mix asphalt, 1 tamper",
        estimated_cost: "₹2,500 - ₹4,000",
        estimated_time: "2-4 hours",
        butterfly_effect: "If ignored during the upcoming monsoon, this will cause localized flooding and expand into a major structural failure."
      };
    }
    throw err;
  }
}

export async function generateComplaintLetter(issue) {
  try {
    const text = await callGemini(
      `Write a formal complaint letter to ${issue.department || "Municipal Corporation"} about:
Issue: ${issue.title}
Location: ${issue.location}
Description: ${issue.description}
Severity: ${issue.severity}/10
Community confirmations: ${issue.upvotes}
Format: Subject line, Salutation, body 150-200 words, sign as "Concerned Citizens via Civiq Platform".
Return only the letter text.`
    );
    return text.trim();
  } catch (err) {
    if (err.message?.includes("RATE_LIMIT") || err.message?.includes("429") || err.status === 429) {
      console.warn("Gemini Rate Limit hit, returning mock letter.");
      return `Subject: Urgent Complaint Regarding ${issue.title} at ${issue.location}\n\nRespected Sir/Madam,\n\nWe, the concerned citizens of the area, wish to bring to your attention a severe issue regarding ${issue.title} located at ${issue.location}. This problem has reached a severity level of ${issue.severity}/10 and is causing significant distress to the residents.\n\nThe issue has already been verified and confirmed by ${issue.upvotes} community members on the Civiq platform. We kindly request immediate intervention from the ${issue.department || "Municipal Corporation"} to resolve this civic hazard as soon as possible to ensure public safety.\n\nThank you for your prompt attention to this matter.\n\nYours faithfully,\nConcerned Citizens via Civiq Platform`;
    }
    throw err;
  }
}

export async function generateCityInsights(issues) {
  try {
    const summary = issues
      .map((i) => `${i.category} at ${i.location} (Severity: ${i.severity}, Status: ${i.status})`)
      .join("\n");
    const text = await callGemini(
      `You are a smart city analyst. Analyze these civic reports:
${summary}
Return ONLY valid JSON:
{
  "most_urgent_area": "location with worst issues",
  "top_pattern": "key trend in one sentence",
  "hotspot_category": "most reported issue type",
  "recommendation": "2-3 action sentences for authorities",
  "prediction": "what could worsen if unaddressed"
}`
    );
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    if (err.message?.includes("RATE_LIMIT") || err.message?.includes("429") || err.status === 429) {
      console.warn("Gemini Rate Limit hit, returning mock insights.");
      return {
        most_urgent_area: "Sector 14 / Downtown (Mock)",
        top_pattern: "Concentrated road infrastructure decay following recent monsoons.",
        hotspot_category: "Pothole",
        recommendation: "Deploy immediate patching teams to high-severity nodes. Schedule comprehensive drainage audit.",
        prediction: "If unaddressed, minor potholes will expand into major structural failures."
      };
    }
    throw err;
  }
}

export async function verifyResolution(issue, file) {
  try {
    const text = await callGemini(
      `You are an AI inspector for a civic platform. 
An issue was previously reported as: "${issue.title}" (Category: ${issue.category}, Description: ${issue.description}).
A user has uploaded a new photo claiming this issue is now FIXED/RESOLVED.
Analyze this new photo. Is the issue actually resolved?
Return ONLY valid JSON:
{
  "verified": boolean,
  "reason": "1 sentence explaining why it is verified or rejected based on visual evidence"
}`,
      file
    );
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    if (err.message?.includes("RATE_LIMIT") || err.message?.includes("429") || err.status === 429) {
      console.warn("Gemini Rate Limit hit — manual confirmation needed.");
      return {
        verified: false,
        reason: "AI analysis is temporarily unavailable due to high demand. You can confirm the resolution manually.",
        _fallback: true
      };
    }
    throw err;
  }
}
