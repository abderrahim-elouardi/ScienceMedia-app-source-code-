import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNetwork } from '../../hooks/use-network';
import { getProfileDetailsState } from '../../services/profile.service';
import type { Connection } from '../../types/user.types';

// ─── Suggestion Card ──────────────────────────────────────────────────────────
const SuggestionCard = ({
  person,
  onConnect,
  onDismiss,
}: {
  person: Connection;
  onConnect: (userId: string) => void;
  onDismiss: (userId: string) => void;
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image source={{ uri: person.avatarUrl || 'https://i.pravatar.cc/150?img=0' }} style={styles.avatar} />
      <View style={styles.cardInfo}>
        <Text style={styles.personName}>{person.displayName}</Text>
        <Text style={styles.personRole}>{person.specialty}</Text>
        <Text style={styles.mutualText}>{person.mutualConnections} mutual connections</Text>
      </View>
    </View>

    <View style={styles.cardActions}>
      <TouchableOpacity
        style={[styles.connectBtn, person.isConnected && styles.connectedBtn]}
        onPress={() => onConnect(person.id)}
      >
        <Text style={[styles.connectBtnText, person.isConnected && styles.connectedBtnText]}>
          {person.isConnected ? '✓ Connected' : '👤  Connect'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dismissBtn} onPress={() => onDismiss(person.id)}>
        <Text style={styles.dismissBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);


// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MyNetworkScreen(): React.JSX.Element {
  const { suggestions, isLoading, error, refresh, handleConnect, handleDismiss } = useNetwork();
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);

  // Récupère la même statistique "Connections" que celle affichée sur l'écran Profil,
  // pour que la valeur reste cohérente entre les deux écrans.
  // Le backend ne gère pas encore de vraies invitations en attente
  // (les connexions sont créées immédiatement), donc cette case affiche 0.
  useEffect(() => {
    getProfileDetailsState().then((stats) => {
      if (stats) {
        setNumberOfFollowers(stats.numberOfFollowers);
      }
    });
  }, []);

  const showInitialLoader = isLoading && suggestions.length === 0;

  const renderListHeader = useCallback(
    () => (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Network</Text>
        </View>

        {/* ── Manage my network ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage my network</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{numberOfFollowers}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Invitations</Text>
            </View>
          </View>
        </View>

        {error ? <Text style={styles.helperText}>{error}</Text> : null}
        <Text style={styles.sectionTitle}>People you may know</Text>
      </View>
    ),
    [error, numberOfFollowers]
  );

  const renderSuggestionCard = useCallback(
    ({ item }: { item: Connection }) => (
      <SuggestionCard person={item} onConnect={handleConnect} onDismiss={handleDismiss} />
    ),
    [handleConnect, handleDismiss]
  );

  const renderListEmpty = useCallback(
    () =>
      showInitialLoader ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color="#0a7ea4" />
          <Text style={styles.stateTitle}>Chargement des suggestions...</Text>
        </View>
      ) : (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Aucune suggestion pour le moment</Text>
          <Text style={styles.stateSubtitle}>Revenez plus tard pour voir de nouvelles personnes à suivre.</Text>
        </View>
      ),
    [showInitialLoader]
  );

  const keyExtractor = useCallback((item: Connection) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={suggestions}
        keyExtractor={keyExtractor}
        renderItem={renderSuggestionCard}
        contentContainerStyle={styles.feedContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        initialNumToRender={8}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        windowSize={21}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE = '#0A66C2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },
  feedContent: {
    paddingBottom: 24,
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  // Section card
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginHorizontal: 12,
    marginBottom: 8,
    marginTop: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F2EE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: BLUE,
  },
  statLabel: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },

  // Suggestion card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  cardInfo: { flex: 1, justifyContent: 'center' },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  personRole: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  mutualText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  // Actions
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  connectBtn: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 24,
    paddingVertical: 11,
    alignItems: 'center',
  },
  connectedBtn: {
    backgroundColor: '#e8f0fa',
  },
  connectBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  connectedBtnText: {
    color: BLUE,
  },
  dismissBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },

  // Error message
  helperText: {
    marginHorizontal: 12,
    marginBottom: 8,
    color: '#b42318',
    fontSize: 13,
  },

  // State card
  stateCard: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 8,
  },
  stateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  stateSubtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#667085',
  },
});