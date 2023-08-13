import React, { useState, useContext, useRef } from 'react';
import { View, Alert, Image, Dimensions, TouchableOpacity, Text, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth';
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const passwordInput = useRef(null);
  const nicknameInput = useRef(null);

  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'The email address does not seem correct.',
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Wrong password. Please try again.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/email-already-in-use': 'The email address is already in use by another account.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  };

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
      const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
      Alert.alert('Error', friendlyErrorMessage);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      Alert.alert('Success', 'A password reset email has been sent to your email address.');
      setShowForgotPassword(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Action icon="home" onPress={() => navigation.navigate('HomeScreen')} />
        <Appbar.Content title="Login" />
      </Appbar.Header>
      {isLogin && !showForgotPassword && (
        <View>
          <AuthInput value={email} setValue={setEmail} placeholder="Email" />
          <AuthInput value={password} setValue={setPassword} placeholder="Password" secureTextEntry />
          <AuthButton title="Login" onPress={handleAuth} />
          <AuthButton title="Need to create an account?" onPress={() => setIsLogin(!isLogin)} />
          <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
            <Text style={{ textAlign: 'center', color: '#2E5090' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      )}
      {showForgotPassword && (
        <View>
          <Text>Please enter your email address:</Text>
          <TextInput
            value={forgotEmail}
            onChangeText={setForgotEmail}
            placeholder="Email"
          />
          <AuthButton title="Send Password Reset Email" onPress={handleForgotPassword} />
          <TouchableOpacity onPress={() => setShowForgotPassword(false)}>
            <Text style={{ textAlign: 'center', color: '#2E5090' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isLogin && (
        <View>
          <AuthInput value={nickname} setValue={setNickname} placeholder="Nickname" />
          <AuthInput value={email} setValue={setEmail} placeholder="Email" />
          <AuthInput value={password} setValue={setPassword} placeholder="Password" secureTextEntry />
          <AuthButton title="Create Account" onPress={handleAuth} />
          <AuthButton title="Already have an account?" onPress={() => setIsLogin(!isLogin)} />
        </View>
      )}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
        <Image source={require('../assets/images/lotusrainbow.png')} style={{ width: Dimensions.get('window').width / 1.5, height: Dimensions.get('window').width / 1.5, resizeMode: 'contain' }} />
      </View>
    </View>
  );
};

export default AuthenticationScreen;
