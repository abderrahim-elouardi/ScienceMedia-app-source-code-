import { useEffect } from 'react';
import { useNetworkStore } from '../store/network.store';
import { usersService } from '../services/users.service';
import type { Connection } from '../types/user.types';

// Données d'exemple affichées si l'API n'est pas disponible
const exampleSuggestions: Connection[] = [
  {
    id: '1',
    displayName: 'David Kim',
    specialty: 'Full Stack Developer at Stripe',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    mutualConnections: 15,
    isConnected: false,
  },
  {
    id: '2',
    displayName: 'Lisa Martinez',
    specialty: 'Marketing Director at Shopify',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    mutualConnections: 8,
    isConnected: false,
  },
  {
    id: '3',
    displayName: 'James Okafor',
    specialty: 'Product Manager at Notion',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    mutualConnections: 21,
    isConnected: false,
  },
];

export function useNetwork() {
  const {
    suggestions,
    isLoading,
    error,
    nextCursor,
    setSuggestions,
    appendSuggestions,
    removeSuggestion,
    toggleConnect,
    setLoading,
    setError,
    setPagination,
  } = useNetworkStore();

  // Rafraîchit la liste ou charge la page suivante
  async function loadSuggestions(refresh = false) {
    if (isLoading) return;
    setLoading(true);
    setError(null);
    try {
      const cursor = refresh ? undefined : nextCursor;
      const res = await usersService.getSuggestions(cursor);
      if (refresh) setSuggestions(res.data);
      else appendSuggestions(res.data);
      setPagination(res.nextCursor, res.hasMore);
    } catch (err) {
      setError((err as Error).message);
      if (refresh) setSuggestions(exampleSuggestions);
      else appendSuggestions(exampleSuggestions);
    } finally {
      setLoading(false);
    }
  }

  // Envoie une demande de connexion
  async function handleConnect(userId: string) {
    try {
      await usersService.connectUser(userId);
      toggleConnect(userId);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // Supprime une suggestion de la liste
  function handleDismiss(userId: string) {
    removeSuggestion(userId);
  }

  // Chargement initial au démarrage du composant
  useEffect(() => {
    async function loadInitialSuggestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await usersService.getSuggestions(undefined);
        setSuggestions(res.data);
        setPagination(res.nextCursor, res.hasMore);
      } catch {
        setSuggestions(exampleSuggestions);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    loadInitialSuggestions();
  }, [setError, setSuggestions, setLoading, setPagination]);

  return {
    suggestions,
    isLoading,
    error,
    refresh: () => loadSuggestions(true),
    handleConnect,
    handleDismiss,
  };
}

// AOUAD ABDELKARIM
