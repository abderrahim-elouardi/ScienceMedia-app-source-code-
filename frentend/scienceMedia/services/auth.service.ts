import { AuthResponse, User } from "@/types/Auth.Type";
import { BASE_URL } from "./config";

// Décommente cette ligne si tu utilises AsyncStorage plus tard :
// import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_AUTH_URL = BASE_URL+"/auth/login";

let _token: string | null = null;
let _user: User | null = null;

// Correction : Ajout du type de retour Promise<AuthResponse>
const authenticate = async (username: string, password: string): Promise<AuthResponse> => {
    const auth_url = BASE_AUTH_URL + "?email=" + username + "&password=" + password;
    try {
        const response = await fetch(auth_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const responseText = await response.text();

        if (!response.ok) {
            const errorData = responseText ? JSON.parse(responseText) : null;
            throw new Error(errorData?.message || `Erreur ${response.status}`);
        }
        else{
            const data = responseText ? (JSON.parse(responseText) as AuthResponse) : null;
            if (!data) {
                throw new Error("Le serveur a renvoyé une réponse vide.");
            }

            // --- SAUVEGARDE EN CACHE ---
            _token = data.acces_token;
            _user = data.user;

            // Si tu utilises AsyncStorage, décommente ces lignes :
            // await AsyncStorage.setItem('@auth_token', data.acces_token);
            // await AsyncStorage.setItem('@auth_user', JSON.stringify(data.user));

            // ⚠️ CORRECTION CRITIQUE : Il faut absolument retourner les données !
            return data; 
        }        
    } catch (error: any) {
        _token = null
        _user = null
    }
};

// 2. Récupérer le token
const getToken = async (): Promise<string | null> => {
    return _token;
};

// 3. Récupérer le profil de l'utilisateur connecté
const getUser = async (): Promise<User | null> => {
    return _user;
};

// Exportation propre des fonctions
export { authenticate, getToken, getUser };

