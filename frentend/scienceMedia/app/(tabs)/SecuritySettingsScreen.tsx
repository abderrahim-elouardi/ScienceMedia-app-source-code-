import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SecuritySettingsScreen() {
    // États pour les fonctionnalités de sécurité
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
    
    // États pour le changement de mot de passe
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Veuillez remplir tous les champs de mot de passe.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Le nouveau mot de passe et la confirmation ne correspondent pas.');
            return;
        }
        
        // Logique backend à connecter ici
        console.log('Changement de mot de passe demandé');
        alert('Votre mot de passe a été modifié avec succès !');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    {/* En-tête */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Sécurité</Text>
                        <Text style={styles.subtitle}>
                            Protégez vos accès et sécurisez vos données scientifiques.
                        </Text>
                    </View>

                    {/* Section 1 : Authentification renforcée */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Accès et Connexion</Text>
                        
                        {/* Ligne : Biométrie */}
                        <View style={styles.row}>
                            <View style={styles.textContainer}>
                                <Text style={styles.rowTitle}>Verrouillage Biométrique</Text>
                                <Text style={styles.rowDescription}>Utiliser Face ID / Empreinte digitale</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                                thumbColor="#fff"
                                onValueChange={setIsBiometricEnabled}
                                value={isBiometricEnabled}
                            />
                        </View>

                        {/* Ligne : 2FA */}
                        <View style={styles.row}>
                            <View style={styles.textContainer}>
                                <Text style={styles.rowTitle}>Double Authentification (2FA)</Text>
                                <Text style={styles.rowDescription}>Sécuriser votre compte avec un code d'accès unique</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                                thumbColor="#fff"
                                onValueChange={setIs2FAEnabled}
                                value={is2FAEnabled}
                            />
                        </View>
                    </View>

                    {/* Section 2 : Modification du mot de passe */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Modifier le mot de passe</Text>
                        
                        {/* Champ : Mot de passe actuel */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mot de passe actuel</Text>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#aaa"
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Champ : Nouveau mot de passe */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nouveau mot de passe</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#aaa"
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Champ : Confirmation */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#aaa"
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Bouton de validation du mot de passe */}
                        <TouchableOpacity style={styles.passwordButton} onPress={handleUpdatePassword}>
                            <Text style={styles.passwordButtonText}>Mettre à jour le mot de passe</Text>
                        </TouchableOpacity>
                    </View>

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
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    inputGroup: {
        marginBottom: 18,
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
    passwordButton: {
        backgroundColor: '#007AFF', // Alignement sur le bleu de votre écran Profil
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    passwordButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});