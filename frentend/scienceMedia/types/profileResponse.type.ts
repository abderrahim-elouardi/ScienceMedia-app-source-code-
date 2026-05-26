// Interface pour l'objet image imbriqué
export interface ProfileImageInfo {
  id: number;
  content: string;
  imageData: string; // La chaîne Base64 complète
  imageType: 'image/png' | 'image/jpeg' | string; // Type MIME de l'image
  createdAt: string; // Format ISO string (ex: "2026-05-26T15:30:47...")
}

// Interface principale correspondant à votre retour JSON
export interface ProfileStatsResponse {
  numberOfFollowers: number;
  numberOfFollowing: number;
  numberOfPosts:number;
  profileImage: ProfileImageInfo | null; // Peut être null si l'utilisateur n'a pas d'image
}