import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('instagram_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get user profile
    const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,profile_picture_url,account_type,media_count&access_token=${accessToken}`);
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile data');
    }

    const profileData = await profileResponse.json();

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}