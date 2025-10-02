# Database Schema Documentation

This document describes the database schema for the Medical Appointment System.

## Tables

### 1. medical_centers

Stores information about medical centers and hospitals.

```sql
CREATE TABLE medical_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. clinics

Stores information about clinics within medical centers.

```sql
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  doctor_name VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. appointments

Manages appointment bookings.

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  center_id UUID REFERENCES medical_centers(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. news

Contains news articles and announcements.

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. admin_roles

Manages admin role assignments.

```sql
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'super_admin', 'center_admin'
  center_id UUID REFERENCES medical_centers(id) ON DELETE CASCADE, -- for center_admin role
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Relationships

1. `clinics.center_id` → `medical_centers.id`
2. `appointments.user_id` → `auth.users.id` (Supabase Auth)
3. `appointments.center_id` → `medical_centers.id`
4. `appointments.clinic_id` → `clinics.id`
5. `admin_roles.user_id` → `auth.users.id` (Supabase Auth)
6. `admin_roles.center_id` → `medical_centers.id` (for center_admin role)

## Row Level Security (RLS)

All tables have Row Level Security enabled with appropriate policies:

- Users can only view/modify their own appointments
- Center admins can view/modify appointments for their center
- Super admins have full access to all data
- Public can view active medical centers and clinics
- Only admins can create/update/delete medical centers, clinics, and news

## Supabase Auth Integration

The system uses Supabase Authentication for user management:
- Users table is managed by Supabase Auth
- Profile information is stored in the `users` table in the `public` schema
- Roles are managed through the `admin_roles` table