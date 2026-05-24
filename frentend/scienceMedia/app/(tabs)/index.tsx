import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { PostCard } from '../../components/feed/PostCard';
import { useFeed } from '../../hooks/use-posts';
import type { Post, PostType } from '../../types/post.types';

export default function App(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { feed, isLoading, error, refresh, handleLike } = useFeed();

  // Filtre les posts selon la recherche saisie
  const query = searchQuery.trim().toLowerCase();
  const filteredFeed = query
    ? feed.filter((post) =>
        [post.title, post.excerpt, post.author.displayName, post.author.specialty, ...post.tags]
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    : feed;

  const showInitialLoader = isLoading && feed.length === 0;

  function renderPostCard({ item }: { item: Post }) {
    return <PostCard post={item} onLike={handleLike} />;
  }

  function renderListHeader() {
    return (
      <View>
        <View style={styles.topBar}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
            style={styles.topAvatar}
          />
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher"
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.createCard}>
          <View style={styles.createTop}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
              style={styles.createAvatar}
            />
            <TouchableOpacity
              style={styles.createInput}
              activeOpacity={0.85}
              onPress={() => router.push('/create-post')}
            >
              <Text style={styles.createPlaceholder}>Démarrer un post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.createActions}>
            {([
              { icon: '🖼️', label: 'Photo',    type: 'text_image' as PostType },
              { icon: '🎥', label: 'Vidéo',    type: 'text_video' as PostType },
              { icon: '📄', label: 'Document', type: 'text'       as PostType },
              { icon: '📅', label: 'Réunion',  type: 'meeting'    as PostType },
            ]).map((btn) => (
              <TouchableOpacity
                key={btn.label}
                style={styles.createBtn}
                onPress={() => router.push({ pathname: '/create-post', params: { type: btn.type } })}
              >
                <Text style={styles.createBtnIcon}>{btn.icon}</Text>
                <Text style={styles.createBtnLabel}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.helperText}>{error}</Text> : null}
      </View>
    );
  }

  function renderListEmpty() {
    if (showInitialLoader) {
      return (
        <View style={styles.stateCard}>
          <ActivityIndicator color="#0a7ea4" />
          <Text style={styles.stateTitle}>Chargement du fil...</Text>
        </View>
      );
    }
    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Aucun post trouvé</Text>
        <Text style={styles.stateSubtitle}>
          Essayez une autre recherche ou rafraîchissez le fil.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        renderItem={renderPostCard}
        contentContainerStyle={styles.feedContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },
  feedContent: {
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  topAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f2ef',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  createCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 12,
  },
  createTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  createAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  createInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createPlaceholder: {
    color: '#555',
    fontSize: 15,
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  createBtnIcon: {
    fontSize: 18,
  },
  createBtnLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  helperText: {
    marginHorizontal: 12,
    marginBottom: 8,
    color: '#b42318',
    fontSize: 13,
  },
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

// AOUAD ABDELKARIM
