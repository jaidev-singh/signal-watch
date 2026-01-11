# Design Implementation - SignalWatch

This document explains how your wireframe design was implemented in the React app.

## Wireframe → Code Mapping

### Header ("SignalWatch - Decide what to watch")
**File**: [src/features/home/Home.jsx](src/features/home/Home.jsx)
```jsx
<h1>SignalWatch</h1>
<p>Decide what to watch</p>
```
- Styled with Tailwind CSS
- Includes Admin Panel link on the right

### View Toggle ([Topics] [Creators])
**Component**: [src/components/ToggleView.jsx](src/components/ToggleView.jsx)
- Two buttons that switch between views
- Active button is blue, inactive is gray
- State managed in Home component

### Filter Strip
**Component**: [src/components/FilterBar.jsx](src/components/FilterBar.jsx)
- Topic dropdown: "All Topics ▾"
- Quick filters: ⏱ <15 min, 🆕 Today, ⭐ Fav
- Filters apply to both Topics and Creators views

### Topic Cards
**Component**: [src/features/home/TopicCard.jsx](src/features/home/TopicCard.jsx)

Each card includes:
1. **📌 Topic Title** - Bold heading
2. **Last updated** - Relative time (e.g., "4 hours ago")
3. **"Why This Matters"** - ✅ Blue highlighted box with explanation
4. **Stance Groups** - Videos organized by:
   - 🟢 Balanced / Pragmatic
   - 🔴 Strong / Hawkish
   - 🔵 International / External
5. **Video Items** - Under each stance:
   - Creator name
   - • Video title (duration)
   - [Watch on YouTube] button
6. **☆ Follow Topic** - Button at bottom

### Creators View
**Components**:
- [src/components/CreatorFilter.jsx](src/components/CreatorFilter.jsx) - Checkboxes
- [src/features/home/VideoItem.jsx](src/features/home/VideoItem.jsx) - Video display

Shows:
- Creator filter checkboxes at top
- 🎥 Creator Name sections
- Videos with topic tags
- "Covers: Topic Name" for each video

### Footer
**File**: [src/features/home/Home.jsx](src/features/home/Home.jsx)
```jsx
<footer>
  This app curates public analysis and links to original YouTube videos.
</footer>
```

## Key Design Principles Implemented

### ✅ "Titles → original YouTube titles"
- VideoForm stores exact titles from YouTube
- No modification or summarization

### ✅ "Content → grouping only"
- Videos grouped by stance (Balanced/Hawkish/International)
- Videos grouped by creator
- No content filtering or bias

### ✅ "Decision → user decides, not app"
- "Why This Matters" provides context
- Multiple perspectives shown side by side
- User clicks through to watch full videos

### ✅ "Should I spend 20 minutes on this?"
Every card answers this with:
- Topic importance explanation
- Video duration shown
- Creator credibility (channel name)
- Stance/perspective labeled
- Last updated timestamp

## Data Flow

```
seedTopics.json (initial data)
    ↓
topicsService.js (localStorage CRUD)
    ↓
useTopics hook (React state)
    ↓
Home component (filtering)
    ↓
TopicCard / VideoItem (display)
```

## Styling System

**Tailwind CSS** classes used throughout:
- `bg-blue-600` - Primary buttons
- `bg-white` - Cards
- `shadow-md` - Card shadows
- `rounded-lg` - Rounded corners
- `hover:bg-blue-700` - Interactive states

## Admin Panel Design

**File**: [src/features/admin/AdminPage.jsx](src/features/admin/AdminPage.jsx)

Clean interface with:
- Dark header (bg-gray-900)
- List view of all topics
- Forms for adding/editing
- Delete confirmations
- "Back to list" navigation

## Responsive Design

- `max-w-6xl mx-auto` - Centered content, max width
- `flex-wrap` - Filters wrap on small screens
- Works on mobile, tablet, desktop

## Color Scheme

- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Danger**: Red (#dc2626)
- **Background**: Light gray (#f9fafb)
- **Text**: Dark gray (#111827)

## Icons

Using Unicode emojis for simplicity:
- 📌 Topics
- 🎥 Creators
- 🟢🔴🔵 Stances
- ⏱ Duration
- 🆕 New
- ⭐ Favorite
- ☆ Follow

No external icon library needed!

## Future Enhancements (Not Implemented)

These features are stubbed but not functional:
- ⭐ Favorite topics/videos
- ☆ Follow topic notifications
- User accounts
- Video recommendations

To add these, you'd need:
1. Backend server for persistence
2. User authentication
3. Notification system

But the core app works perfectly as a local tool! 🎉
