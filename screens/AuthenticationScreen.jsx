import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';

const AuthenticationScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const handleAuth = async () => {
    const auth = getAuth();
    const db = getFirestore();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful'); // Logging statement
        authContext.setIsLoggedIn(true);
        navigation.navigate('User');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { email });
        authContext.setIsLoggedIn(true);
        navigation.navigate('User');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={isLogin ? 'Login' : 'Create Account'} />
      </Appbar.Header>
      <AuthInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        autoCapitalize="none"
      />
      <AuthInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry
      />
      <AuthButton onPress={handleAuth}>
        {isLogin ? 'Login' : 'Create Account'}
      </AuthButton>
      <AuthButton onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to create an account?' : 'Already have an account?'}
      </AuthButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    paddingTop: 50,
  },
});

export default AuthenticationScreen;
