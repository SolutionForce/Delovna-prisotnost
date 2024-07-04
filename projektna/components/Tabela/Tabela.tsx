import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import Colors from "../Colors/Colors";
import IzpisPodatkov from "./IzpisPodatkov";
import { usersDBAtom } from "../../Atoms/UsersDBAtom";
import { useAtom } from "jotai";
import { User } from "../../modules/interfaces/user";
import { auth } from "../../services/api/firebaseConfig";
import { H1 } from "tamagui";

const { width } = Dimensions.get("window");

export default function Tabela() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [users] = useAtom(usersDBAtom);

  const currentUser: User | undefined = users.find(
    (user) => user.uid === (auth.currentUser?.uid || "")
  );

  const userWtihAttendancesBetweenDates = (
    user: User,
    fromDate: Date,
    toDate: Date | undefined
  ): User => {
    if (user.attendance.length === 0) return user;

    if (!toDate) {
      // Sets date to end of today
      toDate = new Date();
      toDate.setHours(0, 0, 0, 0);
      toDate.setDate(toDate.getDate() + 1);
      toDate.setMilliseconds(toDate.getMilliseconds() - 1);
    }

    const attendancesBetweenDates = user.attendance.filter(
      (oneAttendance) =>
        oneAttendance.timeIn.toDate() >= fromDate &&
        oneAttendance.timeIn.toDate() <= toDate
    );

    return { ...user, attendance: attendancesBetweenDates };
  };

  const handleDateChange = (date: Date) => {
    const dateWithoutTime = date;
    dateWithoutTime.setHours(0, 0, 0, 0); // Nastavi uro na 00:00
    setSelectedDate(dateWithoutTime);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {currentUser && (
          <>
            <H1 style={styles.attendanceHeader}>Attendance for</H1>
            <H1 style={styles.attendanceHeader}>
              {currentUser.name} {currentUser.surname}
            </H1>
          </>
        )}
        <Text style={styles.text}>Select date:</Text>
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={handleDateChange}
            textStyle={styles.calendarText}
            startFromMonday
            selectedDayTextStyle={styles.selectedDayText}
            selectedDayStyle={styles.selectedDay}
            previousTitle="Prev"
            nextTitle="Next"
            previousTitleStyle={styles.navigationText}
            nextTitleStyle={styles.navigationText}
            scaleFactor={375}
            width={width - 40}
          />
        </View>
        <Text style={styles.text}>
          Selected date from: {selectedDate.toLocaleDateString("SL-SI")}, to:
          today
        </Text>
        {!currentUser && (
          <Text style={styles.error}>Current user unknown!</Text>
        )}
        {currentUser && (
          <IzpisPodatkov
            user={userWtihAttendancesBetweenDates(
              currentUser,
              selectedDate,
              undefined
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: width,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  calendarContainer: {
    backgroundColor: Colors.PURPLE,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
    paddingVertical: 10,
  },
  calendarText: {
    color: Colors.WHITE,
  },
  selectedDay: {
    backgroundColor: Colors.WHITE,
  },
  selectedDayText: {
    color: Colors.BLACK,
  },
  navigationText: {
    color: Colors.WHITE,
  },
  text: {
    fontSize: 16,
    color: Colors.BLACK,
    textAlign: "center",
    marginVertical: 10,
  },
  error: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginVertical: 25,
  },
  attendanceHeader: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
});
