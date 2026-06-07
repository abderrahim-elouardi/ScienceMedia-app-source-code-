import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useNotificationsStore } from '../../store/notifications.store';

export default function NotificationDetailScreen() {

  // Récupère l'id depuis l'URL : /notification/[id]
  const { id } = useLocalSearchParams<{ id: string }>();

  // Cherche la notification dans le store global
  const notification = useNotificationsStore((state) =>
    state.notifications.find((n) => n.id === id)
  );

  // Si introuvable, affiche un message simple
  if (!notification) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Notification introuvable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.body}>

        {/* avatar + badge */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: notification.avatar ?? undefined }}
            style={styles.avatar}
          />
          <View style={[styles.badge, { backgroundColor: notification.iconColor }]}>
            <Text style={styles.badgeText}>{notification.icon}</Text>
          </View>
        </View>

        {/* nom */}
        <Text style={styles.name}>{notification.name}</Text>

        {/* action */}
        <Text style={styles.action}>{notification.action}</Text>

        {/* heure */}
        <Text style={styles.time}>{notification.time}</Text>

        {/* statut lu / non lu */}
        <View style={[styles.badge2, notification.read ? styles.readBadge : styles.unreadBadge]}>
          <Text style={styles.badgeLabel}>
            {notification.read ? 'Lu' : 'Non lu'}
          </Text>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },

  backButton: {
    padding: 15,
    backgroundColor: '#fff',
  },

  backText: {
    fontSize: 16,
    color: '#0A66C2',
    fontWeight: 'bold',
  },

  body: {
    alignItems: 'center',
    padding: 30,
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },

  action: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },

  time: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 20,
  },

  badge2: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  readBadge: {
    backgroundColor: '#e0e0e0',
  },

  unreadBadge: {
    backgroundColor: '#0A66C2',
  },

  badgeLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notFoundText: {
    fontSize: 16,
    color: 'gray',
  },

});
