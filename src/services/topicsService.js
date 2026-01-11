import { supabase } from '../config/supabase';
import seedTopics from '../fixtures/seedTopics.json';

// Helper: Convert MM:SS to seconds
const durationToSeconds = (duration) => {
  if (!duration) return 0;
  const parts = duration.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return minutes * 60 + seconds;
};

// Helper: Convert seconds to MM:SS
const secondsToDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const topicsService = {
  getTopics: async () => {
    try {
      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .order('priority', { ascending: true })
        .order('last_update', { ascending: false });
      
      if (topicsError) throw topicsError;
      
      // Fetch all videos with channel info
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select(`
          *,
          channels (
            name
          )
        `);
      
      if (videosError) console.error('Error fetching videos:', videosError);
      
      // Group videos by topic_id
      const videosByTopic = {};
      (videosData || []).forEach(video => {
        if (!videosByTopic[video.topic_id]) {
          videosByTopic[video.topic_id] = [];
        }
        videosByTopic[video.topic_id].push({
          id: video.id,
          title: video.video_title,
          url: video.video_url,
          thumbnail: video.thumbnail_url,
          duration: secondsToDuration(video.duration),
          channel: video.channels?.name || 'Unknown',
          stance: video.stance,
          covers: video.covers || []
        });
      });
      
      // Convert snake_case from DB to camelCase for frontend and attach videos
      const topics = (topicsData || []).map(topic => ({
        ...topic,
        whyMatters: topic.why_matters,
        updatedAt: topic.last_update || topic.created_at,
        videos: videosByTopic[topic.id] || []
      }));
      
      return topics;
    } catch (error) {
      console.error('Error fetching topics from Supabase:', error);
      return [];
    }
  },

  addTopic: async (topic) => {
    try {
      console.log('addTopic called with:', topic);
      
      const newPriority = topic.priority || 1;
      
      // Step 1: Increment priority of all topics with priority >= newPriority
      const { data: existingTopics, error: fetchError } = await supabase
        .from('topics')
        .select('id, priority')
        .gte('priority', newPriority);
      
      if (fetchError) {
        console.error('Error fetching existing topics:', fetchError);
      } else if (existingTopics && existingTopics.length > 0) {
        // Increment each topic's priority by 1
        for (const existingTopic of existingTopics) {
          await supabase
            .from('topics')
            .update({ priority: existingTopic.priority + 1 })
            .eq('id', existingTopic.id);
        }
      }
      
      // Step 2: Insert new topic with specified priority
      const dbTopic = {
        title: topic.title,
        slug: topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        region: 'General',
        why_matters: topic.whyMatters,
        priority: newPriority,
        is_active: true
      };
      
      console.log('Inserting to DB:', dbTopic);
      
      const { data, error } = await supabase
        .from('topics')
        .insert([dbTopic])
        .select();
      
      if (error) {
        console.error('Error inserting topic:', error);
        throw error;
      }
      
      console.log('Topic added successfully:', data);
      
      // Return all topics after addition
      return await topicsService.getTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
      throw error;
    }
  },

  updateTopic: async (topicId, updatedData) => {
    try {
      console.log('updateTopic called with:', { topicId, updatedData });
      
      // Convert camelCase to snake_case for DB
      const dbUpdate = {
        title: updatedData.title,
        why_matters: updatedData.whyMatters,
        priority: updatedData.priority || 0,
        last_update: new Date().toISOString()
      };
      
      // Update slug if title changed
      if (updatedData.title) {
        dbUpdate.slug = updatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      
      console.log('Updating DB with:', dbUpdate);
      
      const { error } = await supabase
        .from('topics')
        .update(dbUpdate)
        .eq('id', topicId);
      
      if (error) {
        console.error('Error updating topic:', error);
        throw error;
      }
      
      console.log('Topic updated successfully');
      
      return await topicsService.getTopics();
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  },

  deleteTopic: async (topicId) => {
    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);
      
      if (error) throw error;
      
      return await topicsService.getTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  },

  deleteTopicsWithPriorityOver30: async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .delete()
        .gt('priority', 30);
      
      if (error) throw error;
      
      return await topicsService.getTopics();
    } catch (error) {
      console.error('Error deleting topics with priority > 30:', error);
      throw error;
    }
  },

  addVideo: async (topicId, video) => {
    try {
      console.log('addVideo called with:', { topicId, video });
      
      // Get channel_id from channel name
      const { data: channel } = await supabase
        .from('channels')
        .select('id')
        .eq('name', video.channel)
        .single();
      
      if (!channel) {
        console.error('Channel not found:', video.channel);
        throw new Error(`Channel "${video.channel}" not found. Please add it in Manage Creators first.`);
      }
      
      // Generate thumbnail from YouTube URL
      const getYoutubeThumbnail = (url) => {
        if (!url) return null;
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg` : null;
      };
      
      // Extract YouTube video ID
      const getYoutubeVideoId = (url) => {
        if (!url) return null;
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoIdMatch ? videoIdMatch[1] : null;
      };
      
      const thumbnail = getYoutubeThumbnail(video.url);
      const youtubeVideoId = getYoutubeVideoId(video.url);
      
      if (!youtubeVideoId) {
        throw new Error('Invalid YouTube URL - could not extract video ID');
      }
      
      // Insert video into videos table
      const { data, error } = await supabase
        .from('videos')
        .insert({
          topic_id: topicId,
          channel_id: channel.id,
          youtube_video_id: youtubeVideoId,
          video_title: video.title,
          video_url: video.url,
          thumbnail_url: thumbnail,
          duration: durationToSeconds(video.duration),
          stance: video.stance || 'Balanced',
          published_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error('Error inserting video:', error);
        throw error;
      }
      
      console.log('Video added successfully:', data);
      
      return await topicsService.getTopics();
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  },

  deleteVideo: async (topicId, videoId) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      return await topicsService.getTopics();
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Helper function to seed initial data (run once)
  seedInitialData: async () => {
    try {
      const { data: existing } = await supabase
        .from('topics')
        .select('id')
        .limit(1);
      
      if (!existing || existing.length === 0) {
        const { error } = await supabase
          .from('topics')
          .insert(seedTopics);
        
        if (error) throw error;
        console.log('Initial data seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding initial data:', error);
    }
  }
};

export default topicsService;
