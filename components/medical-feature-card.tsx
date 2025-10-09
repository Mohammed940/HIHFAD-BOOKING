import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MedicalIcon } from "@/components/ui/medical-icon"

interface MedicalFeatureCardProps {
  title: string
  description: string
  icon: string
}

export function MedicalFeatureCard({ title, description, icon }: MedicalFeatureCardProps) {
  return (
    <Card className="medical-card text-center hover-lift hover-glow">
      <CardHeader className="pb-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 hover:scale-110">
          <MedicalIcon 
            name={icon as any} 
            className="w-10 h-10 text-primary" 
          />
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}