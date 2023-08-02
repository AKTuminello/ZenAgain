import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

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
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry
      />
      <Button onPress={handleAuth}>
        {isLogin ? 'Login' : 'Create Account'}
      </Button>
      <Button onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to create an account?' : 'Already have an account?'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default AuthenticationScreen;
