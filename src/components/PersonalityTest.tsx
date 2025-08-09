import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Brain, Zap } from "lucide-react";

interface PersonalityTestProps {
  onNext: (personalityScore: number) => void;
  onBack: () => void;
}

const questions = [
  {
    question: "When you hear about a new disease on the news, you typically:",
    options: [
      { text: "Forget about it immediately", score: 1 },
      { text: "Think about it briefly then move on", score: 3 },
      { text: "Research it online for a few hours", score: 6 },
      { text: "Convince yourself you have all the symptoms", score: 10 }
    ]
  },
  {
    question: "Your approach to medical checkups is:",
    options: [
      { text: "Only when absolutely necessary", score: 1 },
      { text: "Annual routine visits", score: 3 },
      { text: "Every few months just to be safe", score: 6 },
      { text: "Weekly visits with extensive testing demands", score: 10 }
    ]
  },
  {
    question: "When you feel a minor ache or pain, you:",
    options: [
      { text: "Ignore it completely", score: 1 },
      { text: "Monitor it briefly", score: 3 },
      { text: "Google the symptoms extensively", score: 6 },
      { text: "Prepare your last will and testament", score: 10 }
    ]
  },
  {
    question: "Your reaction to medical TV shows is:",
    options: [
      { text: "Entertainment only", score: 1 },
      { text: "Mild interest in the medical aspects", score: 3 },
      { text: "Taking mental notes for self-diagnosis", score: 6 },
      { text: "Furiously scribbling symptoms in a notebook", score: 10 }
    ]
  },
  {
    question: "When friends mention feeling unwell, you:",
    options: [
      { text: "Offer sympathy and move on", score: 1 },
      { text: "Ask basic questions about their health", score: 3 },
      { text: "Analyze if you might have caught something", score: 6 },
      { text: "Immediately quarantine yourself for 2 weeks", score: 10 }
    ]
  }
];

export function PersonalityTest({ onNext, onBack }: PersonalityTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + (selectedOption !== null ? 1 : 0)) / questions.length) * 100;

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate personality score (higher = worse prognosis)
        const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
        onNext(totalScore);
      }
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">Personality Analysis</h2>
            <p className="text-muted-foreground">
              Your psychological profile will determine the <span className="gradient-danger-text font-semibold">severity of your fate</span>
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-secondary" />
              <h3 className="text-xl font-semibold gradient-secondary-text">
                Question {currentQuestion + 1}
              </h3>
            </div>
            <p className="text-lg mb-6 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option.score)}
                  className={`w-full p-4 text-left rounded-lg transition-smooth ${
                    selectedOption === option.score
                      ? 'glass glow-primary border-primary'
                      : 'glass hover:glow-primary hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{option.text}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(option.score / 2.5) }).map((_, i) => (
                        <Zap key={i} className={`w-3 h-3 ${
                          option.score <= 3 ? 'text-success' :
                          option.score <= 6 ? 'text-warning' : 'text-danger'
                        }`} />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Risk Indicator */}
          {selectedOption !== null && (
            <div className="mb-6 animate-slide-up">
              <div className={`glass-card p-4 border ${
                selectedOption <= 3 ? 'border-success/30' :
                selectedOption <= 6 ? 'border-warning/30' : 'border-danger/30'
              }`}>
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${
                    selectedOption <= 3 ? 'text-success' :
                    selectedOption <= 6 ? 'text-warning' : 'text-danger'
                  }`} />
                  <span className="font-semibold">
                    Risk Level: {
                      selectedOption <= 3 ? 'Low' :
                      selectedOption <= 6 ? 'Moderate' : 'CRITICAL'
                    }
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedOption <= 3 
                    ? "Your rational thinking may lead to boring, survivable diagnoses"
                    : selectedOption <= 6
                    ? "Moderate anxiety detected - diagnosis severity increasing"
                    : "MAXIMUM CATASTROPHE MODE ACTIVATED"
                  }
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button
              variant="danger"
              onClick={handleNext}
              disabled={selectedOption === null}
              className="animate-pulse-glow"
            >
              {currentQuestion === questions.length - 1 ? 'Generate Diagnosis' : 'Next Question'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}