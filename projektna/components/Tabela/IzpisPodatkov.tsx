import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import React from "react";
import { User } from "../../modules/interfaces/user";
import DownloadReport from "../DownloadReport/DownloadReport";

interface IzpisPodatkovProps {
  user: User;
}

const { width } = Dimensions.get("window");

export default function IzpisPodatkov(props: IzpisPodatkovProps) {
  const userData = props.user;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {userData.attendance.length !== 0 ? (
          <View style={{ marginBottom: 32 }}>
            {userData.attendance.map((entry, index) => (
              <View key={index} style={styles.entry}>
                <Text style={styles.info}>
                  Work Start:{" "}
                  {entry.timeIn
                    ? entry.timeIn.toDate().toLocaleString("SL-SI")
                    : "Ongoing"}
                </Text>
                {entry.breaks && entry.breaks.length > 0 ? (
                  entry.breaks.map((breakEntry, breakIndex) => (
                    <View key={breakIndex} style={styles.breakInfo}>
                      <Text style={styles.info}>
                        Break Start:{" "}
                        {breakEntry.start
                          ? breakEntry.start.toDate().toLocaleString("SL-SI")
                          : "Ongoing"}
                      </Text>
                      <Text style={styles.info}>
                        Break End:{" "}
                        {breakEntry.end
                          ? breakEntry.end.toDate().toLocaleString("SL-SI")
                          : "Ongoing"}
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
                  {entry.timeOut
                    ? entry.timeOut.toDate().toLocaleString("SL-SI")
                    : "Ongoing"}
                </Text>
              </View>
            ))}
            <DownloadReport user={userData} />
          </View>
        ) : (
          <Text style={styles.info}>
            No work attendances for selected dates
          </Text>
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
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  entry: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  breakInfo: {
    marginTop: 5,
    padding: 5,
    backgroundColor: "#e9e9e9",
    borderRadius: 5,
  },
});

export default IzpisPodatkov;
