'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useInstagramAuth, useInstagramProfile, useInstagramFeed } from '@/hooks/use-instagram';

import InstagramComments from '@/components/instagram-comments';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useInstagramAuth();
  const { profile, isLoading: profileLoading } = useInstagramProfile();
  const { media, isLoading: mediaLoading } = useInstagramFeed();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  if (authLoading || profileLoading || mediaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load profile data.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center">
            {
              profile.profile_picture_url ? (
                <Image
                    src= {profile.profile_picture_url}
                    alt= 'Instagram media'
                    // fill
                    width={100}
                    height={100}
                    className="object-cover rounded-full"
                  />
              ):
              (
                <span className="text-2xl font-bold">{profile.username?.charAt(0)?.toUpperCase()}</span>
              )
            }
            
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-gray-600">{profile.account_type}</p>
          </div>
        </div>
        <Link 
          href="/api/auth/logout" 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </Link>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Media</h2>
      
      {!media || media.length === 0 ? (
      <p>No media found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            
            {item.media_type === 'VIDEO' ? (
              <div className="relative pt-[100%]">
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src={item.media_url}
                  poster={item.thumbnail_url}
                  controls
                />
              </div>
            ) : (
              <div className="relative pt-[100%] bg-gray-100">
                <Image
                  src={item.media_url}
                  alt={item.caption || 'Instagram media'}
                  fill
                  className="object-cover"
                  priority={media.indexOf(item) < 3}
                />
              </div>
            )}
            <div className="p-3">
              <p className="text-sm text-gray-700 line-clamp-2">{item.caption || 'No caption'}</p>
              <div className="flex justify-between mt-2">
                <a
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500"
                >
                  View on Instagram
                </a>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              {/* comments component */}
              <InstagramComments mediaId={item.id} />
            </div>
          </div>
        ))}
      </div>
    )}
    </div> 
  );
}