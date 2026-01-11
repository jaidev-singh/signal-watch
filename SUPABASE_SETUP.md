# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note down your project URL and anon key

## 2. Configure Environment Variables

Update your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

### Topics Table
```sql
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "whyMatters" TEXT,
  url TEXT NOT NULL,  -- YouTube video URL
  thumbnail TEXT,  -- Auto-generated from URL
  priority INTEGER DEFAULT 0,
  videos JSONB DEFAULT '[]'::jsonb,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for better query performance
CREATE INDEX idx_topics_priority ON topics(priority);
CREATE INDEX idx_topics_updated ON topics("updatedAt");
```

### Creators Table
```sql
CREATE TABLE creators (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for better query performance
CREATE INDEX idx_creators_name ON creators(name);
```

## 4. Set Up Row Level Security (RLS)

### For Public Read Access (User App)
```sql
-- Enable RLS on topics table
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to topics
CREATE POLICY "Allow public read access on topics"
  ON topics FOR SELECT
  TO anon
  USING (true);

-- Enable RLS on creators table
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Allow public read access to creators
CREATE POLICY "Allow public read access on creators"
  ON creators FOR SELECT
  TO anon
  USING (true);
```

### For Admin Write Access
```sql
-- Allow authenticated users to insert, update, delete topics
CREATE POLICY "Allow authenticated users to manage topics"
  ON topics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to manage creators
CREATE POLICY "Allow authenticated users to manage creators"
  ON creators
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## 5. Create Admin User

In Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password for your admin account
4. Click "Create user"

## 6. Seed Initial Data (Optional)

Run this in your app console after setting up Supabase:

```javascript
import topicsService from './src/services/topicsService';
import creatorsService from './src/services/creatorsService';

// Seed initial data
await topicsService.seedInitialData();
await creatorsService.seedInitialData();
```

Or manually insert your seed data via SQL:

```sql
-- Insert creators
INSERT INTO creators (name) VALUES
  ('Creator 1'),
  ('Creator 2'),
  ('Creator 3');

-- Insert topics (adjust the JSON structure as needed)
INSERT INTO topics (id, title, description, priority, videos, "updatedAt") VALUES
  ('1', 'Your Topic Title', 'Description here', 1, '[]'::jsonb, NOW());
```

## 7. Deploy to Netlify

### User App (Public-Facing)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

### Admin Access
- Admin users access the same deployment at `/admin/login`
- Only authenticated users can access `/admin` route
- Public users see the main app at `/`

## 8. Testing the Setup

1. **Test User App**: Visit your deployed URL - should show topics without authentication
2. **Test Admin Login**: Visit `/admin/login` - should require authentication
3. **Test Admin Functions**: After login, try adding/editing/deleting topics and videos

## Security Notes

- Anon key is safe to expose publicly (it's in your frontend code)
- RLS policies ensure public users can only read data
- Only authenticated users can write/modify data
- Never expose your service_role key in the frontend

## Troubleshooting

### "Failed to fetch" errors
- Check if your Supabase URL and anon key are correct in `.env`
- Ensure RLS policies are set up correctly
- Check browser console for CORS errors

### Authentication not working
- Verify admin user was created in Supabase Dashboard
- Check that authentication is enabled in Supabase project settings
- Ensure email confirmation is disabled (or handle confirmation flow)

### Data not showing
- Verify tables were created successfully
- Check RLS policies allow read access for anon users
- Run seed data functions if tables are empty
