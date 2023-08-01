import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import AuthenticationScreen from './AuthenticationScreen';
import UserScreen from './UserScreen';

const AuthOrUserScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return subscriber;
  }, [initializing]);

  if (initializing) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <UserScreen user={user} /> : <AuthenticationScreen />;
};

export default AuthOrUserScreen;
