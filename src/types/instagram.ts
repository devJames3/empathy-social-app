export interface InstagramProfile {
  id: string;
  username: string;
  account_type: string;
  media_count?: number;
  profile_picture_url?: string;
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface InstagramComment {
  id: string;
  text: string;
  timestamp: string;
  username?: string;
  replies?: {
    data: InstagramComment[];
  }
}