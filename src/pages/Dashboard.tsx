import { useState } from "react";
import { Activity, Users, AlertTriangle, Clock } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import IncidentCard from "@/components/dashboard/IncidentCard";
import AgentCard from "@/components/dashboard/AgentCard";
import MapView from "@/components/dashboard/MapView";
import AIEngine from "@/components/dashboard/AIEngine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useAIIncidentManager, type Agent, type Incident } from "@/hooks/useAIIncidentManager";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Agents avec localisation réelle au Sénégal et compétences
  const agents: Agent[] = [
    { 
      id: "1", 
      name: "Amadou Diallo", 
      status: "available", 
      location: "Dakar Plateau", 
      distance: "1.2 km", 
      phone: "+221 77 123 45 67",
      lat: 14.6937,
      lng: -17.4441,
      skills: ["sécurité", "médical"]
    },
    { 
      id: "2", 
      name: "Mariama Ndiaye", 
      status: "busy", 
      location: "Mbour", 
      distance: "2.5 km",
      lat: 14.4199,
      lng: -16.9619,
      skills: ["médical"]
    },
    { 
      id: "3", 
      name: "Ibrahima Sarr", 
      status: "available", 
      location: "Rufisque", 
      distance: "0.8 km", 
      phone: "+221 76 234 56 78",
      lat: 14.7128,
      lng: -17.2695,
      skills: ["sécurité", "technique"]
    },
    { 
      id: "4", 
      name: "Fatou Sow", 
      status: "available", 
      location: "Thiès", 
      distance: "3.1 km",
      lat: 14.7886,
      lng: -16.9262,
      skills: ["médical", "sécurité"]
    },
    { 
      id: "5", 
      name: "Ousmane Ba", 
      status: "available", 
      location: "Pikine", 
      distance: "1.8 km", 
      phone: "+221 78 345 67 89",
      lat: 14.7549,
      lng: -17.3964,
      skills: ["technique"]
    },
    { 
      id: "6", 
      name: "Awa Diop", 
      status: "available", 
      location: "Kaolack", 
      distance: "4.2 km",
      lat: 14.1522,
      lng: -16.0725,
      skills: ["médical"]
    },
  ];

  // Incidents initiaux avec localisation sénégalaise
  const initialIncidents: Incident[] = [
    { 
      id: "1", 
      type: "Incident de sécurité", 
      location: "Dakar Plateau", 
      urgency: "urgent", 
      status: "pending", 
      time: "Il y a 5 min",
      lat: 14.6937,
      lng: -17.4441,
      source: "manual"
    },
    { 
      id: "2", 
      type: "Assistance médicale urgente", 
      location: "Mbour", 
      urgency: "medium", 
      status: "assigned", 
      agent: "Mariama Ndiaye", 
      time: "Il y a 12 min",
      lat: 14.4199,
      lng: -16.9619,
      source: "manual",
      assignedBy: "manual"
    },
    { 
      id: "3", 
      type: "Problème technique", 
      location: "Rufisque", 
      urgency: "low", 
      status: "pending", 
      time: "Il y a 23 min",
      lat: 14.7128,
      lng: -17.2695,
      source: "manual"
    },
  ];

  const { 
    incidents, 
    aiActivity, 
    aiStats, 
    manualAssign 
  } = useAIIncidentManager(initialIncidents, agents, true);

  const handleAssignAgent = (incidentId: string) => {
    manualAssign(incidentId);
    toast.success("Agent assigné avec succès", {
      description: "L'agent a été notifié de cette intervention.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        {/* AI Engine Status */}
        <AIEngine 
          isActive={true}
          currentActivity={aiActivity}
          stats={aiStats}
        />

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Incidents actifs"
            value="8"
            icon={AlertTriangle}
            trend="+2 aujourd'hui"
            variant="warning"
          />
          <StatsCard
            title="Agents disponibles"
            value={agents.filter(a => a.status === "available").length.toString()}
            icon={Users}
            trend="Disponibles maintenant"
            variant="success"
          />
          <StatsCard
            title="Temps moyen IA"
            value={`${aiStats.avgAssignmentTime}s`}
            icon={Clock}
            trend="Affectation automatique"
            variant="default"
          />
          <StatsCard
            title="Précision IA"
            value={`${aiStats.accuracy}%`}
            icon={Activity}
            trend={`${aiStats.totalAutoAssignments} auto-affectations`}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Map Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">Vue d'ensemble</h2>
              <Button variant="outline" size="sm">
                Actualiser
              </Button>
            </div>
            <div className="h-[600px] w-full">
              <MapView />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="space-y-2">
              <Input
                placeholder="Rechercher incidents, agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Incidents List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold">Incidents récents</h3>
                <Button variant="link" size="sm">Voir tout</Button>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {incidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      {...incident}
                      onAssign={handleAssignAgent}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Agents List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold">Agents à proximité</h3>
                <Button variant="link" size="sm">Voir tout</Button>
              </div>
              <div className="space-y-3">
                {agents.slice(0, 3).map((agent) => (
                  <AgentCard key={agent.id} {...agent} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
