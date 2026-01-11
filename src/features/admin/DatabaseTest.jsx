import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

const DatabaseTest = () => {
  const [topics, setTopics] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test topics table
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .order('priority', { ascending: true });

      if (topicsError) {
        setError(`Topics Error: ${topicsError.message}`);
        console.error('Topics error:', topicsError);
      } else {
        setTopics(topicsData || []);
        console.log('Topics loaded:', topicsData);
      }

      // Test channels table
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('channels')
        .select('*');

      if (creatorsError) {
        setError(`Creators Error: ${creatorsError.message}`);
        console.error('Creators error:', creatorsError);
      } else {
        setCreators(creatorsData || []);
        console.log('Creators loaded:', creatorsData);
      }
    } catch (err) {
      setError(`Exception: ${err.message}`);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Connection Test</h1>
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded mb-6">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Topics Table ({topics.length})</h2>
            {topics.length === 0 ? (
              <p className="text-gray-500 italic">No topics found in database</p>
            ) : (
              <div className="space-y-4">
                {topics.map(topic => (
                  <div key={topic.id} className="border p-4 rounded">
                    <h3 className="font-bold text-lg">{topic.title}</h3>
                    <p className="text-sm text-gray-600">ID: {topic.id}</p>
                    <p className="text-sm text-gray-600">Priority: {topic.priority}</p>
                    {topic.whyMatters && (
                      <p className="text-sm mt-2"><strong>Why Matters:</strong> {topic.whyMatters}</p>
                    )}
                    <p className="text-sm mt-2">
                      <strong>Videos:</strong> {Array.isArray(topic.videos) ? topic.videos.length : 0}
                    </p>
                    {topic.videos && topic.videos.length > 0 && (
                      <div className="mt-2 ml-4">
                        {topic.videos.map((video, idx) => (
                          <div key={idx} className="text-xs text-gray-700 mb-1">
                            • {video.title} ({video.channel})
                            {video.url && (
                              <a 
                                href={video.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:underline"
                              >
                                [URL]
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                      {JSON.stringify(topic, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Channels Table ({creators.length})</h2>
            {creators.length === 0 ? (
              <p className="text-gray-500 italic">No channels found in database</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {creators.map(creator => (
                  <div key={creator.id} className="border p-2 rounded">
                    <p className="font-medium">{creator.name}</p>
                    <p className="text-xs text-gray-500">ID: {creator.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DatabaseTest;
