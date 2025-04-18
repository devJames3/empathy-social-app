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
    <div className="mb-3 border-l-2 border-gray-200 pl-3 py-1 hover:bg-gray-50 rounded-r-md transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {comment.username?.charAt(0).toUpperCase()}
          </div>
          <p className="font-medium text-sm ml-2">{comment.username}</p>
        </div>
        <button 
          onClick={() => onReply(comment.id)} 
          className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
        >
          Reply
        </button>
      </div>
      <p className="text-sm my-1 pl-8">{comment.text}</p>
      <p className="text-xs text-gray-400 pl-8">
        {new Date(comment.timestamp).toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      
      {comment.replies?.data && comment.replies.data.length > 0 && (
        <div className="ml-6 mt-2 border-t border-gray-100 pt-2">
          {comment.replies.data.map((reply) => (
            <div key={reply.id} className="mb-2 pl-2 py-1">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {reply.username?.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs font-medium ml-2">{reply.username}</p>
              </div>
              <p className="text-sm my-1 pl-7">{reply.text}</p>
              <p className="text-xs text-gray-400 pl-7">
                {new Date(reply.timestamp).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
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
        className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-r-full disabled:opacity-70 transition-all text-sm font-medium"
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
      // Only fetch comments when opening
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
  
  const handleClose = () => {
    setIsOpen(false);
    setReplyToId(null);
  };
  
  return (
    <div className="relative">
      <button
        onClick={handleToggleComments}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-full flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Comments</h4>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading comments...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-500 rounded-md p-3 text-sm">
                  {error}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No comments yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to leave a comment</p>
                </div>
              ) : (
                <div className="mb-3 pr-1">
                  {comments.map((comment) => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      onReply={handleReply}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100">
              {replyToId ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-blue-500 font-medium">
                      Replying to comment
                    </p>
                    <button 
                      onClick={handleCancelReply}
                      className="text-xs text-gray-500 hover:text-red-500 transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
}