import { serve } from "https://deno.land/std@0.224.0/http/server.ts"; // Updated to a more recent version

// --- Interfaces (These are correct and match the frontend) ---
interface DiagnosisRequest {
  symptoms: string[];
  personalityScore: number;
}

interface DiagnosisResponse {
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical' | 'terminal';
  prognosis: string;
  timeRemaining?: string;
  leadsToDeath: boolean;
  afterlife?: 'heaven' | 'hell';
}

// --- CORS Headers (Correct) ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Server Logic ---
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, personalityScore }: DiagnosisRequest = await req.json();
    
    // --- Gemini API Setup ---
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }
    
    // Using a newer, faster model. gemini-pro works too.
    const model = "gemini-1.5-flash-latest"; 
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiApiKey}`;

    // --- **CRITICAL CHANGE**: Updated Dynamic Prompt ---
    // This prompt now asks the AI to decide the severity based on the inputs.
    const prompt = `
      You are a darkly humorous AI that generates fake, absurd, and catastrophic medical diagnoses.
      A user has provided the following information:
      - Symptoms: ${symptoms.join(", ")}
      - Personality Score (out of 50, higher is more anxious): ${personalityScore}

      Based on this, invent a creative, funny, and overly dramatic diagnosis.
      
      - If the personality score is high (30+) OR there are many symptoms (4+), the diagnosis should be more severe ('severe' or 'terminal').
      - Otherwise, generate a 'mild' or 'moderate' diagnosis.
      - A 'terminal' diagnosis MUST have "leadsToDeath": true. Other severities MUST have "leadsToDeath": false.

      Your response MUST be a valid JSON object with NO other text or markdown.
      The JSON object must conform to this exact structure:
      {
        "name": "string",
        "description": "string",
        "severity": "'mild' | 'moderate' | 'severe' | 'terminal'",
        "prognosis": "string",
        "timeRemaining": "string (can be null if not terminal)",
        "leadsToDeath": boolean,
        "afterlife": "'heaven' | 'hell' (must be null if leadsToDeath is false)"
      }
    `;

    // --- **IMPROVEMENT**: More Reliable API Call ---
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // This setting forces Gemini to output clean JSON, which is much more reliable.
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorBody}`);
    }

    const geminiData = await geminiResponse.json();

    // --- **IMPROVEMENT**: More Robust Error Handling ---
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('Gemini returned no candidates. Response:', geminiData);
      throw new Error('Invalid response from Gemini: No candidates found.');
    }
    
    // Since we requested JSON, we can parse it directly and with more confidence.
    const diagnosisData: DiagnosisResponse = JSON.parse(geminiData.candidates[0].content.parts[0].text);

    // Your afterlife logic is creative and can remain the same.
    // We just need to ensure it's only applied if the AI decided the diagnosis is fatal.
    if (diagnosisData.leadsToDeath) {
        const hellProbability = (personalityScore / 50) * 0.6 + 0.2; // 20-80% chance
        diagnosisData.afterlife = Math.random() < hellProbability ? 'hell' : 'heaven';
    }

    return new Response(JSON.stringify(diagnosisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handler:', error);
    
    // This fallback is good to keep for unexpected errors.
    const fallbackDiagnosis: DiagnosisResponse = {
      name: "Catastrophic System Failure",
      description: "A devastating condition where all systems begin to shut down due to an unexpected server error. The AI physician is currently indisposed.",
      severity: "critical",
      prognosis: "Uncertain. Please try again later.",
      leadsToDeath: false, // Make fallback non-lethal so user can retry
    };

    return new Response(JSON.stringify(fallbackDiagnosis), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});