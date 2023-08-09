import React, { useContext, useState, useEffect } from 'react';
import { View, Alert, Text, ScrollView, Image, TextInput, TouchableOpacity, Modal, Switch } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Swiper from 'react-native-swiper';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut } from '@firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/app';
import 'firebase/compat/storage';
import { AuthContext } from '../AuthContext';
import { globalStyles } from '../assets/globalStyles';
import { Appbar } from 'react-native-paper';
import LogoutButton from '../components/UserScreenComponents/LogoutButton';
import { onSnapshot } from '@firebase/firestore';

import HomeScreen from './HomeScreen';
import UserGallery from './UserGalleryScreen';
import FunStuffScreen from './FunStuffScreen';
import MoodTrackerScreen from './MoodTrackerScreen';


const Stack = createStackNavigator();

const UserScreenStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="User" component={UserScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="UserGallery" component={UserGallery} />
    <Stack.Screen name="FunStuff" component={FunStuffScreen} />
  </Stack.Navigator>
);


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
  const [profilePicText, setProfilePicText] = useState('');
  const [favePic1Text, setFavePic1Text] = useState('');
  const [favePic2Text, setFavePic2Text] = useState('');
  const [favePic3Text, setFavePic3Text] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ uri: null, name: null });
  const [selectedImageDisplayFunStuff, setSelectedImageDisplayFunStuff] = useState(false);
  const [selectedImageDisplayUserGallery, setSelectedImageDisplayUserGallery] = useState(false);
  const [selectedImageText, setSelectedImageText] = useState('');

  useEffect(() => {
    if (user) {
      fetchNickname();
      const unsub = fetchUserDoc();
  
      // Cleanup function
      return () => unsub();
    }
  }, [user]);
  

  const fetchNickname = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().nickname) {
      setNickname(userDoc.data().nickname);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      allowsMultipleSelection: false,
    });
    return result.canceled ? null : result.assets[0].uri;
  };

  const uploadImage = async (uri, path) => {
    let URL;
    const blob = await uriToBlob(uri);
    const storageRef = ref(getStorage(firebase), path);
    await uploadBytesResumable(storageRef, blob);
    await getDownloadURL(storageRef).then((url) => {
      URL = url;
    });
    return URL;
  };

  const handleChooseImage = async (
    fieldName,
    displayInFunStuff,
    displayInUserGallery
  ) => {
    const uri = await pickImage();
    if (uri) {
      const imageUrl = await uploadImage(uri, `images/${Date.now()}_img.png`);
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          [fieldName]: imageUrl,
          [`${fieldName}_text`]: selectedImageText, // updated here
          [`${fieldName}_displayInFunStuff`]: displayInFunStuff,
          [`${fieldName}_displayInUserGallery`]: displayInUserGallery,
        },
        { merge: true }
      );
      handleImageTextUpdate(selectedImage.name.split(' ').join('').toLowerCase(), selectedImageText);
    }
  };
  
  const handleImageTextUpdate = async (fieldName, text) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { [`${fieldName}_text`]: text }, { merge: true });
  
    switch (fieldName) {
      case 'profilePic':
        setProfilePicText(text);
        break;
      case 'favePic1':
        setFavePic1Text(text);
        break;
      case 'favePic2':
        setFavePic2Text(text);
        break;
      case 'favePic3':
        setFavePic3Text(text);
        break;
      default:
        break;
    }
    setModalVisible(false);
    setSelectedImageText('');
  };

  const fetchUserDoc = () => {
    const docRef = doc(getFirestore(), 'users', user.uid);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setProfilePic(userData.profilePic || null);
        setProfilePicText(userData.myprofilepic_text || '');
        console.log(`Profile picture text: ${userData.myprofilepic_text}`);
        setProfilePicDisplayInFunStuff(userData.profilePic_displayInFunStuff || false);
        setProfilePicDisplayInUserGallery(userData.profilePic_displayInUserGallery || false);
        setFavePic1(userData.favePic1 || null);
        setFavePic1Text(userData.myfavoriteimage_text || '');
        console.log(`Fave picture 1 text: ${userData.myfavoriteimage_text}`);
        setFavePic1DisplayInFunStuff(userData.favePic1_displayInFunStuff || false);
        setFavePic1DisplayInUserGallery(userData.favePic1_displayInUserGallery || false);
        setFavePic2(userData.favePic2 || null);
        setFavePic2Text(userData.mysecondfavorite_text || '');
        console.log(`Fave picture 2 text: ${userData.mysecondfavorite_text}`);
        setFavePic2DisplayInFunStuff(userData.favePic2_displayInFunStuff || false);
        setFavePic2DisplayInUserGallery(userData.favePic2_displayInUserGallery || false);
        setFavePic3(userData.favePic3 || null);
        setFavePic3Text(userData.mythirdfavorite_text || '');
        console.log(`Fave picture 3 text: ${userData.mythirdfavorite_text}`);
        setFavePic3DisplayInFunStuff(userData.favePic3_displayInFunStuff || false);
        setFavePic3DisplayInUserGallery(userData.favePic3_displayInUserGallery || false);
      }
    });
  
    return () => unsub();
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

  const handleImagePress = (uri, name) => {
    setSelectedImage({ uri, name });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    handleImageTextUpdate(selectedImage.name.split(' ').join('').toLowerCase(), selectedImageText);
    setModalVisible(false);
    setSelectedImageDisplayFunStuff(false);
    setSelectedImageDisplayUserGallery(false);
    setSelectedImageText('');
  };

  const handleDeleteImage = async (fieldName) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data()[fieldName]) {
      const imageUrl = userDoc.data()[fieldName];
      const storageRef = ref(getStorage(firebase), imageUrl);
      await deleteObject(storageRef);

      await updateDoc(userDocRef, {
        [fieldName]: firebase.firestore.FieldValue.delete(),
        [`${fieldName}_text`]: firebase.firestore.FieldValue.delete(),
        [`${fieldName}_displayInFunStuff`]: firebase.firestore.FieldValue.delete(),
        [`${fieldName}_displayInUserGallery`]: firebase.firestore.FieldValue.delete()
      });

      switch (fieldName) {
        case 'profilePic':
          setProfilePic(null);
          setProfilePicText('');
          setProfilePicDisplayInFunStuff(false);
          setProfilePicDisplayInUserGallery(false);
          break;
        case 'favePic1':
          setFavePic1(null);
          setFavePic1Text('');
          setFavePic1DisplayInFunStuff(false);
          setFavePic1DisplayInUserGallery(false);
          break;
        case 'favePic2':
          setFavePic2(null);
          setFavePic2Text('');
          setFavePic2DisplayInFunStuff(false);
          setFavePic2DisplayInUserGallery(false);
          break;
        case 'favePic3':
          setFavePic3(null);
          setFavePic3Text('');
          setFavePic3DisplayInFunStuff(false);
          setFavePic3DisplayInUserGallery(false);
          break;
        default:
          break;
      }
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title={`Welcome ${nickname || 'User'}`} />
        <LogoutButton handleLogout={handleLogout} />
      </Appbar.Header>
      <View style={globalStyles.container}>
        <Swiper autoplay={true} showsPagination={false} showsButtons={true} style={{ backgroundColor: '#CCC4be' }}>
          
          {[
            { uri: profilePic, name: 'My Profile Pic', text: profilePicText },
            { uri: favePic1, name: 'My Favorite Image', text: favePic1Text },
            { uri: favePic2, name: 'My Second Favorite', text: favePic2Text },
            { uri: favePic3, name: 'My Third Favorite', text: favePic3Text },
          ].map((image, index) => (
            <TouchableOpacity key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleImagePress(image.uri, image.name)}>
              <Text>{image.name}</Text>
              {image.uri ? (
                <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
              ) : (
                <View style={{ width: 200, height: 200, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>No Image</Text>
                </View>
              )}
              <Text>{image.text}</Text>
            </TouchableOpacity>
          ))}
        </Swiper>
        <MoodTrackerScreen /> 
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
          <View style={{ height: '75%', width: '90%', backgroundColor: '#FFB7D5', borderRadius: 20, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text>What do you want to change about this image?</Text>

            <TextInput
              value={selectedImageText}
              onChangeText={setSelectedImageText}
              onEndEditing={() => handleImageTextUpdate(selectedImage.name.split(' ').join('').toLowerCase(), selectedImageText)}
              placeholder="Enter image text"
              style={{ width: '80%', padding: 10, borderWidth: 1, borderRadius: 5, marginTop: 10 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', marginTop: 10 }}>
              <Text>Display in Fun Stuff:</Text>
              <Switch
                value={selectedImageDisplayFunStuff}
                onValueChange={setSelectedImageDisplayFunStuff}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', marginTop: 10 }}>
              <Text>Display in User Gallery:</Text>
              <Switch
                value={selectedImageDisplayUserGallery}
                onValueChange={setSelectedImageDisplayUserGallery}
              />
            </View>

            <TouchableOpacity style={{ backgroundColor: '#D3D3D3', borderRadius: 10, padding: 10, margin: 10 }} onPress={() => {
              handleChooseImage(selectedImage.name.split(' ').join('').toLowerCase(), selectedImageDisplayFunStuff, selectedImageDisplayUserGallery, selectedImageText);
              handleImageTextUpdate(selectedImage.name.split(' ').join('').toLowerCase(), selectedImageText);
            }}>
              <Text>Choose a new image.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#D3D3D3', borderRadius: 10, padding: 10, margin: 10 }} onPress={() => handleDeleteImage(selectedImage.name.split(' ').join('').toLowerCase())}>
              <Text>Delete this image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#D3D3D3', borderRadius: 10, padding: 10, margin: 10 }} onPress={handleModalClose}>
              <Text>I'm done.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


export default UserScreen;
