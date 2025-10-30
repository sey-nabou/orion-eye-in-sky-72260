import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [apiKey, setApiKey] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const getMarkerIcon = (type: string, status?: string) => {
    // Define marker colors based on type and status
    if (type === "agent") {
      if (status === "available") return "#10b981"; // green
      if (status === "busy") return "#f59e0b"; // orange
      return "#ef4444"; // red
    }
    if (status === "urgent") return "#f59e0b"; // orange
    if (status === "medium") return "#3b82f6"; // blue
    return "#10b981"; // green
  };

  // Mock markers for demo - Dakar, Senegal area
  const demoMarkers: MapMarker[] = [
    { id: "1", type: "agent", lat: 14.7167, lng: -17.4677, status: "available", label: "Agent A. Diallo" },
    { id: "2", type: "agent", lat: 14.7200, lng: -17.4500, status: "busy", label: "Agent M. Ndiaye" },
    { id: "3", type: "incident", lat: 14.6800, lng: -17.4200, status: "urgent", label: "Incident sécurité" },
    { id: "4", type: "incident", lat: 14.7500, lng: -17.3800, status: "medium", label: "Assistance médicale" },
  ];

  const displayMarkers = markers.length > 0 ? markers : demoMarkers;

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 14.7167,
    lng: -17.4677,
  };

  const handleMarkerClick = useCallback((markerId: string) => {
    setSelectedMarker(markerId);
    onMarkerClick?.(markerId);
  }, [onMarkerClick]);

  if (!apiKey) {
    return (
      <div className="relative h-full w-full rounded-xl overflow-hidden shadow-orion-lg bg-card flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Configuration Google Maps</h3>
            <p className="text-sm text-muted-foreground">
              Pour afficher la carte, veuillez entrer votre clé API Google Maps
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">Clé API Google Maps</Label>
            <Input
              id="apiKey"
              type="text"
              placeholder="Entrez votre clé API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Obtenez votre clé API sur{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-orion-lg">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {displayMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: getMarkerIcon(marker.type, marker.status),
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            >
              {selectedMarker === marker.id && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2">
                    <p className="font-semibold">{marker.label}</p>
                    <Badge variant="outline" className="mt-1">
                      {marker.type === "agent" ? "Agent" : "Incident"}
                    </Badge>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>

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
