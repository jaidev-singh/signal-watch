# Quick Start Guide - SignalWatch

## Getting Started (First Time)

1. Open PowerShell or Command Prompt
2. Navigate to project folder:
   ```
   cd e:\projects\news-decider
   ```
3. Install dependencies (one-time):
   ```
   npm install
   ```

## Running the App

Every time you want to use the app:

1. Open Command Prompt (not PowerShell if you have script issues)
2. Run:
   ```
   cd e:\projects\news-decider
   npm run dev
   ```
3. Open browser to: `http://localhost:3000`

## Using the App

### View Your News
- **Home Page**: See all topics with videos grouped by perspective
- **Switch Views**: Click "Topics" or "Creators" buttons
- **Filter**: Use dropdown and buttons to filter content

### Add Your Own Content (Admin Panel)

1. Click "Admin Panel" button (top right)
2. **To add a topic**:
   - Click "+ Add New Topic"
   - Enter topic name (e.g., "India-Pakistan Relations")
   - Enter why it matters (e.g., "Recent tensions could affect regional stability")
   - Click Save
3. **To add a video to a topic**:
   - Find your topic in the list
   - Click "+ Add Video"
   - Fill in the form:
     - Channel: YouTube creator name
     - Title: Video title (copy from YouTube)
     - Duration: MM:SS format (e.g., 15:30)
     - Stance: Choose perspective (Balanced/Hawkish/International)
     - URL: Full YouTube link
     - Covers: Add topic keywords
   - Click Save

### Tips
- Start with the 2 sample topics that are already there
- Add your favorite YouTube news channels
- Organize videos by their perspective/stance
- All changes save automatically to your browser

### Troubleshooting

**Can't run npm commands in PowerShell?**
- Use Command Prompt instead (cmd.exe)
- Or run this first in PowerShell:
  ```
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

**Want to reset everything?**
- Press F12 in browser
- Go to Application → Local Storage
- Delete "signalwatch_topics"
- Refresh page

**App not updating?**
- Hard refresh: Ctrl + Shift + R
- Or clear browser cache

## You're Done!

You have a fully working news curator. No coding needed - just use the admin panel to add topics and videos! 🎉
