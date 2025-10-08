import * as React from 'react'
import { 
  Calendar, 
  Clock, 
  Shield, 
  Users, 
  Heart, 
  Stethoscope, 
  Hospital, 
  User, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Unlock,
  Bell,
  Star,
  Share2,
  Copy,
  Printer,
  FileText,
  File,
  Image,
  Video,
  Mic,
  Camera,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryCharging,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  EyeOff,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react'

import { cn } from '@/lib/utils'

const iconMap = {
  calendar: Calendar,
  clock: Clock,
  shield: Shield,
  users: Users,
  heart: Heart,
  stethoscope: Stethoscope,
  hospital: Hospital,
  user: User,
  message: MessageCircle,
  phone: Phone,
  mail: Mail,
  map: MapPin,
  award: Award,
  building: Building,
  check: CheckCircle,
  x: XCircle,
  alert: AlertCircle,
  info: Info,
  plus: Plus,
  search: Search,
  filter: Filter,
  edit: Edit,
  trash: Trash2,
  eye: Eye,
  download: Download,
  upload: Upload,
  settings: Settings,
  logout: LogOut,
  login: LogIn,
  userplus: UserPlus,
  lock: Lock,
  unlock: Unlock,
  bell: Bell,
  star: Star,
  share: Share2,
  copy: Copy,
  printer: Printer,
  filetext: FileText,
  file: File,
  image: Image,
  video: Video,
  mic: Mic,
  camera: Camera,
  wifi: Wifi,
  wifioff: WifiOff,
  bluetooth: Bluetooth,
  battery: Battery,
  batterycharging: BatteryCharging,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  cloudrain: CloudRain,
  cloudsnow: CloudSnow,
  wind: Wind,
  thermometer: Thermometer,
  droplets: Droplets,
  eyeoff: EyeOff,
  eyeicon: EyeIcon,
  eyeofficon: EyeOffIcon
}

interface MedicalIconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof iconMap
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function MedicalIcon({ name, size = 'md', className, ...props }: MedicalIconProps) {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`MedicalIcon: Icon "${name}" not found`)
    return null
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }

  return (
    <IconComponent
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
}

export { MedicalIcon }