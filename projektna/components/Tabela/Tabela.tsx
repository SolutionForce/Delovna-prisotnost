import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react"; // Import useState
import CalendarPicker from "react-native-calendar-picker";
import Colors from "../Colors/Colors";
import { Dimensions, StyleSheet } from "react-native";
import IzpisPodatkov from "./IzpisPodatkov";
import { usersDBAtom } from '../../Atoms/UsersDBAtom';
import { useAtom } from 'jotai';
import { User } from "../../modules/interfaces/user";

const hardcodedAllowedUser = "ebRi8pmxCgQzxRuJyPCx";

const { width, height } = Dimensions.get("window");
const baseWidth = 414;
const baseHeight = 896;
const scaleWidth = (size: number) => (width / baseWidth) * size;
const scaleHeight = (size: number) => (height / baseHeight) * size;

export default function Tabela() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [users] = useAtom(usersDBAtom)

  const currentUser: User|undefined = users.find((user) => (user.uid === hardcodedAllowedUser)); //! hardcoded

  const userWtihAttendancesBetweenDates = (user: User, fromDate: Date, toDate: Date|undefined): User => {
    if(user.attendance.length === 0)
      return user;

    if(!toDate) { //Sets date to end of today
      toDate = new Date();
      toDate.setHours(0, 0, 0, 0);
      toDate.setDate(toDate.getDate()+1);
      toDate.setMilliseconds(toDate.getMilliseconds()-1);
    }

    const attendancesBetweenDates = user.attendance.filter(((oneAttendance) => (oneAttendance.timeIn.toDate()>=fromDate && oneAttendance.timeIn.toDate()<=toDate)));

    return {...user, attendance: attendancesBetweenDates}
  }

  const handleDateChange = (date: Date) => {
    const dateWithoutTime = date;
    dateWithoutTime.setHours(0, 0, 0, 0); //Nastavi uro na 00:00
    setSelectedDate(dateWithoutTime)
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.text}>Select date from:</Text>
          <View style={styles.CalendarContainer}>
            <CalendarPicker
              onDateChange={handleDateChange}
              textStyle={styles.CalendarText}
              startFromMonday
            />
          </View>
          <Text style={styles.text}>
            Selected date from: {selectedDate.toLocaleDateString('SL-SI')}, to: today
          </Text>
          {!currentUser &&
            <Text style={styles.error}>Current user unknown!</Text>
          }
          {currentUser &&
            <>
              <IzpisPodatkov user={userWtihAttendancesBetweenDates(currentUser, selectedDate, undefined)} />
            </>
          }
        </View>
      </ScrollView>
    </>
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
    color: Colors.BLACK,
  },
  zacetekDela: {
    alignSelf: "center",
    fontSize: 16,
    backgroundColor: Colors.PURPLE,
    color: Colors.BLACK,
  },
  zacetekDelaView: {
    backgroundColor: Colors.PURPLE,
    borderRadius: 10,
    width: scaleWidth(200),
    alignSelf: "auto",

  },
  text: {
    alignSelf: "auto",
    marginLeft: scaleWidth(12),
    fontSize: scaleWidth(16),
    color: Colors.BLACK,
    marginTop: scaleHeight(20),
  },
  error: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
    marginTop: 25,
    marginLeft: "auto",
    marginRight: "auto"
  },
});
