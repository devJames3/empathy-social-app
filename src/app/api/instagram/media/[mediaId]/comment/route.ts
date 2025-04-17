import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  const resolvedParams = await params;
  const mediaId =  resolvedParams.mediaId;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('instagram_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { text, commentId } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    let url = `https://graph.instagram.com/${mediaId}/comments`;
    const body = new URLSearchParams({
      message: text,
      access_token: accessToken
    });

    // If commentId is provided, it's a reply to a comment
    if (commentId) {
      url = `https://graph.instagram.com/${commentId}/replies`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to post comment: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ success: true, commentId: data.id });
  } catch (error) {
    console.error('Error posting Instagram comment:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to post comment' 
    }, { status: 500 });
  }
}