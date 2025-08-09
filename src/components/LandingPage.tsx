import { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Activity, Brain, Heart, Skull } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Floating medical icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Activity className="absolute top-20 left-20 w-8 h-8 text-primary/30 animate-float" />
        <Brain className="absolute top-32 right-32 w-6 h-6 text-secondary/30 animate-float" style={{ animationDelay: '1s' }} />
        <Heart className="absolute bottom-40 left-40 w-7 h-7 text-danger/30 animate-float" style={{ animationDelay: '2s' }} />
        <Skull className="absolute bottom-20 right-20 w-9 h-9 text-warning/30 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-4xl animate-slide-up">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="gradient-text">DR.</span>
              <span className="gradient-danger-text">STRANGE</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-danger mx-auto mb-6"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
            Experience the <span className="gradient-secondary-text font-semibold">ultimate medical anxiety</span> with our 
            state-of-the-art diagnostic system
          </p>
          
          <p className="text-lg text-muted-foreground mb-8">
            Combining your symptoms with personality analysis to deliver the most 
            <span className="gradient-danger-text font-semibold"> catastrophic diagnosis possible</span>
          </p>

          {/* Warning Notice */}
          <div className="glass-card mb-8 p-6 border border-warning/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Skull className="w-5 h-5 text-warning" />
              <span className="text-warning font-semibold">WARNING</span>
              <Skull className="w-5 h-5 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">
              This application may result in existential dread, hypochondriacal episodes, 
              or in extreme cases, <span className="text-danger">digital demise</span> leading to either 
              <span className="text-success">eternal bliss</span> or <span className="text-danger">eternal suffering</span>
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              variant="danger"
              size="xl"
              onClick={onStart}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`font-semibold animate-pulse-glow ${isHovered ? 'animate-bounce' : ''}`}
            >
              <Activity className="w-5 h-5" />
              BEGIN DIAGNOSIS
              <Skull className="w-5 h-5" />
            </Button>
            
            <p className="text-xs text-muted-foreground">
              By clicking above, you accept full responsibility for your impending doom
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-4">
              <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="gradient-text font-semibold mb-1">Personality Analysis</h3>
              <p className="text-sm text-muted-foreground">Your psychological profile determines diagnosis severity</p>
            </div>
            
            <div className="glass-card p-4">
              <Activity className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="gradient-secondary-text font-semibold mb-1">Symptom Amplification</h3>
              <p className="text-sm text-muted-foreground">Advanced algorithms ensure worst-case scenarios</p>
            </div>
            
            <div className="glass-card p-4">
              <Skull className="w-8 h-8 text-danger mx-auto mb-2" />
              <h3 className="gradient-danger-text font-semibold mb-1">Afterlife Assignment</h3>
              <p className="text-sm text-muted-foreground">Terminal diagnoses include eternal destination</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}