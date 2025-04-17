"use client";

import { useState, useEffect } from 'react';
import { InstagramProfile, InstagramMedia } from '@/types/instagram';

export function useInstagramAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  return { isAuthenticated, isLoading };
}

export function useInstagramProfile() {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/instagram/profile');
        
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await res.json();

        setProfile(data.profile);
      } catch (error) {
        console.error('Error fetching Instagram profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);
  
  return { profile, isLoading, error };
}

export function useInstagramFeed() {
  const [media, setMedia] = useState<InstagramMedia[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch('/api/instagram/feed');
        
        if (!res.ok) {
          throw new Error('Failed to fetch media');
        }
        
        const data = await res.json();

        setMedia(data.media.data);
      } catch (error) {
        console.error('Error fetching Instagram media:', error);
        setError('Failed to load media data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedia();
  }, []);
  
  return { media, isLoading, error };
}