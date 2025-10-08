# Deployment Guide

This guide explains how to deploy the Medical Appointment System to Vercel and Supabase.

## Prerequisites

1. GitHub account
2. Vercel account
3. Supabase account
4. Domain name (optional)

## Step 1: Prepare Your Code for GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub
3. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com/)
2. Run the database setup scripts:
   - Go to the SQL Editor in your Supabase project
   - Run the scripts in the `migrations/` directory in numerical order:
     1. `001_create_database_schema.sql`
     2. `002_seed_sample_data.sql`
     3. `003_create_super_admin.sql`
     4. `004_add_fixed_time_slots.sql`
     5. `005_add_use_fixed_time_slots_to_clinics.sql`
     6. `006_fix_admin_rls.sql`
     7. `007_fix_appointments_rls.sql`
     8. `008_add_patient_info_to_appointments.sql`

3. Configure authentication:
   - Go to Authentication > Settings
   - Enable Email signup
   - Add your domain to the authorized redirect URLs

## Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `pnpm build`
   - Output Directory: `.next`

5. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

6. Click "Deploy"

## Step 4: Configure Supabase for Production

1. In your Supabase project, go to Settings > API
2. Add your Vercel deployment URL to the CORS settings:
   - `https://your-project.vercel.app`
   - `https://your-domain.com` (if you have a custom domain)

3. Add the same URLs to the authorized redirect URLs in Authentication settings

## Step 5: Set Up Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Step 6: Configure Admin Access

1. After deployment, sign up with the super admin credentials:
   - Email: mohammed.shaaban940@gmail.com
   - Password: password123456789

2. Access the admin panel at `https://your-domain.com/admin`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are set in Vercel

2. **Database Connection Issues**
   - Check that your Supabase credentials are correct
   - Verify that your Vercel deployment URL is added to Supabase CORS settings

3. **Admin Access Denied**
   - Ensure the super admin user exists in the `auth.users` table
   - Verify the user has the `super_admin` role in the `admin_roles` table

### Checking Logs

1. Vercel logs:
   - Go to your Vercel project dashboard
   - Click "Logs" to view deployment and runtime logs

2. Supabase logs:
   - Go to your Supabase project dashboard
   - Check the database logs in the SQL editor
   - Check authentication logs in the Authentication section

## Updating Your Deployment

To update your deployed application:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. Vercel will automatically deploy the new changes

## Monitoring

1. Set up monitoring in Vercel:
   - Enable performance monitoring
   - Set up alerts for errors

2. Set up monitoring in Supabase:
   - Monitor database performance
   - Set up alerts for usage limits