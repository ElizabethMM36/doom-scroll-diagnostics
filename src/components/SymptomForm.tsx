import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, X, AlertTriangle } from "lucide-react";

interface SymptomFormProps {
  onNext: (symptoms: string[], severity: number) => void;
  onBack: () => void;
}

const commonSymptoms = [
  "Headache", "Fatigue", "Dizziness", "Nausea", "Chest pain",
  "Shortness of breath", "Fever", "Cough", "Sore throat", "Back pain",
  "Joint pain", "Insomnia", "Anxiety", "Depression", "Memory loss",
  "Blurred vision", "Ringing in ears", "Numbness", "Tremors", "Sweating"
];

export function SymptomForm({ onNext, onBack }: SymptomFormProps) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState(5);

  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom) && symptoms.length < 10) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim()) && symptoms.length < 10) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const handleSubmit = () => {
    if (symptoms.length > 0) {
      onNext(symptoms, severity);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">Symptom Assessment</h2>
            <p className="text-muted-foreground">
              Select your symptoms for our <span className="gradient-danger-text font-semibold">catastrophic analysis</span>
            </p>
          </div>

          {/* Selected Symptoms */}
          {symptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 gradient-secondary-text">Selected Symptoms ({symptoms.length}/10)</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="glass p-2 text-sm">
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="ml-2 text-danger hover:text-danger-glow transition-smooth"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Common Symptoms */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Common Symptoms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonSymptoms.map((symptom, index) => (
                <Button
                  key={index}
                  variant={symptoms.includes(symptom) ? "primary" : "glass"}
                  size="sm"
                  onClick={() => symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                  disabled={!symptoms.includes(symptom) && symptoms.length >= 10}
                  className="text-xs"
                >
                  {symptoms.includes(symptom) ? <X className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Custom Symptom</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a custom symptom..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                disabled={symptoms.length >= 10}
              />
              <Button
                variant="secondary"
                onClick={addCustomSymptom}
                disabled={!customSymptom.trim() || symptoms.length >= 10 || symptoms.includes(customSymptom.trim())}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Severity Slider */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">How severe are your symptoms? ({severity}/10)</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--success)) 0%, hsl(var(--warning)) 50%, hsl(var(--danger)) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
                <span className="gradient-danger-text font-semibold">CRITICAL</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          {symptoms.length > 5 && (
            <div className="glass-card p-4 border border-warning/30 mb-6">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">High Symptom Count Detected</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI is already predicting catastrophic outcomes. Proceed with caution.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button
              variant="danger"
              onClick={handleSubmit}
              disabled={symptoms.length === 0}
              className="animate-pulse-glow"
            >
              Continue to Personality Test
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}