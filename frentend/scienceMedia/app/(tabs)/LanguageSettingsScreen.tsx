import { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Liste des langues supportées par l'application
const LANGUAGES = [
    { id: 'fr', name: 'Français', nativeName: 'Français' },
    { id: 'en', name: 'Anglais', nativeName: 'English' },
    { id: 'es', name: 'Espagnol', nativeName: 'Español' },
    { id: 'de', name: 'Allemand', nativeName: 'Deutsch' },
    { id: 'ar', name: 'Arabe', nativeName: 'العربية' },
];

export default function LanguageSettingsScreen() {
    // État pour stocker la langue sélectionnée (Français par défaut)
    const [selectedLanguage, setSelectedLanguage] = useState('fr');

    const handleSelectLanguage = (id: string) => {
        setSelectedLanguage(id);
        // Logique pour changer la langue de l'application (ex: avec i18next ou context)
        console.log(`Langue changée vers : ${id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                
                {/* En-tête */}
                <View style={styles.header}>
                    <Text style={styles.title}>Langue</Text>
                    <Text style={styles.subtitle}>
                        Sélectionnez votre langue de préférence pour l'interface de ScienceMedia.
                    </Text>
                </View>

                {/* Liste des langues */}
                <FlatList
                    data={LANGUAGES}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => {
                        const isSelected = item.id === selectedLanguage;
                        
                        return (
                            <TouchableOpacity 
                                style={[styles.languageRow, isSelected && styles.languageRowSelected]} 
                                onPress={() => handleSelectLanguage(item.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={[styles.languageName, isSelected && styles.textSelected]}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.nativeName}>
                                        {item.nativeName}
                                    </Text>
                                </View>
                                
                                {/* Coche visuelle si sélectionné */}
                                {isSelected && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: '#F8F9FA', // Fond gris clair par défaut
        borderWidth: 1,
        borderColor: '#E9ECEF',
        marginBottom: 12,
    },
    languageRowSelected: {
        backgroundColor: '#F0F7FF', // Fond bleuté très subtil quand sélectionné
        borderColor: '#007AFF',     // Bordure bleue
    },
    textContainer: {
        flexDirection: 'column',
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    textSelected: {
        color: '#007AFF', // Texte bleu pour la ligne sélectionnée
    },
    nativeName: {
        fontSize: 13,
        color: '#8E8E93',
    },
    checkmark: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF', // Coche bleue
    },
});