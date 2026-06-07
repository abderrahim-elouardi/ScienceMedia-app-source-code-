import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User } from '@/types/Auth.Type';
import { BASE_URL } from './config';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

let _token: string | null = null;
let _user: User | null = null;

// Appelé au démarrage de l'app pour restaurer la session depuis le stockage
export const loadStoredAuth = async (): Promise<void> => {
  try {
    const [token, userJson] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(USER_KEY),
    ]);
    _token = token;
    _user = userJson ? JSON.parse(userJson) : null;
  } catch (_e: unknown) {
    _token = null;
    _user = null;
  }
};

const authenticate = async (email: string, password: string): Promise<AuthResponse> => {
  const url = `${BASE_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Erreur ${response.status}`);
  }

  const data = (await response.json()) as AuthResponse;

  _token = data.acces_token;
  _user = data.user;

  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, data.acces_token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user)),
  ]);

  return data;
};

const getAuthToken = async (): Promise<string | null> => {
  if (_token) return _token;
  return AsyncStorage.getItem(TOKEN_KEY);
};

const getToken = (): string | null => _token;

const getUser = (): User | null => _user;

const logout = async (): Promise<void> => {
  _token = null;
  _user = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

export { authenticate, getAuthToken, getToken, getUser, logout };
