import { MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AgentCardProps {
  id: string;
  name: string;
  status: "available" | "busy" | "offline";
  location: string;
  distance?: string;
  phone?: string;
}

const AgentCard = ({ name, status, location, distance, phone }: AgentCardProps) => {
  const statusConfig = {
    available: { 
      variant: "success" as const, 
      text: "Disponible",
      color: "bg-success" 
    },
    busy: { 
      variant: "warning" as const, 
      text: "En intervention",
      color: "bg-warning" 
    },
    offline: { 
      variant: "destructive" as const, 
      text: "Inactif",
      color: "bg-destructive" 
    },
  };

  const config = statusConfig[status];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="transition-orion hover:shadow-orion">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{name}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            {distance && (
              <p className="text-xs text-muted-foreground mt-0.5">
                À {distance}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={config.variant} className="text-[10px] px-2 py-0.5">
              {config.text}
            </Badge>
            {phone && (
              <button className="text-primary hover:text-primary/80 transition-orion">
                <Phone className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
