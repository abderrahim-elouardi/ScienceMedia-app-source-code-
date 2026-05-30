import { getUser } from "@/services/auth.service";
import { getProfileDetailsState } from '@/services/profile.service';
import { ProfileImage } from '@/types/profileImage';
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
  const [numberOfFollowers,setNumberOfFollowers] =useState(0)
  const [numberOfFollowing,setNumberOfFollowing] =useState(0)
  const [numberOfPosts,setNumberOfPosts] =useState(0)
  const [imageInfo, setImageInfo] = useState<ProfileImage | null>(null);  getProfileDetailsState();
  getProfileDetailsState().then((stats: ProfileStatsResponse | null) => {
  if (stats) {
    setNumberOfFollowers(stats.numberOfFollowers)
    setNumberOfFollowing(stats.numberOfFollowing)
    setNumberOfPosts(stats.numberOfPosts)
    setImageInfo(stats.profileImage)

  } else {
    console.log("Impossible de charger les statistiques");
  }
});
  
  const profile:User|null =getUser() 
  const cleanBase64 = imageInfo?.imageData.replace(/[\n\r\s]/g, "");
  const imageUri = imageInfo
    ? `data:${imageInfo.imageType};base64,${cleanBase64}`
    : undefined;
  // const imageUri = "data:image/png;base64,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";

  console.log(imageUri);
  
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
          <Text style={styles.statNumber}>{numberOfPosts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{numberOfFollowers}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{numberOfFollowing}</Text>
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