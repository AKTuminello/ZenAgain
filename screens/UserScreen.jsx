import React, { useContext, useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { getAuth, signOut } from '@firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../AuthContext';
import { globalStyles } from '../assets/globalStyles';
import { Appbar } from 'react-native-paper';
import LogoutButton from '../components/LogoutButton';
import ProfilePicButton from '../components/ProfilePicButton';
import FaveImageButton from '../components/FaveImageButton';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../firebaseConfig';

const UserScreen = () => {
  const auth = getAuth();
  const { user } = useContext(AuthContext);
  const [nickname, setNickname] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [favePic1, setFavePic1] = useState(null);
  const [favePic2, setFavePic2] = useState(null);
  const [favePic3, setFavePic3] = useState(null);

  const uploadImageAsync = async (uri, newFileName) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `/${user.uid}/faveImages/${newFileName}`);
      const snapshot = await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`Download URL for uploaded image: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error("Failed to upload image. Error:", error);
      return null;
    }
  };

  const handleFaveImageSelection = async (fieldName) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.cancelled) {
        const newFileName = `faveImage_${Date.now()}.jpg`;
        const imageUrl = await uploadImageAsync(result.uri, newFileName);
        if (imageUrl) {
          // TODO: Update the user's profile with the imageUrl
        }
      }
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out!");
      })
      .catch((error) => {
        console.error("Failed to sign out. Error:", error);
      });
  };
  
  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title={user ? `Welcome, ${nickname || '...'}` : 'Welcome! Please sign in.'} />
        {user && <LogoutButton handleLogout={handleLogout} />}
      </Appbar.Header>

      {user && <ProfilePicButton handleChooseImage={() => handleFaveImageSelection('profilePic')} />}
      {user && <FaveImageButton handleChooseImage={() => handleFaveImageSelection('favePic1')} text="My Favorite Image" />}
      {user && <FaveImageButton handleChooseImage={() => handleFaveImageSelection('favePic2')} text="My Second Favorite" />}
      {user && <FaveImageButton handleChooseImage={() => handleFaveImageSelection('favePic3')} text="My Third Favorite" />}

      {user && profilePic && <Image source={{ uri: profilePic }} style={{ width: 100, height: 100 }} />}
      {user && favePic1 && <Image source={{ uri: favePic1 }} style={{ width: 100, height: 100 }} />}
      {user && favePic2 && <Image source={{ uri: favePic2 }} style={{ width: 100, height: 100 }} />}
      {user && favePic3 && <Image source={{ uri: favePic3 }} style={{ width: 100, height: 100 }} />}
    </View>
  );
};

export default UserScreen;
