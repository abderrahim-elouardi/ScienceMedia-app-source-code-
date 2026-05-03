import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

type PostData = {
  id: string;
  name: string;
  title: string;
  time: string;
  text: string;
  image: string | null;
  avatar: string;
  likes: number;
  comments: number;
};

type Tab = {
  key: string;
  icon: string;
  label: string;
  badge?: boolean;
};

// ─── Données temporaire ────────────────────────────────────────────────────────

const POSTS: PostData[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Product Manager at Google',
    time: '2h ago',
    text: "Excited to share that our team just launched a new feature that will help millions of users be more productive! 🚀 The collaboration between engineering, design, and product has been incredible.",
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    likes: 248,
    comments: 37,
  },
  {
    id: '2',
    name: 'Ahmed Benali',
    title: 'Software Engineer at Meta',
    time: '5h ago',
    text: "Just finished reading an amazing book on system design. Highly recommend it to every developer who wants to level up their skills! 📚",
    image: null,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    likes: 120,
    comments: 15,
  },
];

// TABS moved to components/ui/custom-tab-bar.tsx

// ─── Composant Post ───────────────────────────────────────────────────────────

function Post({ post }: { post: PostData }): React.JSX.Element {
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.likes);

  function toggleLike(): void {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
  }

  return (
    <View style={styles.postCard}>

      {/* En-tête du post */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
        <View style={styles.postHeaderText}>
          <Text style={styles.postName}>{post.name}</Text>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreDots}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Texte du post */}
      <Text style={styles.postText}>{post.text}</Text>

      {/* Image du post (optionnelle) */}
      {post.image !== null && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {/* Séparateur */}
      <View style={styles.separator} />

      {/* Boutons J'aime / Commenter / Partager */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
          <Text style={styles.actionIcon}>👍</Text>
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {liked ? 'Aimé' : "J'aime"} · {likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Commenter · {post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Partager</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Composant principal App ──────────────────────────────────────────────────

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Barre de recherche en haut ── */}
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
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* ── Fil d'actualité ── */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>

        {/* Carte "Créer un post" */}
        <View style={styles.createCard}>
          <View style={styles.createTop}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
              style={styles.createAvatar}
            />
            <TouchableOpacity style={styles.createInput}>
              <Text style={styles.createPlaceholder}>Démarrer un post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.createActions}>
            {[
              { icon: '🖼️', label: 'Photo' },
              { icon: '🎥', label: 'Vidéo' },
              { icon: '📄', label: 'Document' },
              { icon: '📅', label: 'Réunion' },
            ].map((btn) => (
              <TouchableOpacity key={btn.label} style={styles.createBtn}>
                <Text style={styles.createBtnIcon}>{btn.icon}</Text>
                <Text style={styles.createBtnLabel}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Liste des posts */}
        {POSTS.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* La barre de navigation est fournie par le layout global */}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // Conteneur global
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },

  // ── Barre du haut ──
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

  // ── Fil d'actualité ──
  feed: {
    flex: 1,
  },

  // ── Carte "créer un post" ──
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

  // ── Post ──
  postCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingBottom: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  postHeaderText: {
    flex: 1,
  },
  postName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  postTitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 1,
  },
  postTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  moreBtn: {
    padding: 4,
  },
  moreDots: {
    fontSize: 16,
    color: '#555',
    letterSpacing: 1,
  },
  postText: {
    fontSize: 14,
    color: '#222',
    paddingHorizontal: 12,
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 220,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
    marginVertical: 6,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  likedText: {
    color: '#0a66c2',
  },
  likedText: {
    color: '#0a66c2',
  },
});