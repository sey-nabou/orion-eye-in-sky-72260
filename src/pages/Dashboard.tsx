import { useState } from "react";
import { Activity, Users, AlertTriangle, Clock } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import IncidentCard from "@/components/dashboard/IncidentCard";
import AgentCard from "@/components/dashboard/AgentCard";
import MapView from "@/components/dashboard/MapView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const incidents = [
    { id: "1", type: "Incident de sécurité", location: "Stade Lat Dior", urgency: "urgent" as const, status: "pending" as const, time: "Il y a 5 min" },
    { id: "2", type: "Assistance médicale", location: "Zone VIP", urgency: "medium" as const, status: "assigned" as const, agent: "Dr. A. Diallo", time: "Il y a 12 min" },
    { id: "3", type: "Problème technique", location: "Entrée principale", urgency: "low" as const, status: "pending" as const, time: "Il y a 23 min" },
    { id: "4", type: "Contrôle foule", location: "Parking nord", urgency: "urgent" as const, status: "assigned" as const, agent: "M. Ndiaye", time: "Il y a 35 min" },
  ];

  const agents = [
    { id: "1", name: "Amadou Diallo", status: "available" as const, location: "Secteur A", distance: "1.2 km", phone: "+221 XX XXX XX XX" },
    { id: "2", name: "Mariama Ndiaye", status: "busy" as const, location: "Secteur B", distance: "2.5 km" },
    { id: "3", name: "Ibrahima Sarr", status: "available" as const, location: "Secteur C", distance: "0.8 km", phone: "+221 XX XXX XX XX" },
    { id: "4", name: "Fatou Sow", status: "offline" as const, location: "Secteur D", distance: "3.1 km" },
  ];

  const handleAssignAgent = (incidentId: string) => {
    toast.success("Agent assigné avec succès", {
      description: "L'agent a été notifié de cette intervention.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
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
            value="15"
            icon={Users}
            trend="75% de couverture"
            variant="success"
          />
          <StatsCard
            title="Temps moyen"
            value="4:32"
            icon={Clock}
            trend="-12% vs hier"
            variant="default"
          />
          <StatsCard
            title="Taux résolution"
            value="94%"
            icon={Activity}
            trend="+3% ce mois"
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
