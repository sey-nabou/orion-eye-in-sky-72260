import { MapPin, Navigation } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Badge } from "@/components/ui/badge";

interface MapMarker {
  id: string;
  type: "agent" | "incident";
  lat: number;
  lng: number;
  status?: "available" | "busy" | "offline" | "urgent" | "medium" | "low";
  label?: string;
}

interface MapViewProps {
  markers?: MapMarker[];
  onMarkerClick?: (id: string) => void;
}

const MapView = ({ markers = [], onMarkerClick }: MapViewProps) => {
  const getMarkerColor = (type: string, status?: string) => {
    if (type === "agent") {
      return status === "available" ? "bg-success" : status === "busy" ? "bg-warning" : "bg-destructive";
    }
    return status === "urgent" ? "bg-warning" : status === "medium" ? "bg-primary" : "bg-success";
  };

  // Mock markers for demo
  const demoMarkers: MapMarker[] = [
    { id: "1", type: "agent", lat: 14.7, lng: -17.4, status: "available", label: "Agent A. Diallo" },
    { id: "2", type: "agent", lat: 14.72, lng: -17.45, status: "busy", label: "Agent M. Ndiaye" },
    { id: "3", type: "incident", lat: 14.68, lng: -17.42, status: "urgent", label: "Incident sécurité" },
    { id: "4", type: "incident", lat: 14.75, lng: -17.38, status: "medium", label: "Assistance médicale" },
  ];

  const displayMarkers = markers.length > 0 ? markers : demoMarkers;

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-orion-lg">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/80 backdrop-blur-sm" />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button className="p-2 bg-card rounded-lg shadow-orion hover:shadow-orion-lg transition-orion">
          <Navigation className="h-5 w-5 text-primary" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur rounded-lg p-3 shadow-orion">
        <h4 className="text-xs font-semibold mb-2">Légende</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span>Agent disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span>En intervention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Incident</span>
          </div>
        </div>
      </div>

      {/* Map Markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {displayMarkers.map((marker, index) => (
            <button
              key={marker.id}
              onClick={() => onMarkerClick?.(marker.id)}
              className="absolute animate-fade-in transition-orion hover:scale-110"
              style={{
                left: `${40 + index * 12}%`,
                top: `${30 + index * 15}%`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative">
                <div className={`h-6 w-6 rounded-full ${getMarkerColor(marker.type, marker.status)} shadow-orion-lg border-2 border-card`}>
                  <MapPin className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className={`absolute inset-0 rounded-full ${getMarkerColor(marker.type, marker.status)} opacity-30 animate-ping-slow`} />
                {marker.label && (
                  <Badge 
                    variant="outline" 
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card/95 backdrop-blur text-xs"
                  >
                    {marker.label}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-card/95 backdrop-blur rounded-lg p-3 shadow-orion">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">12</p>
            <p className="text-xs text-muted-foreground">Agents actifs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">5</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">98%</p>
            <p className="text-xs text-muted-foreground">Couverture</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
