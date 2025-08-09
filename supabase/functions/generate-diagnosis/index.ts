import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, personalityScore }: DiagnosisRequest = await req.json();
    
    console.log('Generating diagnosis for symptoms:', symptoms, 'personality score:', personalityScore);

    const ollamaUrl = Deno.env.get('OLLAMA_API_URL') || 'http://localhost:11434';
    
    // Create a dramatic prompt for Mistral
    const prompt = `You are Dr. Doom, the most pessimistic doctor in the universe. A patient comes to you with these symptoms: ${symptoms.join(', ')}. Their personality assessment score is ${personalityScore}/100 (where 100 is the worst personality).

Based on these symptoms and their terrible personality, diagnose them with the most catastrophic, dramatic, and worst-case scenario disease possible. Be creative and theatrical.

Your response must be EXACTLY in this JSON format (no other text):
{
  "name": "Disease Name",
  "description": "A dramatic, detailed description of this terrible condition",
  "severity": "terminal",
  "prognosis": "A doom-filled prognosis",
  "timeRemaining": "X days/weeks/months",
  "leadsToDeath": true
}

Make the diagnosis worse if their personality score is higher. Be dramatic and over-the-top, but keep it as a medical diagnosis.`;

    // Call Ollama Mistral
    const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          max_tokens: 500
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const ollamaData = await ollamaResponse.json();
    console.log('Raw Ollama response:', ollamaData.response);
    
    let diagnosisData;
    try {
      // Extract JSON from the response
      const jsonMatch = ollamaData.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diagnosisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Ollama response:', parseError);
      // Fallback diagnosis
      diagnosisData = {
        name: "Mysterious Affliction of Doom",
        description: "A rare and terrible condition that defies medical explanation, characterized by an overwhelming sense of impending catastrophe.",
        severity: "terminal",
        prognosis: "Unfortunately, this condition is both mysterious and fatal.",
        timeRemaining: "72 hours",
        leadsToDeath: true
      };
    }

    // Determine afterlife based on personality score and diagnosis severity
    let afterlife: 'heaven' | 'hell' | undefined;
    if (diagnosisData.leadsToDeath) {
      // Worse personality = more likely to go to hell
      // Worse diagnosis = also affects the outcome
      const hellProbability = (personalityScore / 100) * 0.7 + 0.3; // 30-100% chance
      afterlife = Math.random() < hellProbability ? 'hell' : 'heaven';
    }

    const diagnosis: DiagnosisResponse = {
      ...diagnosisData,
      severity: diagnosisData.severity || 'terminal',
      afterlife
    };

    console.log('Final diagnosis:', diagnosis);

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-diagnosis function:', error);
    
    // Return a fallback dramatic diagnosis
    const fallbackDiagnosis: DiagnosisResponse = {
      name: "Catastrophic System Failure Syndrome",
      description: "A devastating condition where all bodily systems begin to shut down in the most dramatic fashion possible. The patient experiences an overwhelming cascade of symptoms that confound even the most experienced physicians.",
      severity: "terminal",
      prognosis: "I'm afraid the prognosis is quite grim. This rare condition has a 100% mortality rate.",
      timeRemaining: "48 hours",
      leadsToDeath: true,
      afterlife: Math.random() > 0.5 ? 'hell' : 'heaven'
    };

    return new Response(JSON.stringify(fallbackDiagnosis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});