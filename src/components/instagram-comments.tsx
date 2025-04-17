'use client';

import { useState } from 'react';
import { InstagramComment } from '@/types/instagram';
import { useInstagramComments } from '@/hooks/use-instagram-comments';

interface CommentItemProps {
  comment: InstagramComment;
  onReply: (commentId: string) => void;
}

function CommentItem({ comment, onReply }: CommentItemProps) {
  return (
    <div className="mb-2 border-l-2 border-gray-200 pl-3">
      <div className="flex justify-between">
        <p className="font-medium">{comment.username}</p>
        <button 
          onClick={() => onReply(comment.id)} 
          className="text-sm text-blue-500"
        >
          Reply
        </button>
      </div>
      <p className="text-sm">{comment.text}</p>
      <p className="text-xs text-gray-500">
        {new Date(comment.timestamp).toLocaleString()}
      </p>
      
      {comment.replies?.data && comment.replies.data.length > 0 && (
        <div className="ml-4 mt-2">
          {comment.replies.data.map((reply) => (
            <div key={reply.id} className="mb-2 border-l-2 border-gray-100 pl-2">
              <p className="text-sm font-medium">{reply.username}</p>
              <p className="text-sm">{reply.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(reply.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentFormProps {
  onSubmit: (text: string) => Promise<boolean>;
  placeholder?: string;
}

function CommentForm({ onSubmit, placeholder = 'Add a comment...' }: CommentFormProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    const success = await onSubmit(text);
    setIsSubmitting(false);
    
    if (success) {
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r-md disabled:bg-blue-300"
        disabled={isSubmitting || !text.trim()}
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}

interface InstagramCommentsProps {
  mediaId: string;
}

export default function InstagramComments({ mediaId }: InstagramCommentsProps) {
  const { comments, isLoading, error, fetchComments, postComment } = useInstagramComments(mediaId);
  const [isOpen, setIsOpen] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  
  const handleToggleComments = async () => {
    if (!isOpen) {
      await fetchComments();
    }
    setIsOpen(!isOpen);
  };
  
  const handleReply = (commentId: string) => {
    setReplyToId(commentId);
  };
  
  const handlePostComment = async (text: string) => {
    const success = await postComment(text, replyToId || undefined);
    if (success) {
      setReplyToId(null);
    }
    return success;
  };
  
  const handleCancelReply = () => {
    setReplyToId(null);
  };
  
  return (
    <div className="mt-2">
      <button
        onClick={handleToggleComments}
        className="text-blue-500 text-sm font-medium"
      >
        {isOpen ? 'Hide Comments' : 'Show Comments'}
      </button>
      
      {isOpen && (
        <div className="mt-2">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet</p>
          ) : (
            <div className="mb-3">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
          
          {replyToId ? (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">
                  Replying to comment
                </p>
                <button 
                  onClick={handleCancelReply}
                  className="text-xs text-red-500"
                >
                  Cancel
                </button>
              </div>
              <CommentForm 
                onSubmit={handlePostComment} 
                placeholder="Write a reply..." 
              />
            </div>
          ) : (
            <CommentForm onSubmit={handlePostComment} />
          )}
        </div>
      )}
    </div>
  );
}