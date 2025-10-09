import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MedicalIcon } from "@/components/ui/medical-icon"
import { 
  Calendar, 
  Clock, 
  Users, 
  Building, 
  Stethoscope, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

interface DashboardStat {
  title: string
  value: string | number
  icon: string
  description?: string
  trend?: "up" | "down"
  trendValue?: string
}

interface MedicalDashboardProps {
  stats: DashboardStat[]
  title?: string
  description?: string
}

export function MedicalDashboard({ stats, title, description }: MedicalDashboardProps) {
  return (
    <div className="space-y-6">
      {title && (
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="medical-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <MedicalIcon 
                name={stat.icon as any} 
                className="h-4 w-4 text-primary" 
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
              {stat.trend && stat.trendValue && (
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.trendValue}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}