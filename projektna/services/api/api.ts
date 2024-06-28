import { getDocs, collection, addDoc, doc, setDoc } from '@firebase/firestore';
import { app, auth, firestore } from '../api/firebaseConfig';
import { User } from '../../modules/interfaces/user';
import axios from "axios";

export const BACKEND_BASE_URL = "https://us-central1-rvir-1e34e.cloudfunctions.net/api/";

export const getUsers = async (): Promise<User[]> => {
  try {
   const response = await axios.get(BACKEND_BASE_URL + 'users');
    return response.data;

  } catch (error) {
    console.error('Error fetching data from API:', error);
    return [];
  }
  
}

export const getUser = async (uid: String): Promise<User[]> => {
  try {
    const response = await axios.get(BACKEND_BASE_URL + `users/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return [];
  }
  
}


export const addUser = async (user: User) => {
  try {
    axios.post(BACKEND_BASE_URL + 'users', user); //Wrong json input for API endpoint
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

export const getCurrentWeather = async () => {
  const apiCall = `https://api.openweathermap.org/data/3.0/onecall?lat=46.55&lon=15.63&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}` 

  try {
    const response = await fetch(apiCall);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from OpenWeatherMap:', error);
  }
}

export const verifyTOTPcode = async (codeTOTP: string): Promise<boolean> => {
  if(!auth.currentUser)
    throw new Error("User not logged in");

  try {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    
    const headers = {
      'auth': idToken,
      'Content-Type': 'application/json'
    };
      
    const response = await fetch(BACKEND_BASE_URL + "codeAuthentication/verify", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify( {tokenTOTP: (codeTOTP+'')} )
    });
    if (!response.ok && response.status!==400) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if(result.message==="Token is valid")
      return true;
    
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
