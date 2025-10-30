import { useState } from "react";
import { AlertTriangle, MapPin, Camera, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import orionLogo from "@/assets/orion-logo.png";

const Signalement = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: "security",
    urgency: "medium",
    location: "",
    description: "",
  });

  const incidentTypes = [
    { value: "security", label: "Sécurité", icon: "🛡️" },
    { value: "medical", label: "Médical", icon: "🏥" },
    { value: "technical", label: "Technique", icon: "🔧" },
    { value: "other", label: "Autre", icon: "📋" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitted(true);
    toast.success("Signalement envoyé", {
      description: "Votre signalement a été transmis à l'équipe ORION",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-orion-lg animate-fade-in">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success animate-scale-in" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold">Signalement reçu !</h2>
              <p className="text-muted-foreground">
                Votre signalement a été transmis avec succès à l'équipe ORION.
                Un agent va prendre en charge votre demande dans les plus brefs délais.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-1">
                <p className="font-semibold">Numéro de suivi</p>
                <p className="text-primary font-mono">#ORION-{Date.now().toString().slice(-6)}</p>
              </div>

              <Link to="/">
                <Button variant="gradient" className="w-full" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-warning/5">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="container px-4 py-4">
          <Link to="/" className="flex items-center gap-3 w-fit transition-orion hover:opacity-80">
            <img src={orionLogo} alt="ORION" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold text-primary">ORION</span>
              <span className="text-xs text-muted-foreground">Signaler un incident</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Signaler un incident</h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire ci-dessous pour signaler un incident à l'équipe ORION
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'incident */}
          <Card className="shadow-orion animate-fade-in">
            <CardHeader>
              <CardTitle>Type d'incident</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                className="grid grid-cols-2 gap-3"
              >
                {incidentTypes.map((type) => (
                  <Label
                    key={type.value}
                    htmlFor={type.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-orion ${
                      formData.type === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Urgence */}
          <Card className="shadow-orion animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Niveau d'urgence</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.urgency} 
                onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="urgent"
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-orion ${
                    formData.urgency === "urgent"
                      ? "border-warning bg-warning/5"
                      : "border-border hover:border-warning/50"
                  }`}
                >
                  <RadioGroupItem value="urgent" id="urgent" className="sr-only" />
                  <span className="font-semibold text-warning">⚠️ Urgent</span>
                  <span className="text-xs text-center text-muted-foreground">
                    Intervention immédiate
                  </span>
                </Label>

                <Label
                  htmlFor="medium"
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-orion ${
                    formData.urgency === "medium"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="medium" id="medium" className="sr-only" />
                  <span className="font-semibold text-primary">📍 Non urgent</span>
                  <span className="text-xs text-center text-muted-foreground">
                    Peut attendre
                  </span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card className="shadow-orion animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Ex: Stade Lat Dior - Entrée principale"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10 h-11"
                  required
                />
              </div>
              <Button type="button" variant="outline" size="sm" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Utiliser ma position actuelle
              </Button>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-orion animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Décrivez l'incident en détail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="resize-none"
                required
              />
              <Button type="button" variant="outline" size="sm" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Ajouter une photo
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            className="w-full shadow-orion-lg animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Envoyer le signalement
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Signalement;
