export function groupByStance(videos) {
  const grouped = videos.reduce((acc, item) => {
    const stance = item.stance || 'Other';
    (acc[stance] = acc[stance] || []).push(item);
    return acc;
  }, {});
  
  // Return in specific order: Balanced, Hawkish, International, then others
  const orderedStances = ['Balanced', 'Hawkish', 'International'];
  const result = {};
  
  orderedStances.forEach(stance => {
    if (grouped[stance]) {
      result[stance] = grouped[stance];
    }
  });
  
  // Add any other stances not in the predefined list
  Object.keys(grouped).forEach(stance => {
    if (!orderedStances.includes(stance)) {
      result[stance] = grouped[stance];
    }
  });
  
  return result;
}
