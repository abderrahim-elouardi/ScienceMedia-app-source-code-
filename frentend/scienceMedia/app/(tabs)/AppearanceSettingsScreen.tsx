import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type ThemeId = 'light' | 'dark' | 'system';

interface ThemeOption {
    id: ThemeId;
    title: string;
    description: string;
}

const THEME_OPTIONS: ThemeOption[] = [
    { 
        id: 'light', 
        title: 'Mode clair', 
        description: 'Interface classique sur fond blanc reposante pour les yeux en plein jour.' 
    },
    { 
        id: 'dark', 
        title: 'Mode sombre', 
        description: 'Économise la batterie de votre téléphone et réduit la fatigue oculaire la nuit.' 
    },
    { 
        id: 'system', 
        title: 'Automatique (Système)', 
        description: "S'adapte automatiquement aux paramètres d'affichage actuels de votre smartphone." 
    },
];

export default function AppearanceSettingsScreen() {
    // État pour stocker le thème sélectionné (Système par défaut)
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>('system');

    const handleSelectTheme = (id: ThemeId) => {
        setSelectedTheme(id);
        // Logique pour appliquer le thème dans l'application (ex: via un Context ou une lib de style)
        console.log(`Thème sélectionné : ${id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* En-tête */}
                <View style={styles.header}>
                    <Text style={styles.title}>Apparence</Text>
                    <Text style={styles.subtitle}>
                        Personnalisez le style visuel de votre interface ScienceMedia.
                    </Text>
                </View>

                {/* Section Thème */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thème de l'application</Text>

                    {THEME_OPTIONS.map((option) => {
                        const isSelected = option.id === selectedTheme;
                        
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                                onPress={() => handleSelectTheme(option.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={[styles.optionTitle, isSelected && styles.textSelected]}>
                                        {option.title}
                                    </Text>
                                    <Text style={styles.optionDescription}>
                                        {option.description}
                                    </Text>
                                </View>

                                {/* Bouton Radio Custom */}
                                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        marginBottom: 14,
    },
    optionRowSelected: {
        backgroundColor: '#F0F7FF',
        borderColor: '#007AFF',
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    textSelected: {
        color: '#007AFF',
    },
    optionDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#C7C7CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#007AFF',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007AFF',
    },
});
