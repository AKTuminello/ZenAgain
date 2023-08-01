import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

import FunStuffScreen from './screens/FunStuffScreen';
import HomeScreen from './screens/HomeScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import TestScreen from './screens/TestScreen';
import UserScreen from './screens/UserScreen';
import AuthOrUserScreen from './screens/AuthOrUserScreen';


const AuthStack = createStackNavigator();
const MainTab = createMaterialBottomTabNavigator();

const MainNavigator = ({ user }) => (
  <MainTab.Navigator>
    <MainTab.Screen name="Home" component={HomeScreen} />
    <MainTab.Screen name="FunStuff" component={FunStuffScreen} />
    <MainTab.Screen name="Login" component={AuthOrUserScreen} initialParams={{ user }} />
  </MainTab.Navigator>
);


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <MainNavigator user={user} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
