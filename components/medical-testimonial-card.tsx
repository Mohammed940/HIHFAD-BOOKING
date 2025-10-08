import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface MedicalTestimonialCardProps {
  name: string
  role: string
  content: string
  avatar?: string
}

export function MedicalTestimonialCard({ name, role, content, avatar }: MedicalTestimonialCardProps) {
  return (
    <Card className="medical-card hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <Quote className="w-6 h-6 text-primary/20 absolute -top-2 -right-2" />
          <p className="text-muted-foreground leading-relaxed pr-8">
            {content}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}