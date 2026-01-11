# Database Migration Checklist

After migrating to the new 3-table schema, verify these changes:

## ✅ Tables Updated

1. **Topics table**
   - `id` → UUID (auto-generated)
   - `title` → TEXT
   - `slug` → TEXT (auto-generated from title)
   - `region` → TEXT (required)
   - `why_matters` → TEXT (was whyMatters)
   - `url` → TEXT (YouTube URL)
   - `thumbnail` → TEXT (auto-generated from URL)
   - `priority` → INTEGER
   - `last_update` → TIMESTAMP (was updatedAt)
   - `created_at` → TIMESTAMP
   - `is_active` → BOOLEAN

2. **Channels table** (was creators)
   - `id` → UUID
   - `name` → TEXT

3. **Videos table** (new)
   - Separate table for videos instead of JSONB

## ✅ Code Updated

1. **topicsService.js**
   - ✅ Converts camelCase (frontend) ↔ snake_case (database)
   - ✅ Uses new field names
   - ✅ Auto-generates slug from title
   - ✅ Adds comprehensive logging

2. **creatorsService.js**
   - ✅ Uses `channels` table instead of `creators`
   - ✅ Adds logging

3. **TopicForm.jsx**
   - ✅ Added `region` field (required)
   - ✅ Has `url` field with auto-thumbnail
   - ✅ Removed manual ID generation

4. **AdminPage.jsx**
   - ✅ Removed manual ID/timestamp generation
   - ✅ Database handles these automatically

## 🧪 Test These Operations

### Test 1: Add a Channel
1. Go to `/admin`
2. Click "Manage Creators" tab
3. Add a channel name (e.g., "Palki Sharma")
4. Check console for: "Adding channel: Palki Sharma"
5. Should see: "Channel added successfully"
6. Verify in `/test-db` page

### Test 2: Add a Topic
1. Go to `/admin`
2. Click "Add New Topic"
3. Fill in:
   - **Title**: Test Topic
   - **Region**: India-China
   - **Why Matters**: Testing the new schema
   - **YouTube URL**: https://youtube.com/watch?v=dQw4w9WgXcQ
   - **Priority**: 1
4. Click "Save Topic"
5. Check console for:
   - "Adding topic data:"
   - "Inserting to DB:" (should show snake_case fields)
   - "Topic added successfully:"
6. Verify in `/test-db` page

## 🔍 Console Logs to Watch

When adding a topic, you should see:
```
Adding topic data: {title: "Test", region: "India", whyMatters: "...", url: "https://...", ...}
Inserting to DB: {id: undefined, title: "Test", slug: "test", region: "India", why_matters: "...", ...}
Topic added successfully: [{...}]
```

When adding a channel:
```
Adding channel: Palki Sharma
Channel added successfully
```

## ❌ Common Errors & Fixes

### Error: "null value in column 'region' violates not-null constraint"
**Fix**: Make sure you fill in the Region field in the form

### Error: "relation 'creators' does not exist"
**Fix**: Your database still has the old table name. You need to rename:
```sql
ALTER TABLE creators RENAME TO channels;
```

### Error: "column 'whyMatters' does not exist"
**Fix**: Database expects `why_matters` (snake_case). The service should handle conversion automatically.

### Topics/Channels not showing
**Fix**: 
1. Check browser console for errors
2. Go to `/test-db` to see raw database data
3. Verify RLS policies allow authenticated users to read/write
4. Check Supabase logs for detailed errors

## 🔗 Quick Links

- Test database: http://localhost:3000/test-db
- Admin panel: http://localhost:3000/admin
- Supabase dashboard: https://app.supabase.com

## 📝 SQL to Verify Schema

```sql
-- Check topics table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'topics';

-- Check if channels table exists (not creators)
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('channels', 'creators');

-- Count records
SELECT 'topics' as table_name, COUNT(*) FROM topics
UNION ALL
SELECT 'channels', COUNT(*) FROM channels
UNION ALL  
SELECT 'videos', COUNT(*) FROM videos;
```
