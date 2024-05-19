
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from 'tamagui'
import Weather from '../Weather/Weather';
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";
import {
  H1,
  Paragraph,
  YStack
} from "tamagui";
import { getUsers } from '../../services/api/api';
const Home = () => {

  const [users, setUsers] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Theme name="blue">
      <SafeAreaView style={styles.container}>
      <MySafeAreaView>
      <MyStack>
        <YStack
          space="$4"
          maxWidth={600}
          alignItems="center"
        >
          <H1 textAlign="center">
            Welcome back, &nbsp;
            {users && users.length > 0 && users[0].name && (
                  <Text>{`${users[0].name}`}</Text>            )}
            </H1>
          <Paragraph textAlign="center" style={{ marginTop: 10 }}>
            <Weather />
          </Paragraph>
        </YStack>
      </MyStack>
    </MySafeAreaView>

       </SafeAreaView>
  </Theme>
  );
};



export const MySafeAreaView = styled(SafeAreaView, {
  name: "MySafeAreaView",
  flex: 1,
  backgroundColor: "$backgroundStrong"
});
export const MyStack = styled(YStack, {
    name: "MyStack",
    backgroundColor: "$backgroundStrong",
    flex: 1,
    justifyContent: "space-between",
    padding: "$4",
    space: "$true"
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



export default Home;