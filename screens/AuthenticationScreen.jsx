import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, doc, setDoc } from '@firebase/firestore';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import AuthInput from '../components/AuthenticationScreenComponents/AuthInput';
import AuthButton from '../components/AuthenticationScreenComponents/AuthButton';
import { Appbar } from 'react-native-paper';
import { globalStyles } from '../assets/globalStyles';


const AuthenticationScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const passwordInput = useRef(null);
  const nicknameInput = useRef(null);

  const handleAuth = async () => {
    const auth = getAuth();
    const db = getFirestore();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        authContext.setIsLoggedIn(true);
        navigation.navigate('User');
      } else {
        if (nickname.length < 3) {
          Alert.alert('Error', 'Nickname should be at least 3 characters long');
          return;
        }
        if (nickname.length > 30) {
          Alert.alert('Error', 'Nickname should not exceed 30 characters');
          return;
        }
        if (!/^[a-zA-Z0-9]+$/.test(nickname)) {
          Alert.alert('Error', 'Nickname can only contain alphanumeric characters');
          return;
        }
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { email, nickname });
        authContext.setIsLoggedIn(true);
        navigation.navigate('User');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
  <Appbar.Content title={isLogin ? 'Login' : 'Create Account'} />
</Appbar.Header>

      <AuthInput
        value={email}
        setValue={setEmail}
        placeholder="Email"
        onSubmitEditing={() => passwordInput.current.focus()}
        returnKeyType="next"
      />
      <AuthInput
        value={password}
        setValue={setPassword}
        placeholder="Password"
        secureTextEntry
        ref={passwordInput}
        onSubmitEditing={isLogin ? handleAuth : () => nicknameInput.current.focus()}
        returnKeyType={isLogin ? "done" : "next"}
      />
      {!isLogin && <AuthInput
        value={nickname}
        setValue={setNickname}
        placeholder="Nickname"
        ref={nicknameInput}
        onSubmitEditing={handleAuth}
        returnKeyType="done"
      />}
      {isLogin ? <AuthButton title="Login" onPress={handleAuth} /> : <AuthButton title="Create Account" onPress={handleAuth} />}
      <AuthButton title={isLogin ? 'Need to create an account?' : 'Already have an account?'} onPress={() => setIsLogin(!isLogin)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default AuthenticationScreen;
