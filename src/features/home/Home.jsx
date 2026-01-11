import React, { useState } from 'react';
import { useTopics } from '../../hooks/useTopics';
import { useCreators } from '../../hooks/useCreators';
import TopicCard from './TopicCard';
import VideoItem from './VideoItem';
import FilterBar from '../../components/FilterBar';
import ToggleView from '../../components/ToggleView';
import CreatorFilter from '../../components/CreatorFilter';
import { useFilters } from './useFilters';
import { groupByCreator } from '../../utils/groupByCreator';
import { parseDuration } from '../../utils/formatTime';

const Home = () => {
  const [view, setView] = useState('topics'); // 'topics' or 'creators'
  const { topics } = useTopics();
  const { creators } = useCreators();
  const { filters, updateFilter, selectedCreators, toggleCreator } = useFilters();

  // Filter topics based on selected filters
  const filteredTopics = topics
    .filter(topic => {
      // Topic filter
      if (filters.topic !== 'all' && topic.id !== filters.topic) {
        return false;
      }

      // Time filter (check if topic has videos under the time limit)
      if (filters.maxDuration) {
        const hasShortVideo = topic.videos.some(v => {
          const videoMinutes = Math.round(parseDuration(v.duration));
          return videoMinutes <= filters.maxDuration;
        });
        if (!hasShortVideo) return false;
      }

      // Today filter - last 24 hours
      if (filters.today) {
        const timestamp = topic.last_update || topic.updatedAt || topic.created_at;
        if (!timestamp) return false;
        
        const updatedDate = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now - updatedDate) / (1000 * 60 * 60); // milliseconds to hours
        
        if (hoursDiff > 24) return false;
      }

      return true;
    })
    .map(topic => {
      // Filter videos within each topic based on duration filter
      let filteredVideos = topic.videos;
      
      if (filters.maxDuration) {
        filteredVideos = topic.videos.filter(v => {
          const videoMinutes = Math.round(parseDuration(v.duration));
          return videoMinutes <= filters.maxDuration;
        });
      }
      
      return {
        ...topic,
        videos: filteredVideos
      };
    })
    .sort((a, b) => {
    // Sort by priority ascending (1 = highest priority shows first)
    // Topics with priority 0 or undefined go to the end
    const aPriority = a.priority || 999999;
    const bPriority = b.priority || 999999;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // If same priority, sort by updated date (newest first)
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // For creators view, group by creator and filter
  const creatorGroups = groupByCreator(filteredTopics);
  const filteredCreators = selectedCreators.length > 0
    ? Object.fromEntries(
        Object.entries(creatorGroups).filter(([creator]) => selectedCreators.includes(creator))
      )
    : creatorGroups;

  // Use all creators from creatorsService, not just those with videos
  const allCreators = creators;

  console.log('Creators for dropdown:', allCreators);
  console.log('Selected creators:', selectedCreators);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-6 py-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>SignalWatch</h1>
              <p className="text-sm text-gray-500 mt-1">Decide what to watch</p>
            </div>
            <a
              href="/admin"
              className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#1E3A8A' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1E3A8A'}
            >
              Admin Panel
            </a>
          </div>
          
          <ToggleView view={view} onChange={setView} />
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar 
        filters={filters} 
        updateFilter={updateFilter} 
        topics={topics}
      />

      {/* Main Content */}
      <main className="max-w-[1100px] mx-auto px-6 py-8">
        {view === 'topics' ? (
          // Topics View
          <div>
            {filteredTopics.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No topics match your filters</p>
              </div>
            ) : (
              filteredTopics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))
            )}
          </div>
        ) : (
          // Creators View
          <div>
            <CreatorFilter
              creators={allCreators}
              selectedCreators={selectedCreators}
              onToggle={toggleCreator}
            />
            
            {Object.keys(filteredCreators).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No creators match your selection</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(filteredCreators).map(([creator, videos]) => (
                  <div key={creator} className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      🎥 {creator}
                    </h2>
                    <div className="space-y-4">
                      {videos.map(video => (
                        <VideoItem key={video.id} video={video} showTopic={true} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16 py-8">
        <div className="max-w-[1100px] mx-auto px-6 text-center text-sm text-gray-500">
          This app curates public analysis and links to original YouTube videos.
        </div>
      </footer>
    </div>
  );
};

export default Home;
