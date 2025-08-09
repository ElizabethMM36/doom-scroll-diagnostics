import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skull, Heart, Flame, Cloud, ArrowRight, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DiagnosisResultProps {
  symptoms: string[];
  personalityScore: number;
  onRestart: () => void;
}

interface Diagnosis {
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical' | 'terminal';
  prognosis: string;
  timeRemaining?: string;
  leadsToDeath: boolean;
  afterlife?: 'heaven' | 'hell';
}

const diagnoses: Diagnosis[] = [
  {
    name: "Catastrophic Hypochondriacal Syndrome",
    description: "A rare condition where excessive medical anxiety has manifested into physical reality, causing your fears to literally come true.",
    severity: 'terminal',
    prognosis: "Immediate existential crisis followed by digital demise",
    timeRemaining: "3.7 seconds",
    leadsToDeath: true,
    afterlife: 'hell'
  },
  {
    name: "Acute Googleitis with Webmd Complications",
    description: "Terminal condition caused by excessive medical research. Your browser history has achieved sentience and is now controlling your symptoms.",
    severity: 'terminal',
    prognosis: "Death by information overload",
    timeRemaining: "Until next page refresh",
    leadsToDeath: true,
    afterlife: 'heaven'
  },
  {
    name: "Chronic Worry-itis",
    description: "Your anxiety has reached such levels that it's created a feedback loop, generating new symptoms faster than medical science can classify them.",
    severity: 'severe',
    prognosis: "Eternal suffering from imaginary ailments",
    leadsToDeath: false
  },
  {
    name: "Advanced Symptom Multiplication Disorder",
    description: "Each symptom you experience spawns two more, creating an exponential cascade of medical catastrophe.",
    severity: 'severe',
    prognosis: "Infinite suffering from infinite symptoms",
    leadsToDeath: false
  },
  {
    name: "Mild Existential Dread",
    description: "You've realized that life is meaningless and death is inevitable. Congratulations on your enlightenment.",
    severity: 'mild',
    prognosis: "Boring but survivable",
    leadsToDeath: false
  }
];

export function DiagnosisResult({ symptoms, personalityScore, onRestart }: DiagnosisResultProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [showAfterlife, setShowAfterlife] = useState(false);

  useEffect(() => {
    // Simulate analysis process
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            generateDiagnosis();
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const generateDiagnosis = async () => {
    try {
      console.log('Calling Ollama for diagnosis...');
      const { data, error } = await supabase.functions.invoke('generate-diagnosis', {
        body: { symptoms, personalityScore }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Received diagnosis from Ollama:', data);
      setDiagnosis(data as Diagnosis);
      
      if (data.leadsToDeath) {
        setTimeout(() => {
          setShowAfterlife(true);
        }, 3000);
      }
    } catch (error) {
      console.error('Error generating diagnosis:', error);
      
      // Fallback to local diagnosis if Ollama fails
      const symptomSeverity = symptoms.length;
      const totalRisk = personalityScore + symptomSeverity * 2;
      
      let selectedDiagnosis: Diagnosis;
      
      if (totalRisk >= 35) {
        selectedDiagnosis = personalityScore >= 30 ? diagnoses[0] : diagnoses[1];
      } else if (totalRisk >= 20) {
        selectedDiagnosis = diagnoses[2];
      } else if (totalRisk >= 10) {
        selectedDiagnosis = diagnoses[3];
      } else {
        selectedDiagnosis = diagnoses[4];
      }
      
      setDiagnosis(selectedDiagnosis);
      
      if (selectedDiagnosis.leadsToDeath) {
        setTimeout(() => {
          setShowAfterlife(true);
        }, 3000);
      }
    }
  };

  if (showAfterlife && diagnosis?.afterlife) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl animate-slide-up text-center">
          <Card className={`glass-card p-12 border-2 ${
            diagnosis.afterlife === 'heaven' ? 'border-success/50 glow-success' : 'border-danger/50 glow-danger'
          }`}>
            <div className="mb-8">
              {diagnosis.afterlife === 'heaven' ? (
                <Cloud className="w-24 h-24 text-success mx-auto mb-4 animate-float" />
              ) : (
                <Flame className="w-24 h-24 text-danger mx-auto mb-4 animate-float" />
              )}
              
              <h2 className={`text-5xl font-bold mb-4 ${
                diagnosis.afterlife === 'heaven' ? 'text-success' : 'text-danger'
              }`}>
                {diagnosis.afterlife === 'heaven' ? 'HEAVEN' : 'HELL'}
              </h2>
              
              <p className="text-xl text-muted-foreground mb-6">
                {diagnosis.afterlife === 'heaven' 
                  ? "Congratulations! Your hypochondria has been cured through death. You now experience eternal peace without medical anxiety."
                  : "Welcome to eternal medical anxiety! Here, every symptom you ever googled is real and happening simultaneously."
                }
              </p>
            </div>

            <div className="space-y-4">
              <Button variant="success" size="xl" onClick={onRestart}>
                <Activity className="w-5 h-5 mr-2" />
                Return to Life (Restart)
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Try again with different symptoms for alternative fates
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl animate-slide-up">
          <Card className="glass-card p-8 text-center">
            <div className="mb-8">
              <Skull className="w-16 h-16 text-danger mx-auto mb-4 animate-pulse-glow" />
              <h2 className="text-3xl font-bold gradient-danger-text mb-2">ANALYZING...</h2>
              <p className="text-muted-foreground">
                Our AI is calculating your catastrophic destiny
              </p>
            </div>

            <div className="mb-6">
              <Progress value={analysisProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                Cross-referencing {symptoms.length} symptoms with personality profile...
              </p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Consulting WebMD's darkest archives...</p>
              <p>• Amplifying worst-case scenarios...</p>
              <p>• Calculating existential dread coefficient...</p>
              <p>• Preparing final diagnosis...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!diagnosis) return null;

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className={`glass-card p-8 border-2 ${
          diagnosis.severity === 'terminal' ? 'border-danger/50 glow-danger' :
          diagnosis.severity === 'severe' ? 'border-warning/50' :
          'border-success/30'
        }`}>
          <div className="text-center mb-8">
            <div className="mb-4">
              {diagnosis.severity === 'terminal' ? (
                <Skull className="w-16 h-16 text-danger mx-auto animate-pulse-glow" />
              ) : (
                <Heart className="w-16 h-16 text-warning mx-auto" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold gradient-danger-text mb-2">DIAGNOSIS</h2>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              {diagnosis.name}
            </h3>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2 gradient-secondary-text">Description</h4>
              <p className="text-muted-foreground">{diagnosis.description}</p>
            </div>

            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2 gradient-text">Prognosis</h4>
              <p className="text-muted-foreground">{diagnosis.prognosis}</p>
              {diagnosis.timeRemaining && (
                <p className="text-danger font-semibold mt-2">
                  Time Remaining: {diagnosis.timeRemaining}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center glass-card p-4">
              <span className="font-semibold">Severity Level:</span>
              <span className={`font-bold uppercase ${
                diagnosis.severity === 'terminal' ? 'text-danger' :
                diagnosis.severity === 'severe' ? 'text-warning' :
                diagnosis.severity === 'moderate' ? 'text-primary' :
                'text-success'
              }`}>
                {diagnosis.severity}
              </span>
            </div>

            <div className="text-center space-y-4 pt-4">
              {diagnosis.leadsToDeath ? (
                <div className="animate-pulse">
                  <p className="text-danger font-semibold mb-2">
                    TERMINAL DIAGNOSIS CONFIRMED
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Calculating afterlife destination...
                  </p>
                </div>
              ) : (
                <Button variant="primary" size="xl" onClick={onRestart}>
                  <Activity className="w-5 h-5 mr-2" />
                  Try Again (Maybe You'll Die This Time)
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}