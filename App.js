import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import FunStuffScreen from './screens/FunStuffScreen';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <PaperProvider>
      <HomeScreen />
      <FunStuffScreen />
    </PaperProvider>
  );
};

export default App;
