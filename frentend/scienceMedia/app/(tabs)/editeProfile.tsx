import { getUser } from "@/services/auth.service";
import { getReturnValueProfileDetailsState } from '@/services/profile.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function EditProfileScreen() {
  // Récupération des données actuelles pour initialiser les champs
  const currentProfile = getUser();
  const currentStats = getReturnValueProfileDetailsState();

  const initialImageUri = currentStats?.profileImage 
    ? `data:${currentStats.profileImage.imageType};base64,${currentStats.profileImage.imageData}`
    : undefined;

  // États locaux du formulaire
  const [username, setUsername] = useState(currentProfile?.username || '');
  const [title, setTitle] = useState(currentProfile?.title || '');
  const [bio, setBio] = useState(currentProfile?.bio || '');
  
  // Contient l'URI locale ou la string Base64 finale pour l'affichage
  const [imageUri, setImageUri] = useState<string | undefined>(initialImageUri);
  // Pour stocker l'objet image traité (imageData et imageType) prêt pour le backend
  const [updatedImage, setUpdatedImage] = useState<{ imageData: string; imageType: string } | null>(null);

  // Fonction pour ouvrir la galerie et traiter l'image sélectionnée
  const pickImage = async () => {
    // Demande d'autorisation d'accès aux médias
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission requise", "Vous devez autoriser l'accès à vos photos pour modifier votre image de profil.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permet de recadrer l'image en carré (parfait pour un avatar)
      aspect: [1, 1],
      quality: 0.7, // Compresse légèrement pour économiser la bande passante du serveur
      base64: true, // Demande explicitement le format Base64 à Expo
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      
      // Mise à jour de l'affichage local immediat
      setImageUri(asset.uri);

      // Extraction du type MIME (ex: image/png)
      // Extension fallback si non détectée
      const fileExtension = asset.uri.split('.').pop();
      const mimeType = asset.mimeType || `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

      // Enregistrement des données prêtes à être envoyées à ton entité Java
      if (asset.base64) {
        setUpdatedImage({
          imageData: asset.base64,
          imageType: mimeType
        });
      }
    }
  };

  // Traitement de la sauvegarde
  const handleSave = async () => {
    const payload = {
      username,
      title,
      bio,
      profileImage: updatedImage // Contient null si inchangé, ou { imageData, imageType }
    };

    console.log("Données envoyées au service de mise à jour :", payload);
    
    try {
      // Insertion de ton appel API ici (ex: updateProfile(payload))
      Alert.alert("Succès", "Profil mis à jour avec succès !");
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Section Image de profil modifiable */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Ionicons name="person" size={40} color="#aaa" />
              </View>
            )}
            {/* Petit badge caméra superposé */}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Modifier la photo de profil</Text>
          </TouchableOpacity>
        </View>

        {/* Section Formulaire d'édition */}
        <View style={styles.formSection}>
          
          {/* Champ Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              autoCapitalize="none"
            />
          </View>

          {/* Champ Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titre professionnel</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Data Scientist / Web Developer"
            />
          </View>

          {/* Champ Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Racontez-en un peu plus sur vous..."
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

        </View>

        {/* Bouton de sauvegarde */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 25,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  placeholderAvatar: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  formSection: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});