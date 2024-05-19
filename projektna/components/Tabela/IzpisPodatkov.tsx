import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "../../modules/interfaces/user";
import DownloadReport from "../DownloadReport/DownloadReport";

interface IzpisPodatkovProps {
  user: User;
}

export default function IzpisPodatkov(props: IzpisPodatkovProps) {
  const userData = props.user;

  /* useEffect(() => {
    // Find the user with uid = 'ebRi8pmxCgQzxRuJyPCx'
    const user = podatki.find((user) => user.uid === "ebRi8pmxCgQzxRuJyPCx");
    if (user) {
      const formattedAttendance = user.attendance.map((attendance) => ({
        timeIn:
          attendance.timeIn && attendance.timeIn.seconds
            ? new Date(attendance.timeIn.seconds * 1000)
            : null,
        timeOut:
          attendance.timeOut && attendance.timeOut.seconds
            ? new Date(attendance.timeOut.seconds * 1000)
            : null,
        breaks: attendance.breaks.map((breakEntry) => ({
          start:
            breakEntry.start && breakEntry.start.seconds
              ? new Date(breakEntry.start.seconds * 1000)
              : null,
          end:
            breakEntry.end && breakEntry.end.seconds
              ? new Date(breakEntry.end.seconds * 1000)
              : null,
          description: breakEntry.description,
        })),
      }));
      setUserData({
        ...user,
        attendance: formattedAttendance,
      });
    }
    console.log(user);
  }, [podatki]);
  console.log("iscem podatke");

  try {
    const data = podatki[0][0];
    function toDate(firebaseTimestamp) {
      return new Date(
        firebaseTimestamp.seconds * 1000 +
          firebaseTimestamp.nanoseconds / 1000000
      );
    }

    // Function to filter attendance by specific date
    function filterByDate(data, year, month, day) {
      // Convert month to 0-based index
      month = month - 1;

      return data.attendance.filter((entry) => {
        const timeInDate = toDate(entry.timeIn);
        return (
          timeInDate.getFullYear() === year &&
          timeInDate.getMonth() === month &&
          timeInDate.getDate() === day
        );
      });
    }

    // Example usage:
    //   const specificDate = { year: 2023, month: 3, day: 15 }; // 15th March 2023
    //
    console.log(selectedDate);
    let specificDate = selectedDate.split(",")
    specificDate = specificDate[0].split("/")
    console.log(specificDate);
    
    const filteredAttendance = filterByDate(
      data,
      2024,
      1,
      26
    );

    console.log(filteredAttendance);
  } catch (error) {
    console.log(error);
  } */

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Attendance Data for {userData.name} {userData.surname}
        </Text>
        {userData.attendance.length !== 0 ? (
          <View style={{marginBottom: 32}}>
            {userData.attendance.map((entry, index) => (
              <View key={index} style={styles.entry}>
                <Text style={styles.info}>
                  Work Start:{" "}
                  {entry.timeIn ? entry.timeIn.toDate().toLocaleString('SL-SI') : "Ongoing"}
                </Text>
                {entry.breaks && entry.breaks.length > 0 ? (
                  entry.breaks.map((breakEntry, breakIndex) => (
                    <View key={breakIndex} style={styles.breakInfo}>
                      <Text style={styles.info}>
                        Break Start:{" "}
                        {breakEntry.start
                          ? breakEntry.start.toDate().toLocaleString('SL-SI')
                          : "Ongoing"}
                      </Text>
                      <Text style={styles.info}>
                        Break End:{" "}
                        {breakEntry.end ? breakEntry.end.toDate().toLocaleString('SL-SI') : "Ongoing"}
                      </Text>
                      <Text style={styles.info}>
                        Description: {breakEntry.description}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.breakInfo}>
                    <Text style={styles.info}>No breaks</Text>
                  </View>
                )}
                <Text style={styles.info}>
                  Work End:{" "}
                  {entry.timeOut ? entry.timeOut.toDate().toLocaleString('SL-SI') : "Ongoing"}
                </Text>
              </View>
            ))}
            <DownloadReport user={userData} />
          </View>
        ) : (
          <Text style={styles.info}>No work attendances for selected dates</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  entry: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  breakInfo: {
    marginLeft: 10,
    backgroundColor: "#f9f9f9",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
  },
  noWork: {
    fontSize: 16,
    color: "red",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
});
