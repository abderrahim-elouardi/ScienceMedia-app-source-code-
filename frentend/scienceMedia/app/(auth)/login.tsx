import { authenticate, getToken, getUser } from '@/services/auth.service';
import { User } from '@/types/Auth.Type';
import { Link, router } from 'expo-router';
import { useState } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function MessagesScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authErrorMessage , setAuthErrorMessage] = useState('')

  const login = async () => {
    const result = await authenticate(email, password);
    const user:User | null = await getUser();
    const token = await getToken();
    if(!token){
      setAuthErrorMessage("Email ou mot de passe est incorrect")
    }
    router.replace('/');
  };

  const loginWithGoogle = () => {
    // Logique Google
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          {/* Logo & Header */}
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />            
          <Text style={styles.welcomeText}>Welcome to Science Media</Text>
          <Text style={styles.detailsText}>Please enter your details to continue</Text>
          
          {/* Inputs */}
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Email address" 
              placeholderTextColor="#999"
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="#999"
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry 
              autoCapitalize="none"
            />
          </View>

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </Link>
          </View>

          {/* Error Message */}
          {authErrorMessage !== '' ? (
            <Text style={styles.errorText}>{authErrorMessage}</Text>
          ) : null}

          {/* Buttons */}
          <Pressable 
            style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]} 
            onPress={login}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable 
            style={({ pressed }) => [styles.googleButton, pressed && styles.buttonPressed]} 
            onPress={loginWithGoogle}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Fond légèrement gris pour faire ressortir la carte blanche
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    // Ombres pour donner du relief (iOS & Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 6,
  },
  detailsText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputContainer: {
    gap: 14, // Espace uniforme entre les inputs
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#212529',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#dc3545', // Couleur rouge pour l'erreur
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16, // Espace avant le bouton de login
  },
  loginButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85, // Effet visuel immédiat au clic
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#adb5bd',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // Petite ombre sur le bouton blanc
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
});