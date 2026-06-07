import { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';

export default function NotificationSettingsScreen() {
    // États pour gérer l'activation de chaque type de notification
    const [pushEnabled, setPushEnabled] = useState(true);
    const [messagesEnabled, setMessagesEnabled] = useState(true);
    const [callsEnabled, setCallsEnabled] = useState(true);
    const [newsEnabled, setNewsEnabled] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* En-tête */}
                <View style={styles.header}>
                    <Text style={styles.title}>Notifications</Text>
                    <Text style={styles.subtitle}>
                        Choisissez comment et quand vous souhaitez être averti sur ScienceMedia.
                    </Text>
                </View>

                {/* Section : Préférences Générales */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alertes principales</Text>
                    
                    {/* Ligne : Autoriser les notifications */}
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowTitle}>Notifications Push</Text>
                            <Text style={styles.rowDescription}>Activer globalement les alertes sur votre téléphone</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E9ECEF', true: '#34C759' }} // Vert iOS standard quand actif
                            thumbColor={Platform.OS === 'ios' ? '#fff' : (pushEnabled ? '#fff' : '#f4f3f4')}
                            onValueChange={setPushEnabled}
                            value={pushEnabled}
                        />
                    </View>
                </View>

                {/* Section : Activités de l'application */}
                <View style={[styles.section, !pushEnabled && styles.disabledSection]} pointerEvents={pushEnabled ? 'auto' : 'none'}>
                    <Text style={styles.sectionTitle}>Activités</Text>

                    {/* Ligne : Nouveaux Messages */}
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowTitle}>Nouveaux messages</Text>
                            <Text style={styles.rowDescription}>Alertes pour les discussions privées</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E9ECEF', true: '#007AFF' }} // Bleu harmonisé pour le chat
                            thumbColor={Platform.OS === 'ios' ? '#fff' : (messagesEnabled ? '#fff' : '#f4f3f4')}
                            onValueChange={setMessagesEnabled}
                            value={messagesEnabled}
                        />
                    </View>

                    {/* Ligne : Appels Vidéo */}
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowTitle}>Appels vidéo et audio</Text>
                            <Text style={styles.rowDescription}>Être averti lors d'un appel entrant</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : (callsEnabled ? '#fff' : '#f4f3f4')}
                            onValueChange={setCallsEnabled}
                            value={callsEnabled}
                        />
                    </View>

                    {/* Ligne : Actualités Scientifiques */}
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowTitle}>Publications & Actualités</Text>
                            <Text style={styles.rowDescription}>Alertes lors de nouveaux projets ou publications</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : (newsEnabled ? '#fff' : '#f4f3f4')}
                            onValueChange={setNewsEnabled}
                            value={newsEnabled}
                        />
                    </View>
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
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93', // Gris pour séparer les catégories
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'between',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E9ECEF',
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    rowDescription: {
        fontSize: 13,
        color: '#666',
    },
    disabledSection: {
        opacity: 0.4, // Grise visuellement les sous-options si le push global est désactivé
    },
});