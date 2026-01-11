# SignalWatch - YouTube News Curator

A web application that organizes YouTube analysis videos by topic and perspective, helping users decide what to watch.

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the app**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Navigate to `http://localhost:3000`

## ✨ Features

### User Features
- **Topics View**: Browse news topics with videos grouped by stance (🟢 Balanced, 🔴 Hawkish, 🔵 International)
- **Creators View**: Browse videos organized by creator/channel
- **Smart Filtering**: Filter by topic, duration (<15 min), date (Today)
- **"Why This Matters"**: Each topic explains its importance
- **Direct YouTube Links**: One-click access to videos

### Admin Features
- **Topic Management**: Add, edit, and delete topics
- **Video Management**: Add videos with metadata (channel, stance, duration, tags)
- **Local Storage**: All data persists in browser

## 📖 How to Use

### User Interface

**Home Page** (`http://localhost:3000`)
- Toggle between **Topics** and **Creators** views
- Use filters to find content:
  - Select specific topic from dropdown
  - Click "⏱ <15 min" for short videos only
  - Click "🆕 Today" for today's updates

**Topics View**
- Each card shows why the topic matters
- Videos grouped by stance (Balanced/Hawkish/International)
- Click "Watch on YouTube" to view

**Creators View**
- Filter by creator checkboxes
- See all videos from selected creators
- Videos show which topics they cover

### Admin Panel

**Access**: Click "Admin Panel" or go to `http://localhost:3000/admin`

**Add Topic**:
1. Click "+ Add New Topic"
2. Enter title and "Why This Matters" explanation
3. Save

**Add Video**:
1. Find topic, click "+ Add Video"
2. Fill in:
   - Channel Name (e.g., "Career247")
   - Video Title (exact YouTube title)
   - Duration (MM:SS format, e.g., "18:00")
   - Stance (Balanced/Hawkish/International)
   - YouTube URL
   - Topic tags
3. Save

**Edit/Delete**: Use buttons on each item

## 🛠 Technical Details

**Tech Stack**:
- React 18 + Vite
- Tailwind CSS
- LocalStorage for data

**Data Location**: Browser localStorage key `signalwatch_topics`

**Reset Data**: Delete localStorage key in DevTools → Application → Local Storage

## 📦 Build for Production

```bash
npm run build
```

Output in `dist/` folder - deploy to any static host.

## 🎯 No React Knowledge Required!

The app is fully built - just use the admin panel to manage content. No coding needed! 🎉
