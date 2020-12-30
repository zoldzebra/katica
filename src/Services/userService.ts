import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { User } from '../components/AuthProvider/AuthProvider';

// more props to be added later
export interface UserInfo extends User {
  userName: string;
}

export const getUserInfo = async (user: User): Promise<any> => {
  try {
    const db = firebase.firestore();
    const userInfoRef = db.collection("Users").doc(user?.id);
    const userDoc = await userInfoRef.get();
    if (userDoc.exists) {
      const response = {
        ...user,
        ...userDoc.data(),
      }
      return response;
    }
  } catch (error) {
    console.log('Error fetching user info:', error);
    alert(error.message);
  }
}

export const signInUser = async (email: string, password: string)
  : Promise<any | undefined> => {
  try {
    const firebaseAuth = await firebase.auth();
    const userCredentials = await firebaseAuth
      .signInWithEmailAndPassword(email, password);
    return userCredentials;
  } catch (error) {
    console.log('Error signing in user:', error);
    alert(error.message);
  }
} 