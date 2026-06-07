import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function SettingsScreen() {
  
  // Simulation de données utilisateur (à remplacer par tes données réelles/auth)
  const user = {
    name: "Alexandre",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?u=9",
  };
  const router = useRouter();
  // Fonction pour rendre une ligne de paramètre
  const SettingItem = ({ icon, title, subtitle, onPress, color = "#007AFF" }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- SECTION PROFIL --- */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={()=>{router.push("/editeProfile")}}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* --- ACTIONS / PARAMÈTRES --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <SettingItem 
            icon="person-outline" 
            title="Informations personnelles" 
            onPress={()=>{router.push("/information-personnel")}} 
          />
          <SettingItem 
            icon="shield-checkmark-outline" 
            title="Sécurité" 
            subtitle="Mot de passe, 2FA"
            onPress={()=>{router.push("/SecuritySettingsScreen")}}
          />
          <SettingItem
            icon="notifications-outline" 
            title="Notifications" 
            onPress={()=>{router.push("/NotificationSettingsScreen")}}
            color="#FF9500"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <SettingItem 
            icon="color-palette-outline" 
            title="Apparence" 
            subtitle="Thème sombre/clair"
            onPress={()=>{router.push("/AppearanceSettingsScreen")}}
            color="#5856D6"
          />
          <SettingItem 
            icon="language-outline" 
            title="Langue" 
            subtitle="Français"
            onPress={()=>{router.push("/LanguageSettingsScreen")}}
            color="#34C759"
          />
        </View>

        {/* --- DÉCONNEXION --- */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutItem} onPress={() => {router.push("/login")}}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Gris très léger pour le fond
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    marginTop: 25,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    marginLeft: 15,
    marginBottom: 8,
    marginTop: -15, // Pour le placer au-dessus de la section
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});