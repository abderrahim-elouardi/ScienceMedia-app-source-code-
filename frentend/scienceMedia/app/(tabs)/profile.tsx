import { getUser } from "@/services/auth.service";
import { getProfileDetailsState, getReturnValueProfileDetailsState } from '@/services/profile.service';
import { router } from 'expo-router';
import { useState } from 'react'; // Importation de useState pour gérer l'affichage
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


import { profilePosts } from '@/services/profile.service';
import { User } from '@/types/Auth.Type';
import { ProfileStatsResponse } from "@/types/profileResponse.type";

const { width } = Dimensions.get('window');
const COLUMN_SIZE = width / 3; 

export default function ProfileScreen() {
  // État pour savoir si on affiche tous les posts ou juste le premier
  const [showAllPosts, setShowAllPosts] = useState(false);
  getProfileDetailsState();
  const profileDetailsState:ProfileStatsResponse|null = getReturnValueProfileDetailsState() 
//   console.log(profileDetailsState);
  
  const profile:User|null =getUser() 

  const imageUri = profileDetailsState?.profileImage 
    ? `data:${profileDetailsState.profileImage.imageType};base64,${profileDetailsState.profileImage.imageData}`
    : undefined;

//   const handelNumberFollowingFollowers = (number:Promise<any>) => {
//     if(number>=1000){

//     }
//   };

  // Si showAllPosts est vrai, on passe tout le tableau. Sinon, uniquement le premier élément.
  const visiblePosts = showAllPosts ? profilePosts : profilePosts.slice(0, 1);

  // 1. Le Header du profil (Photo, Nom, Stats)
  const ProfileHeader = () => (
    <View style={styles.headerContainer}>
      <Image 
        source={{ uri: imageUri }} 
        style={styles.profileImage} 
      />
      
      <Text style={styles.username}>{profile?.username}</Text>
      <Text style={styles.title}>{profile?.title}</Text>
      <Text style={styles.bio}>{profile?.bio}</Text>

      {/* Section Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profileDetailsState?.numberOfPosts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profileDetailsState?.numberOfFollowers}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profileDetailsState?.numberOfFollowing}</Text>
          <Text style={styles.statLabel}>Abonnements</Text>
        </View>
      </View>

      {/* Bouton Action */}
      <TouchableOpacity style={styles.editButton} onPress={()=>{router.replace('/editeProfile')}}>
        <Text style={styles.editButtonText}>Modifier le profil</Text>
      </TouchableOpacity>

      <View style={styles.divider} />
    </View>
  );

  // 2. Le pied de page de la liste (Bouton "Voir plus")
  const ProfileFooter = () => {
    // Si tous les posts sont déjà affichés, on n'affiche plus le bouton
    if (showAllPosts) return null;

    return (
      <TouchableOpacity 
        style={styles.moreButton} 
        onPress={() => setShowAllPosts(true)}
      >
        <Text style={styles.moreButtonText}>Plus de posts</Text>
      </TouchableOpacity>
    );
  };

  // 3. Rendu de chaque post
  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postGridItem} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visiblePosts} // Utilisation des données filtrées par l'état
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={3} 
        ListHeaderComponent={ProfileHeader} 
        ListFooterComponent={ProfileFooter} // Bouton "Plus de posts" géré ici
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// 4. Les Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bio: {
    fontSize: 10,
    color: '#7d7c7c',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  editButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButtonText: {
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eaeaea',
    marginBottom: 5,
  },
  postGridItem: {
    width: COLUMN_SIZE,
    height: COLUMN_SIZE,
    padding: 1, 
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  moreButton: {
    marginVertical: 20,
    marginHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  moreButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
});