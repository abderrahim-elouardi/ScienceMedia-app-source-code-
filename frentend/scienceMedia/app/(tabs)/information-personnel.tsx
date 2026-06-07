import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function PersonalInformationScreen() {
    // États pour gérer les informations de l'utilisateur
    const [firstName, setFirstName] = useState('Alexandre');
    const [lastName, setLastName] = useState('Dupont');
    const [email, setEmail] = useState('alex@example.com');
    const [phone, setPhone] = useState('+33 6 12 34 56 78');

    const handleSave = () => {
        // Logique pour sauvegarder les modifications (Appel API ou Backend)
        console.log('Données sauvegardées :', { firstName, lastName, email, phone });
        alert('Informations mises à jour avec succès !');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    {/* En-tête de la page */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Informations personnelles</Text>
                        <Text style={styles.subtitle}>
                            Gérez les détails de votre compte ScienceMedia.
                        </Text>
                    </View>

                    {/* Formulaire */}
                    <View style={styles.form}>
                        
                        {/* Champ Prénom */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Prénom</Text>
                            <TextInput
                                style={styles.input}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Votre prénom"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        {/* Champ Nom */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nom de famille</Text>
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Votre nom"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        {/* Champ Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Adresse e-mail</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="votre.email@exemple.com"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Champ Téléphone */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Numéro de téléphone</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Votre numéro"
                                placeholderTextColor="#aaa"
                                keyboardType="phone-pad"
                            />
                        </View>

                    </View>

                    {/* Bouton Enregistrer */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
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
    form: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    saveButton: {
        backgroundColor: '#007AFF', // Bleu iOS standard correspondant à votre bouton "Modifier le profil"
        height: 52,
        borderRadius: 26, // Design tout en rondeur
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3, // Ombre Android
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});