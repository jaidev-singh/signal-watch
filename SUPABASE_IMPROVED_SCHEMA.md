# Improved 3-Table Normalized Schema

This is a better, normalized database design that separates topics, channels, and videos into proper relational tables instead of using JSONB.

## Benefits of This Approach

1. **Proper relationships** - Videos linked to both topics and channels via foreign keys
2. **No duplicate data** - Channel info stored once, reused for all videos
3. **Better queries** - Can filter/sort by channel, stance, date, etc.
4. **Scalability** - Easy to add new fields, track metrics, etc.
5. **Data integrity** - Foreign keys prevent orphaned records

## Database Schema

### 1. Topics Table
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,  -- URL-friendly: "maldives-india-military"
  region TEXT NOT NULL,  -- "India-China", "Pakistan", "Indian Ocean", etc.
  why_matters TEXT,  -- Short explanation
  coverage_count INTEGER DEFAULT 0,  -- How many videos (auto-calculated)
  activity_level TEXT DEFAULT 'medium',  -- "high", "medium", "low"
  last_update TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE  -- For soft delete
);

-- Indexes for fast filtering
CREATE INDEX idx_topics_region ON topics(region);
CREATE INDEX idx_topics_active ON topics(is_active);
CREATE INDEX idx_topics_last_update ON topics(last_update DESC);
CREATE INDEX idx_topics_slug ON topics(slug);
```

### 2. Channels Table
```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,  -- "Major Gaurav Arya"
  youtube_channel_id TEXT UNIQUE,  -- "UCxxxxx" (from YouTube API)
  expertise TEXT,  -- "Indian Army Veteran (Retd.)"
  verified BOOLEAN DEFAULT FALSE,  -- ✓ badge
  focus_area TEXT[],  -- {"China", "Pakistan", "Defense"}
  subscriber_count INTEGER,  -- Optional: track popularity
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_channels_name ON channels(name);
CREATE INDEX idx_channels_youtube_id ON channels(youtube_channel_id);
```

### 3. Videos Table
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  
  -- YouTube metadata
  youtube_video_id TEXT NOT NULL UNIQUE,  -- "dQw4w9WgXcQ"
  video_title TEXT NOT NULL,  -- Original YouTube title
  duration INTEGER NOT NULL,  -- In seconds (e.g., 1080 = 18 min)
  published_at TIMESTAMP NOT NULL,  -- When uploaded to YouTube
  thumbnail_url TEXT,  -- YouTube thumbnail (auto-generated)
  video_url TEXT NOT NULL,  -- Full YouTube URL
  
  -- Our categorization
  stance TEXT NOT NULL CHECK (stance IN ('balanced', 'hawkish', 'dovish', 'international')),
  
  -- Metadata
  view_count INTEGER DEFAULT 0,  -- Optional: track from YouTube API
  added_at TIMESTAMP DEFAULT NOW(),  -- When we added it
  is_featured BOOLEAN DEFAULT FALSE,  -- Highlight quality content
  
  -- Prevent duplicates
  UNIQUE(topic_id, youtube_video_id)
);

-- Indexes for fast queries
CREATE INDEX idx_videos_topic ON videos(topic_id);
CREATE INDEX idx_videos_channel ON videos(channel_id);
CREATE INDEX idx_videos_stance ON videos(stance);
CREATE INDEX idx_videos_published ON videos(published_at DESC);
CREATE INDEX idx_videos_youtube_id ON videos(youtube_video_id);
```

## Helper Functions

### Auto-update topic coverage_count
```sql
CREATE OR REPLACE FUNCTION update_topic_coverage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE topics
  SET coverage_count = (
    SELECT COUNT(*) FROM videos WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id)
  ),
  last_update = NOW()
  WHERE id = COALESCE(NEW.topic_id, OLD.topic_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_coverage_count
AFTER INSERT OR DELETE ON videos
FOR EACH ROW
EXECUTE FUNCTION update_topic_coverage_count();
```

### Auto-update last_update timestamp
```sql
CREATE OR REPLACE FUNCTION update_topic_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE topics
  SET last_update = NOW()
  WHERE id = NEW.topic_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_topic_timestamp
AFTER INSERT OR UPDATE ON videos
FOR EACH ROW
EXECUTE FUNCTION update_topic_timestamp();
```

## Row Level Security (RLS)

### Public Read Access
```sql
-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read on topics"
  ON topics FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Allow public read on channels"
  ON channels FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read on videos"
  ON videos FOR SELECT
  TO anon
  USING (true);
```

### Admin Write Access
```sql
-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access on topics"
  ON topics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on channels"
  ON channels FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on videos"
  ON videos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## Example Queries

### Get all videos for a topic with channel info
```sql
SELECT 
  v.*,
  c.name as channel_name,
  c.expertise,
  c.verified
FROM videos v
JOIN channels c ON v.channel_id = c.id
WHERE v.topic_id = 'some-uuid'
ORDER BY v.published_at DESC;
```

### Get topics with video counts
```sql
SELECT 
  t.*,
  COUNT(v.id) as video_count
FROM topics t
LEFT JOIN videos v ON t.id = v.topic_id
WHERE t.is_active = true
GROUP BY t.id
ORDER BY t.last_update DESC;
```

### Get all videos by a channel
```sql
SELECT 
  v.*,
  t.title as topic_title,
  t.slug as topic_slug
FROM videos v
JOIN topics t ON v.topic_id = t.id
WHERE v.channel_id = 'some-uuid'
ORDER BY v.published_at DESC;
```

## Migration from Current Schema

If you want to migrate from your current JSONB-based schema to this normalized one:

1. Create the new tables
2. Migrate topics (keep same data, add new fields)
3. Extract unique channels from videos JSONB
4. Extract videos from JSONB and link to topics/channels
5. Drop old columns after verification

Migration script available in `MIGRATION_GUIDE.md`

## When to Use This Schema

✅ **Use this if:**
- You want proper relational data
- You plan to add more features (search by channel, filter by date, etc.)
- You want to track YouTube metrics (views, subscribers)
- You need better performance for complex queries

⚠️ **Current JSONB approach is OK if:**
- You're just prototyping/testing
- Simple use case with minimal queries
- Don't need to query/filter videos independently

The normalized schema is more work upfront but pays off long-term with better performance, data integrity, and flexibility.
