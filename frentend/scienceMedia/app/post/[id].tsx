import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { Colors } from '../../constants/theme';
import { postsService } from '../../services/posts.service';
import { usePostsStore } from '../../store/posts.store';
import type { Post } from '../../types/post.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  authorName: string;
  authorSpecialty: string;
  avatarUrl?: string;
  text: string;
  time: string;
  likesCount: number;
}

// ─── Données d'exemple ────────────────────────────────────────────────────────

const exampleComments: Comment[] = [
  {
    id: '1',
    authorName: 'Marie Dupont',
    authorSpecialty: 'Data Scientist · Université Paris-Saclay',
    avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    text: 'Très intéressant comme approche ! Avez-vous pensé à publier ça dans une revue scientifique ?',
    time: '10 min',
    likesCount: 7,
  },
  {
    id: '2',
    authorName: 'Karim Benali',
    authorSpecialty: 'Software Engineer · Thales',
    avatarUrl: 'https://randomuser.me/api/portraits/men/54.jpg',
    text: 'Merci pour ce partage, je vais transmettre à mon équipe.',
    time: '35 min',
    likesCount: 3,
  },
  {
    id: '3',
    authorName: 'Sofia Martins',
    authorSpecialty: 'PhD Student · INRIA',
    avatarUrl: 'https://randomuser.me/api/portraits/women/61.jpg',
    text: "Super contenu ! J'aurais aimé avoir accès à ça plus tôt dans ma thèse.",
    time: '1 h',
    likesCount: 12,
  },
  {
    id: '4',
    authorName: 'Thomas Renard',
    authorSpecialty: 'Enseignant-chercheur · CNRS',
    text: 'Je suis totalement en accord avec vos conclusions. Continuez !',
    time: '2 h',
    likesCount: 5,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  text: 'Texte',
  text_image: 'Article',
  text_video: 'Vidéo',
  image: 'Image',
  video: 'Clip',
  meeting: 'Réunion',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatMeetingDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const feed = usePostsStore((s) => s.feed);
  const toggleLike = usePostsStore((s) => s.toggleLike);

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments] = useState<Comment[]>(exampleComments);

  // Charge le post depuis le cache ou depuis l'API
  useEffect(() => {
    async function loadPost() {
      const cached = feed.find((p) => p.id === id);
      if (cached) {
        setPost(cached);
        setIsLoading(false);
        return;
      }
      try {
        const res = await postsService.getPostById(id);
        setPost(res);
      } catch {
        setError('Impossible de charger ce post.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── J'aime ────────────────────────────────────────────────────────────────
  function handleLike() {
    if (!post) return;
    const newIsLiked = !post.isLiked;
    // Met à jour le compteur localement
    setPost({
      ...post,
      isLiked: newIsLiked,
      likesCount: newIsLiked ? post.likesCount + 1 : post.likesCount - 1,
    });
    // Synchronise avec le fil global
    toggleLike(post.id);
  }

  // ── Republication ─────────────────────────────────────────────────────────
  function handleRepost() {
    Alert.alert(
      'Republier ce post',
      'Choisissez une option :',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: '🔁 Republier',
          onPress: () => {
            if (!post) return;
            setPost({ ...post, sharesCount: post.sharesCount + 1 });
            Alert.alert('Republié !', 'Le post a été republié avec succès.');
          },
        },
        {
          text: '✍️ Republier avec un texte',
          onPress: () => router.push('/create-post'),
        },
      ]
    );
  }

  // ─── États de chargement / erreur ─────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error ?? 'Post introuvable.'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
            <Text style={styles.retryBtnText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Contenu ──────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Barre de navigation ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Retour</Text>
        </TouchableOpacity>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{TYPE_LABELS[post.type] ?? post.type}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Auteur ── */}
        <View style={styles.authorRow}>
          <Avatar uri={post.author.avatarUrl} name={post.author.displayName} size={52} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.displayName}</Text>
            <Text style={styles.authorSpecialty}>{post.author.specialty}</Text>
            <Text style={styles.postDate}>{formatDate(post.publishedAt)}</Text>
          </View>
        </View>

        {/* ── Titre ── */}
        <Text style={styles.title}>{post.title}</Text>

        {/* ── Image ── */}
        {post.imageUrl ? (
          <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : null}

        {/* ── Texte du post ── */}
        <Text style={styles.body}>{post.content ?? post.excerpt}</Text>

        {/* ── Carte réunion ── */}
        {post.meeting ? (
          <View style={styles.meetingCard}>
            <Text style={styles.meetingLabel}>📅 Réunion</Text>
            <Text style={styles.meetingTitle}>{post.meeting.title}</Text>
            {post.meeting.description ? (
              <Text style={styles.meetingDesc}>{post.meeting.description}</Text>
            ) : null}
            <Text style={styles.meetingInfoText}>
              🗓 {formatMeetingDate(post.meeting.startDate)}
            </Text>
            {post.meeting.participantsCount ? (
              <Text style={styles.meetingInfoText}>
                👥 {post.meeting.participantsCount} participants
              </Text>
            ) : null}
            {post.meeting.meetingUrl ? (
              <TouchableOpacity style={styles.joinBtn}>
                <Text style={styles.joinBtnText}>Rejoindre la réunion →</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {/* ── Document PDF ── */}
        {post.documentUrl ? (
          <View style={styles.documentCard}>
            <Text style={styles.documentIcon}>📄</Text>
            <View>
              <Text style={styles.documentName}>{post.documentName ?? 'Document PDF'}</Text>
              <Text style={styles.documentSub}>Appuyer pour ouvrir</Text>
            </View>
          </View>
        ) : null}

        {/* ── Tags ── */}
        {post.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {post.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Barre d'actions ── */}
        <View style={styles.actionsBar}>

          {/* J'aime */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
              {post.isLiked ? '♥' : '♡'}
            </Text>
            <Text style={[styles.actionCount, post.isLiked && styles.likedCount]}>
              {post.likesCount}
            </Text>
          </TouchableOpacity>

          {/* Commentaires */}
          <View style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>{comments.length}</Text>
          </View>

          {/* Republier */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleRepost}>
            <Text style={styles.actionIcon}>🔁</Text>
            <Text style={styles.actionCount}>{post.sharesCount}</Text>
          </TouchableOpacity>

          {post.readTimeMinutes ? (
            <Text style={styles.readTime}>📖 {post.readTimeMinutes} min</Text>
          ) : null}

        </View>

        {/* ── Section commentaires ── */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            💬 Commentaires ({comments.length})
          </Text>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <Avatar uri={comment.avatarUrl} name={comment.authorName} size={38} />
              <View style={styles.commentBody}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthorName}>{comment.authorName}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentSpecialty}>{comment.authorSpecialty}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <Text style={styles.commentLike}>♡ {comment.likesCount}</Text>
                  <Text style={styles.commentReply}>Répondre</Text>
                </View>
              </View>
            </View>
          ))}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },

  // Chargement / erreur
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#667085',
    fontSize: 14,
  },
  errorIcon: {
    fontSize: 40,
  },
  errorText: {
    fontSize: 15,
    color: '#B42318',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.light.tint,
    fontWeight: '700',
  },
  backLabel: {
    fontSize: 15,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF4FF',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.tint,
    textTransform: 'uppercase',
  },

  // Scroll
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },

  // Auteur
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  authorSpecialty: {
    fontSize: 13,
    color: '#667085',
  },
  postDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Titre
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
    lineHeight: 30,
  },

  // Image
  image: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
  },

  // Corps
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: '#344054',
  },

  // Réunion
  meetingCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  meetingLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.tint,
    textTransform: 'uppercase',
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  meetingDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475467',
  },
  meetingInfoText: {
    fontSize: 13,
    color: '#344054',
    fontWeight: '500',
  },
  joinBtn: {
    marginTop: 4,
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Document
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  documentIcon: {
    fontSize: 28,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  documentSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F2F4F7',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
  },

  // Barre d'actions
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 18,
    color: '#475467',
  },
  likedIcon: {
    color: Colors.light.tint,
  },
  actionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475467',
  },
  likedCount: {
    color: Colors.light.tint,
  },
  readTime: {
    marginLeft: 'auto',
    fontSize: 13,
    color: '#667085',
    fontWeight: '600',
  },

  // Section commentaires
  commentsSection: {
    gap: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  commentCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  commentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentSpecialty: {
    fontSize: 12,
    color: '#667085',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#344054',
    marginTop: 4,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },
  commentLike: {
    fontSize: 13,
    color: '#667085',
    fontWeight: '600',
  },
  commentReply: {
    fontSize: 13,
    color: Colors.light.tint,
    fontWeight: '600',
  },
});

// AOUAD ABDELKARIM
