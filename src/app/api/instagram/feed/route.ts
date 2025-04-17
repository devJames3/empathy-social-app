import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('instagram_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    
    const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`);
    
    if (!mediaResponse.ok) {
      throw new Error('Failed to fetch media data');
    }

    const mediaData = await mediaResponse.json();

    return NextResponse.json({ media: mediaData });
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}