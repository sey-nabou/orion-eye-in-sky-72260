import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  name: string;
  status: "available" | "busy" | "offline";
  location: string;
  distance: string;
  phone?: string;
  lat: number;
  lng: number;
  skills: string[];
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  urgency: "urgent" | "medium" | "low";
  status: "pending" | "assigned" | "resolved";
  agent?: string;
  time: string;
  lat: number;
  lng: number;
  source?: "manual" | "camera" | "ai";
  cameraId?: string;
  assignedBy?: "manual" | "ai";
}

const SENEGALESE_LOCATIONS = [
  { name: "Dakar Plateau", lat: 14.6937, lng: -17.4441 },
  { name: "Mbour", lat: 14.4199, lng: -16.9619 },
  { name: "Rufisque", lat: 14.7128, lng: -17.2695 },
  { name: "Thiès", lat: 14.7886, lng: -16.9262 },
  { name: "Kaolack", lat: 14.1522, lng: -16.0725 },
  { name: "Saint-Louis", lat: 16.0183, lng: -16.4897 },
  { name: "Pikine", lat: 14.7549, lng: -17.3964 },
  { name: "Touba", lat: 14.8667, lng: -15.8833 },
];

const INCIDENT_TYPES = [
  { type: "Attroupement suspect", skills: ["sécurité"] },
  { type: "Accident de circulation", skills: ["médical", "sécurité"] },
  { type: "Assistance médicale urgente", skills: ["médical"] },
  { type: "Incident de sécurité", skills: ["sécurité"] },
  { type: "Problème technique", skills: ["technique"] },
  { type: "Contrôle foule", skills: ["sécurité"] },
];

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useAIIncidentManager = (
  initialIncidents: Incident[],
  agents: Agent[],
  autoDetectionEnabled = true
) => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [aiActivity, setAiActivity] = useState<string>("");
  const [aiStats, setAiStats] = useState({
    avgAssignmentTime: 8,
    totalAutoAssignments: 0,
    accuracy: 97,
  });

  const findBestAgent = useCallback((incident: Incident): Agent | null => {
    const availableAgents = agents.filter(a => a.status === "available");
    if (availableAgents.length === 0) return null;

    // Calculer les scores pour chaque agent
    const scoredAgents = availableAgents.map(agent => {
      const distance = calculateDistance(
        incident.lat,
        incident.lng,
        agent.lat,
        agent.lng
      );

      // Vérifier si l'agent a les compétences requises
      const incidentType = INCIDENT_TYPES.find(t => t.type === incident.type);
      const hasSkills = incidentType?.skills.some(skill => 
        agent.skills.includes(skill)
      ) ?? false;

      // Score: distance (70%) + compétences (30%)
      const distanceScore = Math.max(0, 10 - distance) / 10;
      const skillScore = hasSkills ? 1 : 0.3;
      const totalScore = distanceScore * 0.7 + skillScore * 0.3;

      return { agent, distance, score: totalScore };
    });

    // Trier par score décroissant
    scoredAgents.sort((a, b) => b.score - a.score);
    return scoredAgents[0]?.agent ?? null;
  }, [agents]);

  const autoAssignIncident = useCallback((incident: Incident) => {
    setAiActivity("Analyse des positions...");
    
    setTimeout(() => {
      setAiActivity("Calcul de la distance optimale...");
      
      setTimeout(() => {
        setAiActivity("Évaluation des compétences...");
        
        setTimeout(() => {
          const bestAgent = findBestAgent(incident);
          
          if (bestAgent) {
            setAiActivity("Affectation optimale calculée...");
            
            setIncidents(prev => prev.map(inc =>
              inc.id === incident.id
                ? { ...inc, status: "assigned", agent: bestAgent.name, assignedBy: "ai" }
                : inc
            ));

            setAiStats(prev => ({
              ...prev,
              totalAutoAssignments: prev.totalAutoAssignments + 1,
            }));

            toast.success(`Incident affecté automatiquement par IA`, {
              description: `${bestAgent.name} a été affecté à ${incident.location}`,
            });

            setTimeout(() => setAiActivity(""), 2000);
          }
        }, 800);
      }, 800);
    }, 1000);
  }, [findBestAgent]);

  const generateRandomIncident = useCallback((): Incident => {
    const location = SENEGALESE_LOCATIONS[Math.floor(Math.random() * SENEGALESE_LOCATIONS.length)];
    const incidentType = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
    const urgencies: ("urgent" | "medium" | "low")[] = ["urgent", "medium", "low"];
    const cameraId = Math.floor(Math.random() * 20) + 1;

    return {
      id: `ai-${Date.now()}`,
      type: incidentType.type,
      location: location.name,
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      status: "pending",
      time: "À l'instant",
      lat: location.lat + (Math.random() - 0.5) * 0.02,
      lng: location.lng + (Math.random() - 0.5) * 0.02,
      source: "camera",
      cameraId: `CAM-${cameraId}`,
    };
  }, []);

  // Auto-détection d'incidents
  useEffect(() => {
    if (!autoDetectionEnabled) return;

    const interval = setInterval(() => {
      // 30% de chance de détecter un incident toutes les 15 secondes
      if (Math.random() < 0.3) {
        const newIncident = generateRandomIncident();
        
        setIncidents(prev => [newIncident, ...prev]);
        
        toast.info(`🎥 Incident détecté automatiquement par IA`, {
          description: `Source : Caméra #${newIncident.cameraId} - ${newIncident.location}`,
          duration: 5000,
        });

        // Auto-affecter après 2 secondes
        setTimeout(() => {
          autoAssignIncident(newIncident);
        }, 2000);
      }
    }, 15000); // Vérifier toutes les 15 secondes

    return () => clearInterval(interval);
  }, [autoDetectionEnabled, generateRandomIncident, autoAssignIncident]);

  const manualAssign = useCallback((incidentId: string, agentName?: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            status: "assigned", 
            agent: agentName ?? "Agent assigné",
            assignedBy: "manual"
          }
        : incident
    ));
  }, []);

  return {
    incidents,
    setIncidents,
    aiActivity,
    aiStats,
    autoAssignIncident,
    manualAssign,
  };
};
