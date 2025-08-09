import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { SymptomForm } from "@/components/SymptomForm";
import { PersonalityTest } from "@/components/PersonalityTest";
import { DiagnosisResult } from "@/components/DiagnosisResult";

type Screen = 'landing' | 'symptoms' | 'personality' | 'diagnosis';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(0);
  const [personalityScore, setPersonalityScore] = useState<number>(0);

  const handleStart = () => {
    setCurrentScreen('symptoms');
  };

  const handleSymptomsNext = (selectedSymptoms: string[], selectedSeverity: number) => {
    setSymptoms(selectedSymptoms);
    setSeverity(selectedSeverity);
    setCurrentScreen('personality');
  };

  const handlePersonalityNext = (score: number) => {
    setPersonalityScore(score);
    setCurrentScreen('diagnosis');
  };

  const handleRestart = () => {
    setSymptoms([]);
    setSeverity(0);
    setPersonalityScore(0);
    setCurrentScreen('landing');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'symptoms':
        setCurrentScreen('landing');
        break;
      case 'personality':
        setCurrentScreen('symptoms');
        break;
      case 'diagnosis':
        setCurrentScreen('personality');
        break;
    }
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      
      {currentScreen === 'symptoms' && (
        <SymptomForm onNext={handleSymptomsNext} onBack={handleBack} />
      )}
      
      {currentScreen === 'personality' && (
        <PersonalityTest onNext={handlePersonalityNext} onBack={handleBack} />
      )}
      
      {currentScreen === 'diagnosis' && (
        <DiagnosisResult 
          symptoms={symptoms}
          personalityScore={personalityScore}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
