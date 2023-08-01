import React from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from '@firebase/auth';

const UserScreen = ({ user }) => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View>
      <Text>Welcome, {user.email}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default UserScreen;
