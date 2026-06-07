import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';

import { useNotifications } from '../../hooks/use-notifications';
import type { Notification } from '../../types/notification.types';

// Composant d'une seule notification
function NotificationItem({
  item,
  onPress,
}: {
  item: Notification;
  onPress: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unreadCard]}
      onPress={() => onPress(item.id)}
    >

      {/* avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar ?? undefined }} style={styles.avatar} />
        <View style={[styles.badge, { backgroundColor: item.iconColor }]}>
          <Text style={styles.badgeText}>{item.icon}</Text>
        </View>
      </View>

      {/* contenu */}
      <View style={styles.content}>
        <Text style={styles.message}>
          <Text style={styles.name}>{item.name}</Text>
          {' '}{item.action}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {/* point bleu si non lue */}
      {!item.read && <View style={styles.dot} />}

    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { notifications, isLoading, refresh, handleMarkAsRead, handleMarkAllRead } =
    useNotifications();

  // nombre de notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  // filtrage par onglet et par recherche
  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread' && item.read) return false;
    const text = `${item.name} ${item.action}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />

      {/* top bar */}
      <View style={styles.topBar}>

        <Image
          source={{
            uri: 'https://randomuser.me/api/portraits/men/75.jpg',
          }}
          style={styles.profile}
        />

        <TextInput
          placeholder="Rechercher..."
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={styles.searchInput}
        />

      </View>

      {/* header */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Notifications
        </Text>

        {/* bouton */}
        {
          unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleMarkAllRead}
            >
              <Text style={styles.buttonText}>
                Tout marquer comme lu
              </Text>
            </TouchableOpacity>
          ) : null
        }

        {/* filtres */}
        <View style={styles.filters}>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all'
                ? styles.activeFilter
                : null,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all'
                  ? styles.activeText
                  : null,
              ]}
            >
              Toutes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'unread'
                ? styles.activeFilter
                : null,
            ]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'unread'
                  ? styles.activeText
                  : null,
              ]}
            >
              Non lues ({unreadCount})
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* liste */}
      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={(id) => {
              handleMarkAsRead(id);
              router.push(`/notification/${id}`);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Aucune notification
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },

  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  searchInput: {
    flex: 1,
    backgroundColor: '#eef3f8',
    marginLeft: 10,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  header: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#E8F1FB',
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  buttonText: {
    color: '#0A66C2',
    fontWeight: 'bold',
  },

  filters: {
    flexDirection: 'row',
    marginTop: 15,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },

  activeFilter: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
  },

  filterText: {
    color: '#333',
    fontWeight: 'bold',
  },

  activeText: {
    color: '#fff',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 1,
  },

  unreadCard: {
    backgroundColor: '#EBF3FB',
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },

  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 10,
  },

  systemAvatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#E8F1FB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  systemText: {
    fontSize: 20,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  message: {
    fontSize: 14,
    color: '#222',
  },

  name: {
    fontWeight: 'bold',
  },

  time: {
    marginTop: 5,
    color: 'gray',
    fontSize: 12,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0A66C2',
  },

  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});