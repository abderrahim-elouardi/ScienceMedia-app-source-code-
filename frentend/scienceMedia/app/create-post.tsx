import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/theme';
import { useCreatePost } from '../hooks/use-posts';
import type { PostType, CreatePostData } from '../types/post.types';

const POST_TYPE_OPTIONS: { type: PostType; label: string; icon: string }[] = [
  { type: 'text',       label: 'Texte',   icon: '✍️' },
  { type: 'text_image', label: 'Photo',   icon: '🖼️' },
  { type: 'text_video', label: 'Vidéo',   icon: '🎥' },
  { type: 'meeting',    label: 'Réunion', icon: '📅' },
];

const IMAGE_TYPES: PostType[] = ['text_image', 'image'];
const VIDEO_TYPES: PostType[] = ['text_video', 'video'];

export default function CreatePostScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const initialType = (params.type ?? 'text') as PostType;

  const [selectedType, setSelectedType] = useState<PostType>(initialType);
  const [title, setTitle]               = useState('');
  const [content, setContent]           = useState('');
  const [mediaUri, setMediaUri]         = useState<string | null>(null);
  const [pdfUri, setPdfUri]             = useState<string | null>(null);
  const [pdfName, setPdfName]           = useState<string | null>(null);
  const [tagInput, setTagInput]         = useState('');
  const [tags, setTags]                 = useState<string[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDesc, setMeetingDesc]   = useState('');
  const [meetingDate, setMeetingDate]   = useState('');
  const { submit, isSubmitting } = useCreatePost();

  // Change le type de post et efface le média si incompatible
  function handleTypeChange(type: PostType) {
    setSelectedType(type);
    if (mediaUri) {
      const nowImage = IMAGE_TYPES.includes(type);
      const nowVideo = VIDEO_TYPES.includes(type);
      const wasImage = IMAGE_TYPES.includes(selectedType);
      const wasVideo = VIDEO_TYPES.includes(selectedType);
      if ((wasImage && !nowImage) || (wasVideo && !nowVideo) || (!nowImage && !nowVideo)) {
        setMediaUri(null);
      }
    }
  }

  // ── Permissions ──────────────────────────────────────────────────────────

  async function requestGalleryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "Autorisez l'accès à la galerie dans les paramètres de l'application.");
      return false;
    }
    return true;
  }

  async function requestCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "Autorisez l'accès à la caméra dans les paramètres de l'application.");
      return false;
    }
    return true;
  }

  // ── Sélecteurs d'image ───────────────────────────────────────────────────

  async function pickImageFromGallery() {
    if (!(await requestGalleryPermission())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.85,
      allowsEditing: true,
      aspect: [16, 9],
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  }

  async function pickImageFromCamera() {
    if (!(await requestCameraPermission())) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.85,
      allowsEditing: true,
      aspect: [16, 9],
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  }

  // ── Sélecteurs de vidéo ──────────────────────────────────────────────────

  async function pickVideoFromGallery() {
    if (!(await requestGalleryPermission())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'videos',
      quality: 1,
      videoMaxDuration: 300,
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  }

  async function pickVideoFromCamera() {
    if (!(await requestCameraPermission())) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'videos',
      quality: 1,
      videoMaxDuration: 300,
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  }

  // ── Sélecteur de PDF ────────────────────────────────────────────────────

  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      setPdfUri(result.assets[0].uri);
      setPdfName(result.assets[0].name);
    }
  }

  // ── Tags ─────────────────────────────────────────────────────────────────

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  // ── Soumission ───────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Champ requis', 'Veuillez entrer un titre pour votre post.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Champ requis', 'Veuillez entrer le contenu de votre post.');
      return;
    }
    if (selectedType === 'meeting' && !meetingTitle.trim()) {
      Alert.alert('Champ requis', 'Veuillez entrer le titre de la réunion.');
      return;
    }

    const isImage = IMAGE_TYPES.includes(selectedType);
    const isVideo = VIDEO_TYPES.includes(selectedType);

    // Construit les données du post étape par étape
    const postData: CreatePostData = {
      type: selectedType,
      title: title.trim(),
      excerpt: content.trim(),
      content: content.trim(),
      tags,
    };

    if (isImage && mediaUri) postData.imageUrl = mediaUri;
    if (isVideo && mediaUri) postData.videoUrl = mediaUri;
    if (selectedType === 'text' && pdfUri) {
      postData.documentUrl = pdfUri;
      postData.documentName = pdfName ?? undefined;
    }
    if (selectedType === 'meeting' && meetingTitle.trim()) {
      postData.meeting = {
        title: meetingTitle.trim(),
        description: meetingDesc.trim() || undefined,
        startDate: meetingDate.trim() || new Date().toISOString(),
      };
    }

    await submit(postData);
    router.back();
  }

  const isImageType = IMAGE_TYPES.includes(selectedType);
  const isVideoType = VIDEO_TYPES.includes(selectedType);

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerSideBtn}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un post</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.headerSideBtn, styles.publishBtn]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.publishText}>Publier</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Sélecteur de type ── */}
          <View style={styles.typeRow}>
            {POST_TYPE_OPTIONS.map(({ type, label, icon }) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, selectedType === type && styles.typeChipActive]}
                onPress={() => handleTypeChange(type)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeIcon}>{icon}</Text>
                <Text style={[styles.typeLabel, selectedType === type && styles.typeLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Titre ── */}
          <View style={styles.field}>
            <Text style={styles.label}>Titre</Text>
            <TextInput
              style={styles.input}
              placeholder="Un titre accrocheur..."
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={120}
              returnKeyType="next"
            />
          </View>

          {/* ── Contenu ── */}
          <View style={styles.field}>
            <Text style={styles.label}>Contenu</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Partagez vos idées avec la communauté..."
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* ── Pièce jointe PDF (type Texte) ── */}
          {selectedType === 'text' && (
            <View style={styles.field}>
              <Text style={styles.label}>PDF joint (optionnel)</Text>
              {pdfUri ? (
                <View style={styles.pdfSelectedBox}>
                  <Text style={styles.pdfIcon}>📄</Text>
                  <Text style={styles.pdfName} numberOfLines={1}>{pdfName}</Text>
                  <TouchableOpacity
                    onPress={() => { setPdfUri(null); setPdfName(null); }}
                    style={styles.pdfRemoveBtn}
                  >
                    <Text style={styles.removeMediaText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.pdfPickerBox} onPress={pickPdf} activeOpacity={0.8}>
                  <Text style={styles.pdfPickerIcon}>📄</Text>
                  <Text style={styles.pdfPickerLabel}>Importer un PDF</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Sélecteur d'image ── */}
          {isImageType && (
            <View style={styles.field}>
              <Text style={styles.label}>Image</Text>
              {mediaUri ? (
                <View style={styles.mediaPreviewWrap}>
                  <Image source={{ uri: mediaUri }} style={styles.imagePreview} resizeMode="cover" />
                  <TouchableOpacity style={styles.removeMediaBtn} onPress={() => setMediaUri(null)}>
                    <Text style={styles.removeMediaText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mediaPickerBox}>
                  <Text style={styles.mediaPickerHint}>Choisissez une image</Text>
                  <View style={styles.mediaPickerRow}>
                    <TouchableOpacity style={styles.mediaPickerBtn} onPress={pickImageFromGallery} activeOpacity={0.8}>
                      <Text style={styles.mediaPickerBtnIcon}>🖼️</Text>
                      <Text style={styles.mediaPickerBtnLabel}>Galerie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaPickerBtn} onPress={pickImageFromCamera} activeOpacity={0.8}>
                      <Text style={styles.mediaPickerBtnIcon}>📷</Text>
                      <Text style={styles.mediaPickerBtnLabel}>Caméra</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── Sélecteur de vidéo ── */}
          {isVideoType && (
            <View style={styles.field}>
              <Text style={styles.label}>Vidéo</Text>
              {mediaUri ? (
                <View style={styles.videoSelectedBox}>
                  <Text style={styles.videoSelectedIcon}>🎥</Text>
                  <Text style={styles.videoSelectedLabel} numberOfLines={1}>Vidéo sélectionnée</Text>
                  <TouchableOpacity onPress={() => setMediaUri(null)} style={styles.videoRemoveBtn}>
                    <Text style={styles.removeMediaText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mediaPickerBox}>
                  <Text style={styles.mediaPickerHint}>Choisissez une vidéo</Text>
                  <View style={styles.mediaPickerRow}>
                    <TouchableOpacity style={styles.mediaPickerBtn} onPress={pickVideoFromGallery} activeOpacity={0.8}>
                      <Text style={styles.mediaPickerBtnIcon}>📁</Text>
                      <Text style={styles.mediaPickerBtnLabel}>Galerie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaPickerBtn} onPress={pickVideoFromCamera} activeOpacity={0.8}>
                      <Text style={styles.mediaPickerBtnIcon}>📹</Text>
                      <Text style={styles.mediaPickerBtnLabel}>Caméra</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── Champs réunion ── */}
          {selectedType === 'meeting' && (
            <View style={styles.meetingSection}>
              <Text style={styles.sectionTitle}>Détails de la réunion</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Titre de la réunion</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex. : Séminaire IA & Recherche"
                  placeholderTextColor="#9CA3AF"
                  value={meetingTitle}
                  onChangeText={setMeetingTitle}
                  maxLength={100}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description (optionnel)</Text>
                <TextInput
                  style={[styles.input, styles.multilineInputSm]}
                  placeholder="Décrivez brièvement la réunion..."
                  placeholderTextColor="#9CA3AF"
                  value={meetingDesc}
                  onChangeText={setMeetingDesc}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Date & heure (optionnel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex. : 2026-06-01T14:00:00"
                  placeholderTextColor="#9CA3AF"
                  value={meetingDate}
                  onChangeText={setMeetingDate}
                />
              </View>
            </View>
          )}

          {/* ── Tags ── */}
          <View style={styles.field}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="#science #IA ..."
                placeholderTextColor="#9CA3AF"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                returnKeyType="done"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.addTagBtn} onPress={addTag}>
                <Text style={styles.addTagText}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <TouchableOpacity key={tag} style={styles.tagChip} onPress={() => removeTag(tag)}>
                    <Text style={styles.tagChipText}>#{tag}</Text>
                    <Text style={styles.tagChipRemove}>✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSideBtn: {
    minWidth: 72,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cancelText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  publishBtn: {
    backgroundColor: Colors.light.tint,
  },
  publishText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
  },

  // Type selector
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  typeChipActive: {
    borderColor: Colors.light.tint,
    backgroundColor: '#EEF4FF',
  },
  typeIcon: { fontSize: 20 },
  typeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeLabelActive: {
    color: Colors.light.tint,
  },

  // Fields
  field: { gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.light.text,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  multilineInputSm: {
    minHeight: 72,
    paddingTop: 10,
  },

  // Media picker (image & video)
  mediaPickerBox: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 14,
  },
  mediaPickerHint: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  mediaPickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaPickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaPickerBtnIcon: { fontSize: 20 },
  mediaPickerBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  // Image preview
  mediaPreviewWrap: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMediaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // Video selected indicator
  videoSelectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  videoSelectedIcon: { fontSize: 22 },
  videoSelectedLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  videoRemoveBtn: {
    backgroundColor: 'rgba(10,126,164,0.15)',
    borderRadius: 999,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Meeting section
  meetingSection: {
    backgroundColor: '#F0F7FF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.tint,
  },

  // Tags
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addTagBtn: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  tagChipRemove: {
    fontSize: 11,
    color: Colors.light.tint,
    fontWeight: '700',
  },

  // PDF
  pdfPickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 18,
  },
  pdfPickerIcon: { fontSize: 22 },
  pdfPickerLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  pdfSelectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  pdfIcon: { fontSize: 22 },
  pdfName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  pdfRemoveBtn: {
    backgroundColor: 'rgba(146,64,14,0.12)',
    borderRadius: 999,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// AOUAD ABDELKARIM
