import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.delete('instagram_access_token');
  cookieStore.delete('instagram_user_id');
  
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
}