import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { User } from '../components/AuthProvider/AuthProvider';
import firebaseApp from "../Firebase/firebaseApp";

export interface UserInfo extends User {
  userName: string;
}

export const getUserInfo = async (user: User): Promise<UserInfo | null> => {
  try {
    const db = firebase.firestore();
    const userInfoRef = db.collection("Users").doc(user.id);
    const userDoc = await userInfoRef.get();
    if (userDoc.exists) {
      const response = {
        ...user,
        ...userDoc.data(),
      }
      return response as UserInfo;
    }
    return { ...user, userName: '' } as UserInfo;
  } catch (error) {
    console.log('Error fetching user info:', error);
    alert(error.message);
    return null;
  }
}

export const signInUser = async (email: string, password: string)
  : Promise<any | null> => {
  try {
    const firebaseAuth = firebase.auth();
    const userCredentials = await firebaseAuth
      .signInWithEmailAndPassword(email, password);
    return userCredentials;
  } catch (error) {
    console.log('Error signing in user:', error);
    alert(error.message);
    return null;
  }
}

export const createUser = async (email: string, password: string)
  : Promise<any | null> => {
  try {
    const firebaseAuth = firebase.auth();
    const userCredentials = await firebaseAuth
      .createUserWithEmailAndPassword(email, password);
    return userCredentials;
  } catch (error) {
    console.log('Error creating user:', error);
    alert(error.message);
    return null;
  }
}

export const createEmailAndUserNameForUser = async (userInfo: UserInfo) => {
  try {
    const db = firebase.firestore();
    const userInfoRef = db.collection("Users").doc(userInfo.id);
    await userInfoRef.set({
      email: userInfo.email,
      userName: userInfo.userName,
    });
  } catch (error) {
    console.log('Error saving userName and email:', error);
    alert(error.message);
  }
}

export const signOutUser = async () => {
  try {
    await firebaseApp.auth().signOut();
  } catch (error) {
    console.log('Error signing out user:', error);
    alert(error.message);
  }
}