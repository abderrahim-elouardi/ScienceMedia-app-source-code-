import { useEffect, useState } from 'react';
import { usePostsStore } from '../store/posts.store';
import { postsService } from '../services/posts.service';
import type { Post, CreatePostData } from '../types/post.types';

// Données d'exemple affichées si l'API n'est pas disponible
const exampleFeed: Post[] = [
  {
    id: 'post-1',
    author: {
      displayName: 'Sarah Johnson',
      specialty: 'Senior Product Manager at Google',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    type: 'text_image',
    title: 'Launching a new collaboration workflow',
    excerpt:
      'Excited to share that our team just launched a new feature that will help millions of users be more productive. The collaboration between engineering, design, and product has been incredible.',
    content:
      'Excited to share that our team just launched a new feature that will help millions of users be more productive! 🚀',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    likesCount: 248,
    commentsCount: 37,
    sharesCount: 12,
    isLiked: false,
    isBookmarked: false,
    tags: ['product', 'teamwork', 'launch'],
    publishedAt: '2026-05-07T08:00:00.000Z',
    readTimeMinutes: 3,
  },
  {
    id: 'post-2',
    author: {
      displayName: 'Ahmed Benali',
      specialty: 'Software Engineer at Meta',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    type: 'text',
    title: 'A useful system design book',
    excerpt:
      'Just finished reading an amazing book on system design. Highly recommend it to every developer who wants to level up their skills.',
    content:
      'Just finished reading an amazing book on system design. Highly recommend it to every developer who wants to level up their skills! 📚',
    likesCount: 120,
    commentsCount: 15,
    sharesCount: 8,
    isLiked: true,
    isBookmarked: false,
    tags: ['engineering', 'learning'],
    publishedAt: '2026-05-07T05:00:00.000Z',
    readTimeMinutes: 2,
  },
  {
    id: 'post-3',
    author: {
      displayName: 'Dr. Lina Morel',
      specialty: 'Research Scientist',
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    type: 'meeting',
    title: 'Open research roundtable this Friday',
    excerpt:
      'Join our live roundtable to discuss reproducibility, model evaluation, and how to prepare a research project for backend integration.',
    meeting: {
      title: 'ScienceMedia Research Roundtable',
      description: 'A short live session for the community.',
      startDate: '2026-05-09T14:00:00.000Z',
      endDate: '2026-05-09T15:00:00.000Z',
      meetingUrl: 'https://example.com/meeting',
      participantsCount: 42,
    },
    likesCount: 86,
    commentsCount: 11,
    sharesCount: 4,
    isLiked: false,
    isBookmarked: true,
    tags: ['research', 'event', 'community'],
    publishedAt: '2026-05-06T20:00:00.000Z',
    readTimeMinutes: 1,
  },
];

export function useFeed() {
  const {
    feed, isLoading, error, nextCursor, hasMore,
    setFeed, appendFeed, toggleLike,
    setLoading, setError, setPagination,
  } = usePostsStore();

  // Charge ou rafraîchit le fil d'actualité
  async function refresh() {
    if (isLoading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await postsService.getFeed(undefined);
      setFeed(res.data);
      setPagination(res.nextCursor, res.hasMore);
    } catch {
      setFeed(exampleFeed);
      setPagination(undefined, false);
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  // Charge la page suivante du fil
  async function loadMore() {
    if (isLoading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await postsService.getFeed(nextCursor);
      appendFeed(res.data);
      setPagination(res.nextCursor, res.hasMore);
    } catch {
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  // Gère le like / unlike d'un post
  async function handleLike(postId: string) {
    const post = feed.find((p) => p.id === postId);
    if (!post) return;
    toggleLike(postId); // mise à jour optimiste
    try {
      if (post.isLiked) await postsService.unlikePost(postId);
      else await postsService.likePost(postId);
    } catch {
      toggleLike(postId); // annulation si erreur
    }
  }

  // Chargement initial au démarrage du composant
  useEffect(() => {
    async function loadInitialFeed() {
      setLoading(true);
      setError(null);
      try {
        const res = await postsService.getFeed(undefined);
        setFeed(res.data);
        setPagination(res.nextCursor, res.hasMore);
      } catch {
        setFeed(exampleFeed);
        setPagination(undefined, false);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    loadInitialFeed();
  }, [setError, setFeed, setLoading, setPagination]);

  return {
    feed,
    isLoading,
    error,
    hasMore,
    refresh,
    loadMore,
    handleLike,
  };
}

export function useCreatePost() {
  const prependPost = usePostsStore((s) => s.prependPost);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(data: CreatePostData) {
    setIsSubmitting(true);
    try {
      // Crée un post local immédiatement (sans attendre le serveur)
      const localPost: Post = {
        id: `local-${Date.now()}`,
        author: { displayName: 'Vous', specialty: 'Membre ScienceMedia' },
        type: data.type,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: false,
        isBookmarked: false,
        publishedAt: new Date().toISOString(),
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        documentUrl: data.documentUrl,
        documentName: data.documentName,
        meeting: data.meeting,
      };
      prependPost(localPost);
      postsService.createPost(data).catch(() => {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}

// AOUAD ABDELKARIM
