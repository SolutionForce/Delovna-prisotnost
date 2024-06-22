import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from 'tamagui';
import Weather from '../Weather/Weather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'tamagui';
import { H1, Paragraph, View, YStack } from 'tamagui';
import { getUser } from '../../services/api/api';
import Logout from '../LogOut/Logout';
const Home = ({ route }: { route: any }) => {
  const { uid } = route.params;

  const [users, setUsers] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUser(uid);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [uid]);

  return (
    <Theme name="blue">
      <SafeAreaView style={styles.container}>
        <MySafeAreaView>
          <MyStack>
            <YStack space="$4" maxWidth={600} alignItems="center">
              <H1 textAlign="center">
                Welcome back, &nbsp;
                {users && users.name && (
                  <Text>{`${users.name}`}</Text>
                )}
              </H1>
              <View style={{ marginTop: 10 }}>
                <Weather />
                <Logout />
              </View>
            </YStack>
          </MyStack>
        </MySafeAreaView>
      </SafeAreaView>
    </Theme>
  );
};

export const MySafeAreaView = styled(SafeAreaView, {
  name: 'MySafeAreaView',
  flex: 1,
  backgroundColor: '$backgroundStrong',
});
export const MyStack = styled(YStack, {
  name: 'MyStack',
  backgroundColor: '$backgroundStrong',
  flex: 1,
  justifyContent: 'space-between',
  padding: '$4',
  space: '$true',
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
