// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format rating to display with star
export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return `⭐ ${rating.toFixed(1)}`;
};

// Format price (mock for now)
export const formatPrice = (price = 59.99) => {
  return `$${price.toFixed(2)}`;
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get platform icons (simple mapping)
export const getPlatformIcon = (platformName) => {
  const name = platformName.toLowerCase();
  if (name.includes('playstation')) return '🎮';
  if (name.includes('xbox')) return '🎮';
  if (name.includes('pc')) return '💻';
  if (name.includes('nintendo')) return '🎮';
  if (name.includes('ios')) return '📱';
  if (name.includes('android')) return '📱';
  return '🎮';
};

