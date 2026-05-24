import { useEffect } from 'react';
import { useNotificationsStore } from '../store/notifications.store';
import { notificationsService } from '../services/notifications.service';
import type { Notification } from '../types/notification.types';

// Données d'exemple affichées si l'API n'est pas disponible
const exampleNotifications: Notification[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    action: 'accepted your connection request',
    time: '5m ago',
    read: false,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    icon: '👤',
    iconColor: '#0A66C2',
  },
  {
    id: '2',
    name: 'Michael Chen',
    action: 'liked your post',
    time: '1h ago',
    read: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    icon: '👍',
    iconColor: '#0A66C2',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    action: 'commented on your post',
    time: '2h ago',
    read: false,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    icon: '💬',
    iconColor: '#0A66C2',
  },
  {
    id: '4',
    name: 'LinkedIn Jobs',
    action: '5 new jobs match your preferences',
    time: '4h ago',
    read: true,
    avatar: null,
    isSystem: true,
    systemIcon: '💼',
    iconColor: '#0A66C2',
  },
  {
    id: '5',
    name: 'LinkedIn',
    action: 'Your profile had 47 views this week',
    time: '1d ago',
    read: true,
    avatar: null,
    isSystem: true,
    systemIcon: '📈',
    iconColor: '#0A66C2',
  },
  {
    id: '6',
    name: 'David Kim',
    action: 'wants to connect',
    time: '1d ago',
    read: true,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    icon: '👤',
    iconColor: '#0A66C2',
  },
  {
    id: '7',
    name: 'Lisa Martinez',
    action: 'and 12 others liked your post',
    time: '2d ago',
    read: true,
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    icon: '👍',
    iconColor: '#0A66C2',
  },
  {
    id: '8',
    name: 'James Wilson',
    action: 'shared your post',
    time: '3d ago',
    read: true,
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    icon: '🔁',
    iconColor: '#0A66C2',
  },
];

export function useNotifications() {
  const {
    notifications,
    isLoading,
    error,
    nextCursor,
    hasMore,
    setNotifications,
    appendNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    setLoading,
    setError,
    setPagination,
  } = useNotificationsStore();

  // Rafraîchit la liste ou charge la page suivante
  async function loadNotifications(refresh = false) {
    if (isLoading) return;
    setLoading(true);
    setError(null);
    try {
      const cursor = refresh ? undefined : nextCursor;
      const res = await notificationsService.getNotifications(cursor);
      if (refresh) setNotifications(res.data);
      else appendNotifications(res.data);
      setPagination(res.nextCursor, res.hasMore);
    } catch {
      if (refresh) {
        setNotifications(exampleNotifications);
        setPagination(undefined, false);
      }
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  // Marque une notification comme lue
  async function handleMarkAsRead(notificationId: string) {
    markNotificationRead(notificationId);
    try {
      await notificationsService.markAsRead(notificationId);
    } catch {
      setError('Impossible de marquer la notification comme lue.');
    }
  }

  // Marque toutes les notifications comme lues
  async function handleMarkAllRead() {
    markAllNotificationsRead();
    try {
      await notificationsService.markAllAsRead();
    } catch {
      setError('Impossible de marquer toutes les notifications comme lues.');
    }
  }

  // Chargement initial au démarrage du composant
  useEffect(() => {
    async function loadInitialNotifications() {
      setLoading(true);
      setError(null);
      try {
        const res = await notificationsService.getNotifications(undefined);
        setNotifications(res.data);
        setPagination(res.nextCursor, res.hasMore);
      } catch {
        setNotifications(exampleNotifications);
        setPagination(undefined, false);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    loadInitialNotifications();
  }, [setError, setNotifications, setLoading, setPagination]);

  return {
    notifications,
    isLoading,
    error,
    hasMore,
    refresh: () => loadNotifications(true),
    loadMore: () => { if (hasMore) loadNotifications(false); },
    handleMarkAsRead,
    handleMarkAllRead,
  };
}

// AOUAD ABDELKARIM
