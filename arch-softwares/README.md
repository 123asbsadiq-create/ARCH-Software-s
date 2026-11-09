# ARCH Softwares website

Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (database, auth, image storage).

## Setup
1. `npm install`
2. Create a free project at supabase.com. In **SQL Editor**, run `supabase/schema.sql`.
3. In **Authentication > Users**, add the admin user (email `123asbsadiq@gmail.com`, strong password). Only this email passes the database admin checks (`is_admin()` in schema.sql; edit it there to change).
4. Copy `.env.example` to `.env.local` and fill in the Project URL and anon key (Project Settings > API).
5. `npm run dev`, open http://localhost:3000. Admin is at `/admin`.

## Deploy (Vercel)
Push to GitHub, import in Vercel, add the three variables from `.env.example`, deploy.

## Security model
All admin writes are enforced by Postgres Row Level Security, not by the browser. Visitors can only read projects, products, site text and approved reviews, and insert enquiries/reviews (reviews start as `pending`). Inputs are length/format checked in the database.

## Not included
Category list is fixed in `lib/supabase.ts`. No email notifications for new enquiries. Add `<img>` optimisation or next/image if you need it. Not yet tested with `npm run build`.
