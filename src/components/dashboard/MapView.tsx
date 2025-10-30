import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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
      if (status === "available") return "#10b981";
      if (status === "busy") return "#f59e0b";
      return "#ef4444";
    }
    if (status === "urgent") return "#f59e0b";
    if (status === "medium") return "#3b82f6";
    return "#10b981";
  };

  const createCustomIcon = (type: string, status?: string) => {
    const color = getMarkerColor(type, status);
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 24px;
            height: 24px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          "></div>
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 24px;
            height: 24px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 0.3;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Mock markers for demo - Dakar, Senegal area
  const demoMarkers: MapMarker[] = [
    {
      id: "1",
      type: "agent",
      lat: 14.7167,
      lng: -17.4677,
      status: "available",
      label: "Agent A. Diallo",
    },
    {
      id: "2",
      type: "agent",
      lat: 14.72,
      lng: -17.45,
      status: "busy",
      label: "Agent M. Ndiaye",
    },
    {
      id: "3",
      type: "incident",
      lat: 14.68,
      lng: -17.42,
      status: "urgent",
      label: "Incident sécurité",
    },
    {
      id: "4",
      type: "incident",
      lat: 14.75,
      lng: -17.38,
      status: "medium",
      label: "Assistance médicale",
    },
  ];

  const displayMarkers = useMemo(
    () => (markers.length > 0 ? markers : demoMarkers),
    [markers]
  );

  const center: [number, number] = [14.7167, -17.4677];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing layer
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }

    const group = L.layerGroup();

    displayMarkers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(m.type, m.status),
      });

      marker.on("click", () => onMarkerClick?.(m.id));

      const popupHtml = `
        <div class="p-2">
          <p class="font-semibold text-sm">${m.label ?? ""}</p>
          <span class="mt-1 text-xs inline-block rounded border px-2 py-0.5">${
            m.type === "agent" ? "Agent" : "Incident"
          }</span>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(group);
    });

    group.addTo(map);
    markersLayerRef.current = group;
  }, [displayMarkers, onMarkerClick]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-orion-lg">
      <div ref={containerRef} className="absolute inset-0" />

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
