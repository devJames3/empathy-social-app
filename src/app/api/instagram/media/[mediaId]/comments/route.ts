import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params:Promise<{ mediaId: string }> }
) {
  const resolvedParams = await params;
  const mediaId = resolvedParams.mediaId;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('instagram_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get comments for the media
    const commentsResponse = await fetch(
      `https://graph.instagram.com/${mediaId}/comments?access_token=${accessToken}`
    );
    
    if (!commentsResponse.ok) {
      throw new Error('Failed to fetch comments');
    }

    const commentsData = await commentsResponse.json();
    
    return NextResponse.json({ comments: commentsData });
  } catch (error) {
    console.error('Error fetching Instagram comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

