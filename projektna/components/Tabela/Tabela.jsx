import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react"; // Import useState
import CalendarPicker from "react-native-calendar-picker";
import Colors from "../Colors/Colors";
import { Dimensions, StyleSheet } from "react-native";
import IzpisPodatkov from "./IzpisPodatkov";




//To baje rabim za podatke iz baze
import { usersDBAtom } from '../../Atoms/UsersDBAtom';
import { useAtom } from 'jotai';
import { User } from '../../modules/interfaces/user';



;
  


const { width, height } = Dimensions.get("window");
const baseWidth = 414;
const baseHeight = 896;
const scaleWidth = (size) => (width / baseWidth) * size;
const scaleHeight = (size) => (height / baseHeight) * size;





export default function Tabela() {
    const [selectedDate, setSelectedDate] = useState('');
    const  Podatki = useAtom(usersDBAtom)
  
    function naredi(date) {
      const utcPlusOneDate = new Date(date).toLocaleString('en-GB', { timeZone: 'Europe/Paris' }); // Paris is in UTC+1
      //console.log("test", utcPlusOneDate);
      setSelectedDate(utcPlusOneDate); // Update the state with the new date
    }
  
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.CalendarContainer}>
          <CalendarPicker
            onDateChange={(date) => naredi(date)} // Corrected function reference
            style={styles.CalendarText}
            />
        </View>
        <Text style={styles.text}>
          Selected Date: {selectedDate}
        </Text>
        <IzpisPodatkov podatki={Podatki} selectedDate={selectedDate}/> 
      </View>
  </ScrollView>
    );
  }
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
   
  },
  CalendarContainer: {
    backgroundColor: Colors.PURPLE,
    borderRadius: 10,
    width: scaleWidth(400),
    alignSelf: "center",
  },
  CalendarText: {
    color: Colors.WHITE,
  },
  zacetekDela: {
    alignSelf: "center",
    fontSize: 16,
    backgroundColor: Colors.PURPLE,
    color: Colors.BLACK, // Assuming you have a BLACK color in your Colors file
  },
  zacetekDelaView: {
    backgroundColor: Colors.PURPLE,
    borderRadius: 10,
    width: scaleWidth(200),
    alignSelf: "left",
    
  },
  text: {
    alignSelf: "left",
    marginLeft: scaleWidth(12),
    fontSize: scaleWidth(16),
    color: Colors.BLACK, // Assuming you have a BLACK color in your Colors file
    marginTop: scaleHeight(20),
  },
});



