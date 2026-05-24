import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '../ui/Avatar';
import { Colors } from '../../constants/theme';
import type { Post, PostType } from '../../types/post.types';

const TYPE_LABELS: Record<PostType, string> = {
  text: 'Texte',
  text_image: 'Article',
  text_video: 'Vidéo',
  image: 'Image',
  video: 'Clip',
  meeting: 'Réunion',
};

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} h`;
  return `${Math.floor(diffHours / 24)} j`;
}

function formatMeetingDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => router.push(`/post/${post.id}`)}
    >
      {/* En-tête auteur */}
      <View style={styles.header}>
        <Avatar uri={post.author.avatarUrl} name={post.author.displayName} size={38} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.displayName}</Text>
          <Text style={styles.authorMeta}>
            {post.author.specialty} · {formatRelativeTime(post.publishedAt)}
          </Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{TYPE_LABELS[post.type]}</Text>
        </View>
      </View>

      {/* Contenu */}
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.excerpt} numberOfLines={3}>{post.excerpt}</Text>

      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl + '?w=500&h=220&fit=crop' }}
          style={styles.previewImage}
        />
      ) : null}

      {post.documentUrl ? (
        <View style={styles.documentCard}>
          <Text style={styles.documentIcon}>📄</Text>
          <Text style={styles.documentName} numberOfLines={1}>
            {post.documentName ?? 'Document PDF'}
          </Text>
        </View>
      ) : null}

      {post.meeting ? (
        <View style={styles.meetingCard}>
          <Text style={styles.meetingTitle}>{post.meeting.title}</Text>
          {post.meeting.description ? (
            <Text style={styles.meetingDescription}>{post.meeting.description}</Text>
          ) : null}
          <Text style={styles.meetingMeta}>
            {formatMeetingDate(post.meeting.startDate)}
            {post.meeting.participantsCount ? ` · ${post.meeting.participantsCount} participants` : ''}
          </Text>
        </View>
      ) : null}

      {/* Tags */}
      {post.tags.length > 0 && (
        <View style={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={() => onLike(post.id)}>
          <Text style={[styles.actionIcon, post.isLiked && styles.liked]}>
            {post.isLiked ? '♥' : '♡'}
          </Text>
          <Text style={styles.actionCount}>{post.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={() => router.push(`/post/${post.id}`)}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.commentsCount}</Text>
        </TouchableOpacity>

        {post.readTimeMinutes ? (
          <Text style={styles.readTime}>{post.readTimeMinutes} min</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  authorMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#667085',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF4FF',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.tint,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 24,
  },
  excerpt: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#344054',
  },
  previewImage: {
    marginTop: 14,
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
  },
  meetingCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  meetingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  meetingDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#475467',
  },
  meetingMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#667085',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F2F4F7',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#344054',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 15,
  },
  actionCount: {
    fontSize: 13,
    color: '#475467',
    fontWeight: '600',
  },
  liked: {
    color: Colors.light.tint,
  },
  readTime: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '600',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  documentIcon: {
    fontSize: 20,
  },
  documentName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
});

// AOUAD ABDELKARIM
