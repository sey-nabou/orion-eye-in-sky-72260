import { AlertTriangle, MapPin, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IncidentCardProps {
  id: string;
  type: string;
  location: string;
  urgency: "urgent" | "medium" | "low";
  status: "pending" | "assigned" | "resolved";
  agent?: string;
  time: string;
  onAssign?: (id: string) => void;
}

const IncidentCard = ({ id, type, location, urgency, status, agent, time, onAssign }: IncidentCardProps) => {
  const urgencyVariants = {
    urgent: { variant: "warning" as const, text: "Urgent" },
    medium: { variant: "default" as const, text: "Moyen" },
    low: { variant: "success" as const, text: "Faible" },
  };

  const statusVariants = {
    pending: { variant: "outline" as const, text: "En attente" },
    assigned: { variant: "default" as const, text: "Assigné" },
    resolved: { variant: "success" as const, text: "Résolu" },
  };

  return (
    <Card className="transition-orion hover:shadow-orion animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{type}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{time}</span>
              </div>
            </div>
          </div>
          <Badge variant={urgencyVariants[urgency].variant}>
            {urgencyVariants[urgency].text}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{location}</span>
          </div>
          
          {agent && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{agent}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={statusVariants[status].variant} className="text-xs">
            {statusVariants[status].text}
          </Badge>
          
          {status === "pending" && onAssign && (
            <Button 
              size="sm" 
              variant="gradient"
              onClick={() => onAssign(id)}
            >
              Affecter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
