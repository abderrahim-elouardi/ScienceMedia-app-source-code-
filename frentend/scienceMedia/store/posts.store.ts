// store/posts.store.ts
import { create } from 'zustand';
import type { Post } from '../types/post.types';

interface PostsState {
  feed: Post[];
  isLoading: boolean;
  error: string | null;
  nextCursor?: string;
  hasMore: boolean;

  setFeed: (posts: Post[]) => void;
  appendFeed: (posts: Post[]) => void;
  prependPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setPagination: (cursor?: string, hasMore?: boolean) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  feed: [],
  isLoading: false,
  error: null,
  hasMore: true,

  setFeed: (posts) => set({ feed: posts }),
  appendFeed: (posts) => set((s) => ({ feed: [...s.feed, ...posts] })),
  prependPost: (post) => set((s) => ({ feed: [post, ...s.feed] })),

  toggleLike: (postId) =>
    set((s) => ({
      feed: s.feed.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      ),
    })),

  setLoading: (v) => set({ isLoading: v }),
  setError: (msg) => set({ error: msg }),
  setPagination: (cursor, hasMore = true) =>
    set({ nextCursor: cursor, hasMore }),
}));

// AOUAD ABDELKARIM