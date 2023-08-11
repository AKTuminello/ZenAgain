import React, { useState, useEffect, useContext } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { AuthProvider, AuthContext } from './AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import JitteryBall from './JitteryBall';
import AgreementScreen from './screens/AgreementScreen';
import FunStuffScreen from './screens/FunStuffScreen';
import HomeScreen from './screens/HomeScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import UserScreen from './screens/UserScreen';
import UserGalleryScreen from './screens/UserGalleryScreen';
import * as Font from 'expo-font';
import MoodTrackerScreen from './screens/MoodTrackerScreen';

const MainTab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();
const UserStack = createStackNavigator();

const SignInNavigator = () => {
  const { user } = useContext(AuthContext);
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="User" component={UserNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthenticationScreen} />
      )}
    </RootStack.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#bee4ed',
    accent: '#49176e',
    background: '#aea1d0',
    surface: '#bee4ed',
    text: '#00525e',
    error: '#a4b4be',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'JosefinSans-VariableFont_wght',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'JosefinSans-VariableFont_wght',
      fontWeight: 'bold',
    },
    light: {
      fontFamily: 'JosefinSans-VariableFont_wght',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'JosefinSans-VariableFont_wght',
      fontWeight: 'normal',
    },
  },
};

const UserStackScreen = () => (
  <UserStack.Navigator>
    <UserStack.Screen name="User" component={UserScreen} />
    <UserStack.Screen name="MoodTracker" component={MoodTrackerScreen} />
  </UserStack.Navigator>
);

const UserNavigator = () => {
  return (
    <MainTab.Navigator
      barStyle={{ backgroundColor: theme.colors.primary }}
      activeColor={theme.colors.text}
      inactiveColor={theme.colors.accent}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Fun Stuff" component={FunStuffScreen} />
      <MainTab.Screen name="My Stuff" component={UserStackScreen} />
      <MainTab.Screen name="User Gallery" component={UserGalleryScreen} />
    </MainTab.Navigator>
  );
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'JosefinSans-VariableFont_wght': require('./assets/fonts/Josefin_Sans/JosefinSans-VariableFont_wght.ttf'),
        'JosefinSans-Italic-VariableFont_wght': require('./assets/fonts/Josefin_Sans/JosefinSans-Italic-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
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
    if (!loading && fontsLoaded) {
      console.log("Splash screen hidden");
      SplashScreen.hideAsync();
    }
  }, [loading, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!animationComplete) {
    console.log("Showing JitteryBall");
    return <JitteryBall onComplete={() => setAnimationComplete(true)} />;
  }

  if (!agreementAccepted) {
    return <AgreementScreen onAgree={() => setAgreementAccepted(true)} />;
  }

  console.log("Showing MainNavigator");
  return (
    <NavigationContainer>
      <SignInNavigator />
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
