import { getDocs, collection, addDoc, doc, setDoc } from '@firebase/firestore';
import { app, firestore } from '../api/firebaseConfig';
import { User } from '../../modules/interfaces/user';
import axios from "axios";

const api = axios.create({ //to be used soon
   baseURL: process.env.REACT_APP_BASE_URL,
   timeout: 30000,
   headers: {
       "Content-Type": "application/json",
       Accept: "application/json", 
   },
});

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get('http://localhost:5001/rvir-1e34e/us-central1/api/users');
    return response.data;

  } catch (error) {
    console.error('Error fetching data from API:', error);
    return [];
  }
  
}


export const addUser = async (user: User) => {
  try {
    axios.post('http://localhost:5001/rvir-1e34e/us-central1/api/users', user)//to be changed
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

export const getCurrentWeather = async () => {
  const ApiKey = '6cf6095411302c38cbddb63a6155cd40'
  const apiCall = `https://api.openweathermap.org/data/3.0/onecall?lat=46.55&lon=15.63&appid=${ApiKey}` 

  try {
    const response = await fetch(apiCall);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from OpenWeatherMap:', error);
  }
}