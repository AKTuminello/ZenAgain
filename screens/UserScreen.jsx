import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { getAuth, signOut } from '@firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../AuthContext';
import { globalStyles } from '../assets/globalStyles';

const UserScreen = () => {
  const auth = getAuth();
  const { user, setUser } = useContext(AuthContext);
  const [nickname, setNickname] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleNicknameSubmit = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { nickname });
    setDialogVisible(false);
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      uploadImage(result.uri);
    }
};


  const uploadImage = async (uri) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePics/${user.uid}`);
    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          updateProfilePic(downloadURL);
        });
      }
    );
  };

  const updateProfilePic = async (downloadURL) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { profilePic: downloadURL });
  };

  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      const fetchNickname = async () => {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().nickname) {
          setNickname(userDoc.data().nickname);
          setDialogVisible(false);
        } else {
          console.log('No such document!');
        }
      };
      fetchNickname();
    }
  }, [user]);

  return (
    <View style={globalStyles.container}>
      {user ? (
        <>
          <Text style={{ ...globalStyles.title, color: '#532915' }}>
            Welcome{nickname ? `, ${nickname}` : ''}!
          </Text>
          {dialogVisible && (
            <>
              <Text>Please choose a nickname. Remember, you only get to do this once, so choose carefully!</Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                value={nickname}
                onChangeText={setNickname}
                onSubmitEditing={handleNicknameSubmit}
              />
            </>
          )}
          <Button title="Choose Profile Picture" onPress={handleChooseImage} color="532915" />
          <Button title="Logout" onPress={handleLogout} color="532915" />
        </>
      ) : (
        <Text style={{ ...globalStyles.title, color: '#532915' }}>You are not logged in.</Text>
      )}
    </View>
  );
};

export default UserScreen;
