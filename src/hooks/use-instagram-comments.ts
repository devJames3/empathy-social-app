'use client';

import { useState, useCallback } from 'react';
import { InstagramComment } from '@/types/instagram';

export function useInstagramComments(mediaId: string) {
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/instagram/media/${mediaId}/comments`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await res.json();
      
      setComments(data.comments.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [mediaId]);
  
  const postComment = useCallback(async (text: string, commentId?: string) => {
    try {
      const res = await fetch(`/api/instagram/media/${mediaId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, commentId }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }
      
      // Refresh comments after posting
      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error posting comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to post comment');
      return false;
    }
  }, [mediaId, fetchComments]);
  
  return { comments, isLoading, error, fetchComments, postComment };
}
