import { Brain, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface AIEngineProps {
  isActive: boolean;
  currentActivity?: string;
  stats?: {
    avgAssignmentTime: number;
    totalAutoAssignments: number;
    accuracy: number;
  };
}

const AIEngine = ({ isActive, currentActivity, stats }: AIEngineProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPulse((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const activities = [
    "Analyse des positions...",
    "Calcul de la distance optimale...",
    "Évaluation des compétences...",
    "Affectation optimale calculée...",
    "Surveillance des caméras en cours...",
  ];

  const [displayActivity, setDisplayActivity] = useState(activities[0]);

  useEffect(() => {
    if (isActive && !currentActivity) {
      const interval = setInterval(() => {
        setDisplayActivity(activities[Math.floor(Math.random() * activities.length)]);
      }, 3000);
      return () => clearInterval(interval);
    } else if (currentActivity) {
      setDisplayActivity(currentActivity);
    }
  }, [isActive, currentActivity]);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 bg-primary/10 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">🧠 ORION AI Engine</h3>
              <p className="text-xs text-muted-foreground">Système d'affectation intelligent</p>
            </div>
          </div>
          <Badge variant={isActive ? "success" : "outline"} className="gap-1">
            {isActive ? (
              <>
                <Activity className="h-3 w-3 animate-pulse" />
                IA Active
              </>
            ) : (
              "Inactif"
            )}
          </Badge>
        </div>

        {isActive && (
          <>
            <div className="bg-card/50 rounded-lg p-3 mb-3 border border-primary/10">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-foreground font-medium">{displayActivity}</span>
              </div>
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-card/30 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-primary">{stats.avgAssignmentTime}s</p>
                  <p className="text-[10px] text-muted-foreground">Temps moyen</p>
                </div>
                <div className="bg-card/30 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-success">{stats.totalAutoAssignments}</p>
                  <p className="text-[10px] text-muted-foreground">Auto-affectations</p>
                </div>
                <div className="bg-card/30 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-primary">{stats.accuracy}%</p>
                  <p className="text-[10px] text-muted-foreground">Précision</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIEngine;
