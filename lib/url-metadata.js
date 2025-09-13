// Utility functions for fetching URL metadata

export async function fetchUrlMetadata(url) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Create a simple API endpoint call to get metadata
    const response = await fetch(`/api/url-metadata?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const metadata = await response.json();
    
    return {
      title: metadata.title || extractDomainName(url),
      description: metadata.description || '',
      image: metadata.image || metadata.ogImage || null,
      success: true
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return {
      title: extractDomainName(url),
      description: '',
      image: null,
      success: false,
      error: error.message
    };
  }
}

export function extractDomainName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'رابط غير صحيح';
  }
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Fallback function to extract basic info from common platforms
export function getPlatformInfo(url) {
  const platforms = {
    'youtube.com': {
      name: 'يوتيوب',
      getImage: (url) => {
        const videoId = extractYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
      }
    },
    'youtu.be': {
      name: 'يوتيوب',
      getImage: (url) => {
        const videoId = url.split('/').pop()?.split('?')[0];
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
      }
    },
    'facebook.com': {
      name: 'فيسبوك',
      getImage: () => 'https://via.placeholder.com/300x200.png?text=Facebook'
    },
    'instagram.com': {
      name: 'إنستغرام',
      getImage: () => 'https://via.placeholder.com/300x200.png?text=Instagram'
    },
    'twitter.com': {
      name: 'تويتر',
      getImage: () => 'https://via.placeholder.com/300x200.png?text=Twitter'
    },
    'x.com': {
      name: 'تويتر',
      getImage: () => 'https://via.placeholder.com/300x200.png?text=Twitter'
    }
  };

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    for (const [domain, info] of Object.entries(platforms)) {
      if (hostname.includes(domain)) {
        return {
          name: info.name,
          image: info.getImage(url)
        };
      }
    }
  } catch {
    return null;
  }
  
  return null;
}

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
