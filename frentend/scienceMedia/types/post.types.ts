export type PostType =
  | 'text'
  | 'text_image'
  | 'text_video'
  | 'image'
  | 'video'
  | 'meeting';

export interface PostAuthor {
  displayName: string;
  specialty: string;
  avatarUrl?: string;
}

export interface MeetingData {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  meetingUrl?: string;
  participantsCount?: number;
}

export interface Post {
  id: string;
  author: PostAuthor;
  type: PostType;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  documentName?: string;
  meeting?: MeetingData;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  publishedAt: string;
  readTimeMinutes?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreatePostData {
  type: PostType;
  title: string;
  excerpt: string;
  content?: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  documentName?: string;
  meeting?: MeetingData;
}

// AOUAD ABDELKARIM