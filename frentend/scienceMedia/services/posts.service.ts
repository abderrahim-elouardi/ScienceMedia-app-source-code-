// services/posts.service.ts
import { apiClient } from './api.client';
import type { Post, PaginatedResponse, CreatePostData } from '../types/post.types';

export const postsService = {
  getFeed: (cursor?: string) =>
    apiClient.get<PaginatedResponse<Post>>(
      `/feed${cursor ? `?cursor=${cursor}` : ''}`
    ),

  likePost: (postId: string) =>
    apiClient.post<{ likesCount: number }>(`/posts/${postId}/like`),

  unlikePost: (postId: string) =>
    apiClient.delete<{ likesCount: number }>(`/posts/${postId}/like`),

  bookmarkPost: (postId: string) =>
    apiClient.post(`/posts/${postId}/bookmark`),

  getPostById: (postId: string) =>
    apiClient.get<Post>(`/posts/${postId}`),

  createPost: (data: CreatePostData) =>
    apiClient.post<Post>('/posts', data),
};

// AOUAD ABDELKARIM