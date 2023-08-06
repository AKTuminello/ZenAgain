import React, { useState, useEffect, useContext } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { AuthProvider, AuthContext } from './AuthContext';
import * as SplashScreen from 'expo-splash-screen';

import FunStuffScreen from './screens/FunStuffScreen';
import HomeScreen from './screens/HomeScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import TestSwiperScreen from './screens/TestSwiperScreen';
import UserScreen from './screens/UserScreen';
import UserGalleryScreen from './screens/UserGalleryScreen'; // make sure this import is correct

const MainTab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();

const SignInNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="User" component={UserScreen} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthenticationScreen} />
      )}
    </RootStack.Navigator>
  );
};

const UserNavigator = () => (
  <MainTab.Navigator>
    <MainTab.Screen name="Home" component={HomeScreen} />
    <MainTab.Screen name="Fun Stuff" component={FunStuffScreen} />
    <MainTab.Screen name="My Stuff" component={UserScreen} />
    <MainTab.Screen name="User Gallery" component={UserGalleryScreen} />
  </MainTab.Navigator>
);

const MainNavigator = () => {
  const { user } = useContext(AuthContext);

  return user ? <UserNavigator /> : (
    <MainTab.Navigator>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Fun Stuff" component={FunStuffScreen} />
      <MainTab.Screen name="Sign In" component={SignInNavigator} />
    </MainTab.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#A99F97',  // the coffee color
    accent: '#E2DCD7',  // the pearl color
    // add other colors if needed
  },
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default () => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PaperProvider>
  );
};
