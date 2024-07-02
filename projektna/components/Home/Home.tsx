import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { Theme } from "tamagui";
import Weather from "../Weather/Weather";
import { getUser } from "../../services/api/api";
import Logout from "../LogOut/Logout";

const Home = ({ route }: { route: any }) => {
  const { uid } = route.params;

  const [users, setUsers] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUser(uid);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [uid]);

  return (
    <Theme name="blue">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.companyName}>Solution Force</Text>
          <Image
            source={require("../../assets/Logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome back, &nbsp;
              {users && users.name && (
                <Text style={styles.userName}>{`${users.name}`}</Text>
              )}
            </Text>
            <View style={styles.weatherContainer}>
              <Weather />
            </View>
          </View>
          <View style={styles.logoutContainer}>
            <Logout />
          </View>
        </View>
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  welcomeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  userName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutContainer: {
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    width: "80%",
    textAlign: "center",
  },
});

export default Home;
