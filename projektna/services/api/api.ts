import { getDocs, collection, addDoc, doc, setDoc } from '@firebase/firestore';
import { app, firestore } from '../api/firebaseConfig';
import { User } from '../../modules/interfaces/user';

export const getUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    const users = querySnapshot.docs.map((doc): User => {
      //id: doc.id,     to ne rabi bit ker imamo ze pod uid
      const user: User = {
        uid: doc.data().uid,
        name: doc.data().name,
        surname: doc.data().surname,
        attendance: doc.data().attendance
      };
      return user;
    });

    //console.log('Data from Firestore:', users);
    return users;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    return [];
  }
};

export const addUser = async (user: User) => {
  try {
    const docRef = await addDoc(collection(firestore, "users"), user);
    //console.log("Document written with ID: ", docRef.id);
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