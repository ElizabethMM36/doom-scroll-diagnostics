import { useState } from "react";
import { LandingPage } from "../components/LandingPage.tsx";
import { SymptomForm } from "../components/SymptomForm.tsx";
import { PersonalityTest } from "../components/PersonalityTest.tsx";
import { DiagnosisResult } from "../components/DiagnosisResult.tsx";

type Screen = 'landing' | 'symptoms' | 'personality' | 'diagnosis';

// Interface updated: `severity` has been removed.
interface SymptomData {
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [formData, setFormData] = useState<SymptomData | null>(null);
  const [personalityScore, setPersonalityScore] = useState<number>(0);

  const handleStart = () => {
    setCurrentScreen('symptoms');
  };

  const handleSymptomsNext = (data: SymptomData) => {
    setFormData(data);
    setCurrentScreen('personality');
  };

  const handlePersonalityNext = (score: number) => {
    setPersonalityScore(score);
    setCurrentScreen('diagnosis');
  };

  const handleRestart = () => {
    setFormData(null);
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
      
      {currentScreen === 'diagnosis' && formData && (
        // Component call updated: `severity` prop has been removed.
        <DiagnosisResult 
          name={formData.name}
          age={formData.age}
          gender={formData.gender}
          symptoms={formData.symptoms}
          personalityScore={personalityScore}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;