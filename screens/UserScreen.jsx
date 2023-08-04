import React, { useContext, useState, useEffect } from 'react';
import { View, Image, Alert, Switch, Text } from 'react-native';
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
import firebase from 'firebase/app';
import 'firebase/compat/storage';

const UserScreen = () => {
  const auth = getAuth();
  const { user } = useContext(AuthContext);
  const [nickname, setNickname] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [favePic1, setFavePic1] = useState(null);
  const [favePic2, setFavePic2] = useState(null);
  const [favePic3, setFavePic3] = useState(null);
  const [profilePicDisplayInFunStuff, setProfilePicDisplayInFunStuff] = useState(false);
  const [profilePicDisplayInUserGallery, setProfilePicDisplayInUserGallery] = useState(false);
  const [favePic1DisplayInFunStuff, setFavePic1DisplayInFunStuff] = useState(false);
  const [favePic1DisplayInUserGallery, setFavePic1DisplayInUserGallery] = useState(false);
  const [favePic2DisplayInFunStuff, setFavePic2DisplayInFunStuff] = useState(false);
  const [favePic2DisplayInUserGallery, setFavePic2DisplayInUserGallery] = useState(false);
  const [favePic3DisplayInFunStuff, setFavePic3DisplayInFunStuff] = useState(false);
  const [favePic3DisplayInUserGallery, setFavePic3DisplayInUserGallery] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNickname().catch((error) => {
        console.error('Error fetching nickname: ', error);
        Alert.alert('Error', 'Could not fetch nickname. Please try again later.');
      });

      fetchUserDoc().catch((error) => {
        console.error('Error fetching user document: ', error);
        Alert.alert('Error', 'Could not fetch user document. Please try again later.');
      });
    }
  }, [user]);

  const fetchNickname = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().nickname) {
      setNickname(userDoc.data().nickname);
    } else {
      console.log('No such document!');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        allowsMultipleSelection: false,
      });
      return result.canceled ? null : result.assets[0].uri;
    } catch (e) {
      throw e;
    }
  };

  const uploadImage = async (uri, path) => {
    let URL;
    try {
      const blob = await uriToBlob(uri);
      const storageRef = ref(getStorage(firebase), path);
      await uploadBytesResumable(storageRef, blob);
      await getDownloadURL(storageRef).then((url) => {
        URL = url;
      });
      return URL;
    } catch (e) {
      throw e;
    }
  };

  const handleFaveImageSelection = async (
    fieldName,
    displayInFunStuff,
    displayInUserGallery
  ) => {
    try {
      const uri = await pickImage();
      const imageUrl = await uploadImage(
        uri,
        `images/${Date.now()}_img.png`
      );
  
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          [fieldName]: imageUrl,
          [`${fieldName}_displayInFunStuff`]: displayInFunStuff,
          [`${fieldName}_displayInUserGallery`]: displayInUserGallery,
        },
        { merge: true }
      );
  
      switch (fieldName) {
        case 'profilePic':
          setProfilePic(imageUrl);
          break;
        case 'favePic1':
          setFavePic1(imageUrl);
          break;
        case 'favePic2':
          setFavePic2(imageUrl);
          break;
        case 'favePic3':
          setFavePic3(imageUrl);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling fave image selection: ', error);
      Alert.alert('Error', 'Could not handle fave image selection. Please try again.');
    }
  };
  

  const fetchUserDoc = async () => {
    const docRef = doc(getFirestore(), 'users', user.uid);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("User data fetched: ", userData);  // Add this line
      setProfilePic(userData.profilePic || null);
      setProfilePicDisplayInFunStuff(userData.profilePic_displayInFunStuff || false);
      setProfilePicDisplayInUserGallery(userData.profilePic_displayInUserGallery || false);
      setFavePic1(userData.favePic1 || null);
      setFavePic1DisplayInFunStuff(userData.favePic1_displayInFunStuff || false);
      setFavePic1DisplayInUserGallery(userData.favePic1_displayInUserGallery || false);
      setFavePic2(userData.favePic2 || null);
      setFavePic2DisplayInFunStuff(userData.favePic2_displayInFunStuff || false);
      setFavePic2DisplayInUserGallery(userData.favePic2_displayInUserGallery || false);
      setFavePic3(userData.favePic3 || null);
      setFavePic3DisplayInFunStuff(userData.favePic3_displayInFunStuff || false);
      setFavePic3DisplayInUserGallery(userData.favePic3_displayInUserGallery || false);
    }
  };
  
  const handleImageDisplayToggle = async (fieldName, displayLocation) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);

    const currentValue =
      fieldName === 'profilePic'
        ? displayLocation === 'FunStuff'
          ? profilePicDisplayInFunStuff
          : profilePicDisplayInUserGallery
        : fieldName === 'favePic1'
        ? displayLocation === 'FunStuff'
          ? favePic1DisplayInFunStuff
          : favePic1DisplayInUserGallery
        : fieldName === 'favePic2'
        ? displayLocation === 'FunStuff'
          ? favePic2DisplayInFunStuff
          : favePic2DisplayInUserGallery
        : fieldName === 'favePic3'
        ? displayLocation === 'FunStuff'
          ? favePic3DisplayInFunStuff
          : favePic3DisplayInUserGallery
        : null;

    await setDoc(userDocRef, { [`${fieldName}_displayIn${displayLocation}`]: !currentValue }, { merge: true });

    if (fieldName === 'profilePic') {
      if (displayLocation === 'FunStuff') {
        setProfilePicDisplayInFunStuff(!currentValue);
      } else {
        setProfilePicDisplayInUserGallery(!currentValue);
      }
    } else if (fieldName === 'favePic1') {
      if (displayLocation === 'FunStuff') {
        setFavePic1DisplayInFunStuff(!currentValue);
      } else {
        setFavePic1DisplayInUserGallery(!currentValue);
      }
    } else if (fieldName === 'favePic2') {
      if (displayLocation === 'FunStuff') {
        setFavePic2DisplayInFunStuff(!currentValue);
      } else {
        setFavePic2DisplayInUserGallery(!currentValue);
      }
    } else if (fieldName === 'favePic3') {
      if (displayLocation === 'FunStuff') {
        setFavePic3DisplayInFunStuff(!currentValue);
      } else {
        setFavePic3DisplayInUserGallery(!currentValue);
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title={`Welcome ${nickname || 'User'}`} />
        <LogoutButton handleLogout={handleLogout} />
      </Appbar.Header>
      <ProfilePicButton handleProfilePicSelection={() => handleFaveImageSelection('profilePic', false, true)} />
      <FaveImageButton handleFaveImageSelection={() => handleFaveImageSelection('favePic1', false, false)} />
      {user && profilePic && (
        <View>
          <Image source={{ uri: profilePic }} style={{ width: 100, height: 100 }} />
          <View>
            <Text>Display in FunStuff:</Text>
            <Switch
              value={profilePicDisplayInFunStuff}
              onValueChange={() => handleImageDisplayToggle('profilePic', 'FunStuff')}
            />
          </View>
          <View>
            <Text>Display in UserGallery:</Text>
            <Switch
              value={profilePicDisplayInUserGallery}
              onValueChange={() => handleImageDisplayToggle('profilePic', 'UserGallery')}
            />
          </View>
        </View>
      )}
      {user && favePic1 && (
        <View>
          <Image source={{ uri: favePic1 }} style={{ width: 100, height: 100 }} />
          <View>
            <Text>Display in FunStuff:</Text>
            <Switch
              value={favePic1DisplayInFunStuff}
              onValueChange={() => handleImageDisplayToggle('favePic1', 'FunStuff')}
            />
          </View>
          <View>
            <Text>Display in UserGallery:</Text>
            <Switch
              value={favePic1DisplayInUserGallery}
              onValueChange={() => handleImageDisplayToggle('favePic1', 'UserGallery')}
            />
          </View>
        </View>
      )}
      {user && favePic2 && (
        <View>
          <Image source={{ uri: favePic2 }} style={{ width: 100, height: 100 }} />
          <View>
            <Text>Display in FunStuff:</Text>
            <Switch
              value={favePic2DisplayInFunStuff}
              onValueChange={() => handleImageDisplayToggle('favePic2', 'FunStuff')}
            />
          </View>
          <View>
            <Text>Display in UserGallery:</Text>
            <Switch
              value={favePic2DisplayInUserGallery}
              onValueChange={() => handleImageDisplayToggle('favePic2', 'UserGallery')}
            />
          </View>
        </View>
      )}
      {user && favePic3 && (
        <View>
          <Image source={{ uri: favePic3 }} style={{ width: 100, height: 100 }} />
          <View>
            <Text>Display in FunStuff:</Text>
            <Switch
              value={favePic3DisplayInFunStuff}
              onValueChange={() => handleImageDisplayToggle('favePic3', 'FunStuff')}
            />
          </View>
          <View>
            <Text>Display in UserGallery:</Text>
            <Switch
              value={favePic3DisplayInUserGallery}
              onValueChange={() => handleImageDisplayToggle('favePic3', 'UserGallery')}
            />
          </View>
        </View>
      )}
      {nickname && <Text>Nickname: {nickname}</Text>}
    </View>
  );
};

export default UserScreen;
