import { ProfileStatsResponse } from '@/types/profileResponse.type';
import { getToken } from './auth.service';

// 1. Correction : Ajout du http:// et d'une adresse accessible par l'émulateur
const BASE_PROFILE_URL = "http://localhost:8080/profile/"; 

export const profilePosts = [
  { id: '1', imageUrl: 'https://picsum.photos/id/10/400/400', title: 'Post 1' },
  { id: '2', imageUrl: 'https://picsum.photos/id/20/400/400', title: 'Post 2' },
  { id: '3', imageUrl: 'https://picsum.photos/id/30/400/400', title: 'Post 3' },
  { id: '4', imageUrl: 'https://picsum.photos/id/40/400/400', title: 'Post 4' },
  { id: '5', imageUrl: 'https://picsum.photos/id/50/400/400', title: 'Post 5' },
  { id: '6', imageUrl: 'https://picsum.photos/id/60/400/400', title: 'Post 6' },
];
// let _profileDetailsState:ProfileStatsResponse|null =null 
export const getProfileDetailsState = async ():Promise<ProfileStatsResponse | null>=>{
  try {
    const token = getToken(); 

    const response = await fetch(BASE_PROFILE_URL + "profile_details", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    const data = await response.json() as ProfileStatsResponse; 
    return data
    
  } catch (error) {
    console.error(error);
    return null
  }
};


// export const getReturnValueProfileDetailsState = () => {
//     alert("geting user details ")
//     return _profileDetailsState;
// };

export const editeProfile = async (newProfileState:any)=>{
    const token = getToken(); 

    const response = await fetch(BASE_PROFILE_URL + "editProfile", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body:JSON.stringify(newProfileState)
    });
    console.log("request was sent")
    if (!response.ok) {
      throw new Error('Erreur lors de la modification du profil');
    }    
    return getProfileDetailsState()

  }
