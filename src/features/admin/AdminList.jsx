import { formatTime } from '../../utils/formatTime';
import { getYoutubeThumbnail } from '../../utils/getYoutubeThumbnail';

const AdminList = ({ topics, onEdit, onDelete, onAddVideo, onDeleteVideo }) => {
  return (
    <div className="space-y-6">
      {topics.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No topics yet. Add your first topic!</p>
        </div>
      ) : (
        topics.map(topic => (
          <div key={topic.id} className="bg-white rounded-lg shadow-md p-6">
            {topic.thumbnail && (
              <img
                src={topic.thumbnail}
                alt={topic.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                  {topic.priority !== undefined && topic.priority !== null && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      Priority: {topic.priority}
                    </span>
                  )}
                </div>
                {topic.region && (
                  <p className="text-sm text-gray-600 mb-2">
                    📍 Region: <span className="font-medium">{topic.region}</span>
                  </p>
                )}
                {topic.channel && (
                  <p className="text-sm text-gray-600 mb-2">
                    📺 Channel: <span className="font-medium">{topic.channel}</span>
                  </p>
                )}
                {topic.duration && (
                  <p className="text-sm text-gray-600 mb-2">
                    ⏱️ Duration: <span className="font-medium">{topic.duration}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500 mb-2">
                  Last updated: {formatTime(topic.updatedAt)}
                </p>
                {topic.url && (
                  <p className="text-xs text-gray-500 mb-2">
                    🔗 Video URL: <a href={topic.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{topic.url}</a>
                  </p>
                )}
                {topic.thumbnail && (
                  <p className="text-xs text-gray-500 mb-2">
                    🖼️ Thumbnail: <a href={topic.thumbnail} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{topic.thumbnail}</a>
                  </p>
                )}
                {topic.whyMatters && (
                  <p className="text-sm text-gray-700 italic">
                    “{topic.whyMatters}”
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(topic)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this topic and all its videos?')) {
                      onDelete(topic.id);
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">
                  Videos ({(topic.videos || []).length})
                </h4>
                <button
                  onClick={() => onAddVideo(topic)}
                  className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  + Add Video
                </button>
              </div>

              {(!topic.videos || topic.videos.length === 0) ? (
                <p className="text-gray-500 text-sm italic">No videos yet</p>
              ) : (
                <div className="space-y-3">
                  {topic.videos.map(video => {
                    const thumbnail = getYoutubeThumbnail(video.url);
                    return (
                      <div
                        key={video.id}
                        className="flex gap-3 p-3 bg-gray-50 rounded border"
                      >
                        {thumbnail && (
                          <img
                            src={thumbnail}
                            alt={video.title}
                            className="w-32 h-20 object-cover rounded flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">{video.title}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            {video.channel} • {video.duration} • {video.stance}
                          </p>
                          {video.covers && video.covers.length > 0 && (
                            <p className="text-xs text-gray-500 mb-2">
                              Covers: {video.covers.join(', ')}
                            </p>
                          )}
                          {video.url && (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              {video.url}
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Delete this video?')) {
                              onDeleteVideo(topic.id, video.id);
                            }
                          }}
                          className="ml-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 h-fit"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminList;
