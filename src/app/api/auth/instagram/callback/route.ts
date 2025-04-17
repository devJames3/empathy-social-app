import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/instagram/callback`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID!,
        client_secret: INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for access token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    const longLivedTokenResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${access_token}`);
    
    if (!longLivedTokenResponse.ok) {
      throw new Error('Failed to get long-lived access token');
    }

    const longLivedTokenData = await longLivedTokenResponse.json();
    const longLivedToken = longLivedTokenData.access_token;

    // Get user data
    const userDataResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedToken}`);
    
    if (!userDataResponse.ok) {
      throw new Error('Failed to get user data');
    }

    const userData = await userDataResponse.json();

    // Store token and user data in cookies
    const cookieStore = await cookies();
    cookieStore.set('instagram_access_token', longLivedToken, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 60, 
      path: '/'
    });
    
    cookieStore.set('instagram_user_id', userData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 60,
      path: '/'
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`);
  } catch (error) {
    console.error('Instagram authentication error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=auth_failed`);
  }
}