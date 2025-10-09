# Medical Appointment System

A comprehensive medical appointment booking system built with Next.js, Supabase, and Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration system
- **Medical Centers**: Browse and search medical centers and hospitals
- **Clinic Management**: View clinics within centers with detailed information
- **Appointment Booking**: Easy appointment scheduling system
- **Appointment Notifications**: Real-time browser notifications for appointment status changes and reminders
- **Admin Panel**: Comprehensive admin dashboard for managing centers, clinics, appointments, and users
- **News Section**: Keep users updated with medical news and announcements
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Storage)
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: Custom CSS animations and transitions
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- pnpm (package manager)
- Supabase account

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd medical-appointment-system
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to see the application.

## Database Setup

The system requires a Supabase database with the following tables:
- `medical_centers` - Stores information about medical centers
- `clinics` - Stores information about clinics within centers
- `appointments` - Manages appointment bookings
- `news` - Contains news articles
- `users` - User profiles (managed by Supabase Auth)
- `admin_roles` - Admin role assignments

Database schema and seed scripts are available in the `scripts/` directory.

## Notification System

The system includes a comprehensive notification system that provides:
- Real-time browser notifications for appointment status changes (approved, rejected, pending)
- Appointment reminders 2 hours before scheduled appointments
- Both visual notifications within the app and system browser notifications

For detailed information about the notification system, see [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md).

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Set the environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Environment Variables for Production

Make sure to set these environment variables in your production environment:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Admin Access

To access the admin panel:
1. Log in with a user account
2. Navigate to `/admin` manually
3. Super admin credentials:
   - Email: mohammed.shaaban940@gmail.com
   - Password: password123456789

Note: Ensure the user has the `super_admin` role in the `admin_roles` table.

## Project Structure

```
app/                    # Next.js app router pages
  admin/                # Admin panel pages
  api/                  # API routes including notification reminders
  auth/                 # Authentication pages
  centers/              # Medical centers pages
  clinics/              # Clinic pages
  news/                 # News pages
components/             # React components
  admin/                # Admin-specific components
  ui/                   # Reusable UI components
hooks/                  # Custom React hooks
lib/                    # Utility functions and Supabase clients
scripts/                # Database setup scripts
styles/                 # Global styles
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.