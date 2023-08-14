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
import { globalStyles } from './assets/globalStyles';

const MainTab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();
const UserStack = createStackNavigator();

const MainNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInNavigator /> : <LoggedOutNavigator />}
    </NavigationContainer>
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
      fontFamily: 'JosefinSans-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'JosefinSans-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'JosefinSans-Bold',
      fontWeight: 'bold',
    },
    italic: {
      fontFamily: 'JosefinSans-Italic',
      fontStyle: 'italic',
    },
    boldItalic: {
      fontFamily: 'JosefinSans-BoldItalic',
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    extraLight: {
      fontFamily: 'JosefinSans-ExtraLight',
      fontWeight: '200',
    },
    extraLightItalic: {
      fontFamily: 'JosefinSans-ExtraLightItalic',
      fontWeight: '200',
      fontStyle: 'italic',
    },
    lightItalic: {
      fontFamily: 'JosefinSans-LightItalic',
      fontWeight: '300',
      fontStyle: 'italic',
    },
    mediumItalic: {
      fontFamily: 'JosefinSans-MediumItalic',
      fontWeight: '500',
      fontStyle: 'italic',
    },
    semiBold: {
      fontFamily: 'JosefinSans-SemiBold',
      fontWeight: '600',
    },
    semiBoldItalic: {
      fontFamily: 'JosefinSans-SemiBoldItalic',
      fontWeight: '600',
      fontStyle: 'italic',
    },
    thinItalic: {
      fontFamily: 'JosefinSans-ThinItalic',
      fontWeight: '100',
      fontStyle: 'italic',
    },
  },
  components: {
    Button: {
      style: {
        backgroundColor: '#aea1d0',
      },
      contentStyle: {
        color: '#49176e',
      },
    },
  },
};

const UserStackScreen = () => (
  <UserStack.Navigator>
    <UserStack.Screen
      name="User"
      component={UserScreen}
      options={{ headerShown: false }} 
    />
    <UserStack.Screen name="MoodTracker" component={MoodTrackerScreen} />
  </UserStack.Navigator>
);

const LoggedInNavigator = () => {
  return (
    <MainTab.Navigator
      barStyle={{ backgroundColor: '#49176e' }}
      activeColor="#FFFFFF" 
      inactiveColor="#FFFFFF" 
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Fun Stuff" component={FunStuffScreen} />
      <MainTab.Screen name="My Stuff" component={UserStackScreen} />
      <MainTab.Screen name="User Gallery" component={UserGalleryScreen} />
    </MainTab.Navigator>
  );
};

const LoggedOutNavigator = () => {
  return (
    <MainTab.Navigator
      barStyle={{ backgroundColor: '#49176e' }}
      activeColor="#FFFFFF" 
      inactiveColor="#FFFFFF" 
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Fun Stuff" component={FunStuffScreen} />
      <MainTab.Screen name="Sign-in" component={AuthenticationScreen} />
    </MainTab.Navigator>
  );
};


const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext); 

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        // Variable fonts
        'JosefinSans-VariableFont_wght': require('./assets/fonts/Josefin_Sans/JosefinSans-VariableFont_wght.ttf'),
        'JosefinSans-Italic-VariableFont_wght': require('./assets/fonts/Josefin_Sans/JosefinSans-Italic-VariableFont_wght.ttf'),
  
        // Static fonts
        'JosefinSans-Regular': require('./assets/fonts/Josefin_Sans/static/JosefinSans-Regular.ttf'),
        'JosefinSans-Medium': require('./assets/fonts/Josefin_Sans/static/JosefinSans-Medium.ttf'),
        'JosefinSans-Light': require('./assets/fonts/Josefin_Sans/static/JosefinSans-Light.ttf'),
        'JosefinSans-Thin': require('./assets/fonts/Josefin_Sans/static/JosefinSans-Thin.ttf'),
        'JosefinSans-Bold': require('./assets/fonts/Josefin_Sans/static/JosefinSans-Bold.ttf'),
        'JosefinSans-Italic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-Italic.ttf'),
        'JosefinSans-BoldItalic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-BoldItalic.ttf'),
        'JosefinSans-ExtraLight': require('./assets/fonts/Josefin_Sans/static/JosefinSans-ExtraLight.ttf'),
        'JosefinSans-ExtraLightItalic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-ExtraLightItalic.ttf'),
        'JosefinSans-LightItalic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-LightItalic.ttf'),
        'JosefinSans-MediumItalic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-MediumItalic.ttf'),
        'JosefinSans-SemiBold': require('./assets/fonts/Josefin_Sans/static/JosefinSans-SemiBold.ttf'),
        'JosefinSans-SemiBoldItalic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-SemiBoldItalic.ttf'),
        'JosefinSans-ThinItalic': require('./assets/fonts/Josefin_Sans/static/JosefinSans-ThinItalic.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);
  

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoggedIn(user!==null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading && fontsLoaded) {
  
      SplashScreen.hideAsync();
    }
  }, [loading, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!animationComplete) {
  
    return <JitteryBall onComplete={() => setAnimationComplete(true)} />;
  }

  if (!agreementAccepted) {
    return <AgreementScreen onAgree={() => setAgreementAccepted(true)} />;
  }

  
  return (
    <MainNavigator/>
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