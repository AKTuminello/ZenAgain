import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from '@firebase/auth';
import { AuthContext } from '../AuthContext';
import { globalStyles } from '../assets/globalStyles';

const UserScreen = () => {
  const auth = getAuth();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      {user ? (
        <>
          <Text style={{ ...globalStyles.title, color: '#e2dcd7' }}>Welcome, {user.email}!</Text>
          <Button title="Logout" onPress={handleLogout} color="lavender" />
        </>
      ) : (
        <Text style={{ ...globalStyles.title, color: '#c9d9cb' }}>You are not logged in.</Text>
      )}
    </View>
  );
};

export default UserScreen;
