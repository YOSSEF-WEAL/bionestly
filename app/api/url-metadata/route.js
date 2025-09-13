import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch webpage');
    }

    const html = await response.text();
    
    // Extract metadata using regex patterns
    const metadata = extractMetadata(html, url);
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata', details: error.message },
      { status: 500 }
    );
  }
}

function extractMetadata(html, url) {
  const metadata = {
    title: '',
    description: '',
    image: '',
    ogImage: ''
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract Open Graph title (fallback)
  const ogTitleMatch = html.match(/<meta[^>]*property=['"](og:title|twitter:title)['"][^>]*content=['"]([^'"]+)['"]/i);
  if (ogTitleMatch && !metadata.title) {
    metadata.title = ogTitleMatch[2].trim();
  }

  // Extract description
  const descMatch = html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]+)['"]/i);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  }

  // Extract Open Graph description (fallback)
  const ogDescMatch = html.match(/<meta[^>]*property=['"](og:description|twitter:description)['"][^>]*content=['"]([^'"]+)['"]/i);
  if (ogDescMatch && !metadata.description) {
    metadata.description = ogDescMatch[2].trim();
  }

  // Extract Open Graph image
  const ogImageMatch = html.match(/<meta[^>]*property=['"](og:image|twitter:image)['"][^>]*content=['"]([^'"]+)['"]/i);
  if (ogImageMatch) {
    let imageUrl = ogImageMatch[2].trim();
    // Convert relative URLs to absolute
    if (imageUrl.startsWith('/')) {
      const urlObj = new URL(url);
      imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
    } else if (imageUrl.startsWith('./') || !imageUrl.startsWith('http')) {
      const urlObj = new URL(url);
      imageUrl = `${urlObj.protocol}//${urlObj.host}/${imageUrl.replace('./', '')}`;
    }
    metadata.ogImage = imageUrl;
    metadata.image = imageUrl;
  }

  // Extract regular image if no OG image found
  if (!metadata.image) {
    const imgMatch = html.match(/<img[^>]*src=['"]([^'"]+)['"]/i);
    if (imgMatch) {
      let imageUrl = imgMatch[1].trim();
      // Convert relative URLs to absolute
      if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }
      metadata.image = imageUrl;
    }
  }

  return metadata;
}
