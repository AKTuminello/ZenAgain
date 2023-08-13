// // AppTabNavigator.jsx
// import React, { useContext } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import HomeScreen from '../../screens/HomeScreen';
// import FunStuffScreen from '../../screens/FunStuffScreen';
// import UserScreen from '../../screens/UserScreen';
// import { AuthContext } from '../../AuthContext';
// import AuthenticationScreen from '../../screens/AuthenticationScreen';


// const Tab = createBottomTabNavigator();

// const AppTabNavigator = () => {
//   const { user } = useContext(AuthContext);

//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'FunStuff') {
//             iconName = focused ? 'gamepad-variant' : 'gamepad-variant-outline';
//           } else if (route.name === 'User') {
//             iconName = focused ? 'account' : 'account-outline';
//           }

//           return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#A99F97',
//         tabBarInactiveTintColor: '#E2DCD7',
//         tabBarStyle: {
//             display: 'flex',
//             backgroundColor: '#9b55bb', // New background color
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="FunStuff" component={FunStuffScreen} />
//       <Tab.Screen name="User" component={AuthenticationScreen} options={{ tabBarLabel: user ? 'User' : 'Sign In' }} />
//     </Tab.Navigator>
//   );
// };

// export default AppTabNavigator;
