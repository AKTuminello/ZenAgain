import React, { useState, useContext, useRef } from 'react';
import { View, Alert, Image, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, doc, setDoc } from '@firebase/firestore';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import AuthInput from '../components/AuthenticationScreenComponents/AuthInput';
import AuthButton from '../components/AuthenticationScreenComponents/AuthButton';
import { globalStyles } from '../assets/globalStyles';
import { Appbar } from 'react-native-paper';

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
        navigation.navigate('My Stuff');
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
        navigation.navigate('My Stuff');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyles.container}>
        <View>
          <Appbar.Header>
            <Appbar.Content title={isLogin ? 'Login' : 'Create Account'} />
          </Appbar.Header>
          <AuthInput
            value={email}
            setValue={setEmail}
            placeholder="Email"
            style={globalStyles.inputField}
            onSubmitEditing={() => passwordInput.current.focus()}
            returnKeyType="next"
          />
          <AuthInput
            value={password}
            setValue={setPassword}
            placeholder="Password"
            secureTextEntry
            style={globalStyles.inputField}
            ref={passwordInput}
            onSubmitEditing={isLogin ? handleAuth : () => nicknameInput.current.focus()}
            returnKeyType={isLogin ? "done" : "next"}
          />
          {!isLogin && <AuthInput
            value={nickname}
            setValue={setNickname}
            placeholder="Nickname"
            style={globalStyles.inputField}
            ref={nicknameInput}
            onSubmitEditing={handleAuth}
            returnKeyType="done"
          />}
          {isLogin ? <AuthButton title="Login" onPress={handleAuth} /> : <AuthButton title="Create Account" onPress={handleAuth} />}
          <AuthButton title={isLogin ? 'Need to create an account?' : 'Already have an account?'} onPress={() => setIsLogin(!isLogin)} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image source={require('../assets/images/lotusrainbow.png')} style={{ width: Dimensions.get('window').width / 1.5, height: Dimensions.get('window').width / 1.5, resizeMode: 'contain' }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthenticationScreen;
  