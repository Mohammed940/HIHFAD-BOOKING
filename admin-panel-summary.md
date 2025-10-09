# Admin Panel Summary

## Structure

The admin panel consists of:
1. **Layout** (`app/admin/layout.tsx`) - Contains the sidebar and requires super admin authentication
2. **Main Dashboard** (`app/admin/page.tsx`) - Shows statistics and overview
3. **Sidebar** (`components/admin/admin-sidebar.tsx`) - Navigation menu

## Authentication Flow

1. **Layout Level Protection** (`app/admin/layout.tsx`)
   ```typescript
   await requireSuperAdmin()
   ```
   This calls the `requireSuperAdmin()` function which:
   - Verifies user is authenticated
   - Checks if user has `super_admin` role in `admin_roles` table
   - Redirects to home page if not authorized

2. **Dashboard Content** (`app/admin/page.tsx`)
   - Displays statistics cards for medical centers, clinics, appointments, and users
   - Shows recent appointments
   - Shows pending appointments alert

## Navigation Menu

The sidebar contains links to:
- Dashboard (/admin)
- Medical Centers (/admin/centers)
- Clinics (/admin/clinics)
- Appointments (/admin/appointments)
- Users (/admin/users)
- News (/admin/news)
- Settings (/admin/settings)

## Access Requirements

To access the admin panel:
1. User must be authenticated
2. User must have `super_admin` role in the `admin_roles` table
3. User must navigate manually to `/admin` after login (no automatic redirect)

## Common Issues

### RLS Recursion Problem
The Row Level Security policy on `admin_roles` table can cause:
```
"infinite recursion detected in policy for relation admin_roles"
```

**Solution:**
```sql
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;
```

### Manual Navigation Required
The login page redirects to home page, not admin dashboard.

**Solution:**
After logging in, manually navigate to `http://localhost:3001/admin`

## Credentials
- Email: mohammed.shaaban940@gmail.com
- Password: password123456789