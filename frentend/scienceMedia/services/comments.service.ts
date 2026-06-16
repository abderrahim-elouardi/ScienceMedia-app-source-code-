import { apiClient } from './api.client';
import type { Comment } from '../types/comment.types';

export const commentsService = {
  getComments: (postId: string) =>
    apiClient.get<Comment[]>(`/posts/${postId}/comments`),

  addComment: (postId: string, content: string) =>
    apiClient.post<Comment>(`/posts/${postId}/comments`, { content }),
};

// AOUAD ABDELKARIM
