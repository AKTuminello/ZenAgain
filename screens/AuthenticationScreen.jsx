import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../assets/globalStyles';
import Dialog from "react-native-dialog";

const AuthenticationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const navigation = useNavigation();

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const handleAuth = async () => {
    const auth = getAuth();
    const db = getFirestore();
    try {
      if (password.length < 6) {
        showDialog('Password should be at least 6 characters long!');
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Login');
      } else {
        const docRef = doc(db, 'UserInfo', username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          showDialog('Username already exists!');
          return;
        }

        try {
          await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(docRef, {
            username,
            name,
            email,
            favoriteActivity: '',
            favoriteSnacks: '',
            favoriteSongUrl: '',
            focalPointPictureUrl: '',
          });
          navigation.navigate('Login');
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            showDialog('Email already in use!');
          }
        }
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          showDialog('The email address is not valid.');
          break;
        case 'auth/user-disabled':
          showDialog('The user corresponding to the given email has been disabled.');
          break;
        case 'auth/user-not-found':
          showDialog('There is no user corresponding to the given email.');
          break;
        case 'auth/wrong-password':
          showDialog('The password is invalid for the given email, or the account corresponding to the email does not have a password set.');
          break;
        case 'auth/weak-password':
          showDialog('The password is not strong enough.');
          break;
        default:
          showDialog('An error occurred. Please try again.');
      }
    }
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      showDialog('Password reset email has been sent!');
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          showDialog('The email address is not valid.');
          break;
        case 'auth/user-not-found':
          showDialog('There is no user corresponding to this email.');
          break;
        default:
          showDialog('An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {!isLogin && (
        <>
          <Text>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Text>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </>
      )}
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleAuth}>
        {isLogin ? 'Login' : 'Sign Up'}
      </Button>
      <Button onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </Button>
      {isLogin && (
        <Button onPress={handlePasswordReset}>
          Forgot password?
        </Button>
      )}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Notification</Dialog.Title>
        <Dialog.Description>
          {dialogMessage}
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={() => setDialogVisible(false)} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AuthenticationScreen;
