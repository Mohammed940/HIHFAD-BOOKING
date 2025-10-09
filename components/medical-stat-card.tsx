import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MedicalIcon } from "@/components/ui/medical-icon"
import { ArrowUp, ArrowDown } from "lucide-react"

interface MedicalStatCardProps {
  title: string
  value: string | number
  icon: string
  description?: string
  trend?: "up" | "down"
  trendValue?: string
}

export function MedicalStatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue 
}: MedicalStatCardProps) {
  return (
    <Card className="medical-card hover-lift hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <MedicalIcon 
          name={icon as any} 
          className="h-4 w-4 text-primary" 
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <ArrowUp className={`h-3 w-3 text-green-500`} />
            ) : (
              <ArrowDown className={`h-3 w-3 text-red-500`} />
            )}
            <span className={`text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}