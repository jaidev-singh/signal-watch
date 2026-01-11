export function groupByCreator(topics) {
  const creatorMap = {};
  
  topics.forEach(topic => {
    topic.videos.forEach(video => {
      const creator = video.channel;
      if (!creatorMap[creator]) {
        creatorMap[creator] = [];
      }
      creatorMap[creator].push({
        ...video,
        topicTitle: topic.title,
        topicId: topic.id
      });
    });
  });
  
  // Sort creators alphabetically
  const sortedCreators = Object.keys(creatorMap).sort();
  const result = {};
  sortedCreators.forEach(creator => {
    result[creator] = creatorMap[creator];
  });
  
  return result;
}
