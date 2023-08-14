import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Switch, Image, TextInput,SafeAreaView, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Swiper from 'react-native-swiper';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut } from '@firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import firebase from 'firebase/app';
import 'firebase/compat/storage';
import { AuthContext } from '../AuthContext';
import { Appbar } from 'react-native-paper';
import LogoutButton from '../components/UserScreenComponents/LogoutButton';
import { onSnapshot, updateDoc } from '@firebase/firestore';
import { KeyboardAvoidingView } from 'react-native';
import { globalStyles } from '../assets/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import leftfacing from '../assets/leftfacing.png';
import rightfacing from '../assets/rightfacing.png';


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
    <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} /> 
  </Stack.Navigator>
);

const UserScreen = ({ navigation }) => {
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
  const [myprofilepic_text, setmyprofilepic_text] = useState('');
  const [favePic1Text, setFavePic1Text] = useState('');
  const [favePic2Text, setFavePic2Text] = useState('');
  const [favePic3Text, setFavePic3Text] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ uri: null, name: null });
  const [selectedImageDisplayFunStuff, setSelectedImageDisplayFunStuff] = useState(false);
  const [selectedImageDisplayUserGallery, setSelectedImageDisplayUserGallery] = useState(false);
  const [selectedImageText, setSelectedImageText] = useState('');
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [aboutText, setAboutText] = useState(''); 
  const [aboutDisplayInFunStuff, setAboutDisplayInFunStuff] = useState(false); 
  const [aboutDisplayInUserGallery, setAboutDisplayInUserGallery] = useState(false);




  useEffect(() => {
    if (user) {
      fetchNickname();
      const unsub = fetchUserDoc();
  
      
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
    setIsLoggedIn(false); 
    setUser(null); 
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
          [`${fieldName}_displayInFunStuff`]: displayInFunStuff,
          [`${fieldName}_displayInUserGallery`]: displayInUserGallery,
        },
        { merge: true }
      );
    }

  
      
      switch (fieldName) {
        case 'profilePic':
          setmyprofilepic_text(selectedImageText);
          break;
        case 'favePic1':
          setFavePic1Text(selectedImageText);
          break;
        case 'favePic2':
          setFavePic2Text(selectedImageText);
          break;
        case 'favePic3':
          setFavePic3Text(selectedImageText);
          break;
        default:
          break;
      }
    }
  
  
  const handleImageTextUpdate = async (fieldName, text) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { [`${fieldName}_text`]: text }, { merge: true });
  
    switch (fieldName) {
      case 'profilePic':
        setmyprofilepic_text(text);
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
        setProfilePic(userData.myprofilepic || null);
        setmyprofilepic_text(userData.myprofilepic_text || '');
        setProfilePicDisplayInFunStuff(userData.myprofilepic_displayInFunStuff || false);
        setProfilePicDisplayInUserGallery(userData.myprofilepic_displayInUserGallery || false);
        setFavePic1(userData.myfavoriteimage || null);
        setFavePic1Text(userData.myfavoriteimage_text || '');
        setFavePic1DisplayInFunStuff(userData.myfavoriteimage_displayInFunStuff || false);
        setFavePic1DisplayInUserGallery(userData.myfavoriteimage_displayInUserGallery || false);
        setFavePic2(userData.mysecondfavorite || null);
        setFavePic2Text(userData.mysecondfavorite_text || '');
        setFavePic2DisplayInFunStuff(userData.mysecondfavorite_displayInFunStuff || false);
        setFavePic2DisplayInUserGallery(userData.mysecondfavorite_displayInUserGallery || false);
        setFavePic3(userData.mythirdfavorite || null);
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
      fieldName === 'myprofilepic'
        ? displayLocation === 'FunStuff'
          ? profilePicDisplayInFunStuff
          : profilePicDisplayInUserGallery
        : fieldName === 'myfavoriteimage'
        ? displayLocation === 'FunStuff'
          ? favePic1DisplayInFunStuff
          : favePic1DisplayInUserGallery
        : fieldName === 'mysecondfavorite'
        ? displayLocation === 'FunStuff'
          ? favePic2DisplayInFunStuff
          : favePic2DisplayInUserGallery
        : fieldName === 'mythirdfavorite'
        ? displayLocation === 'FunStuff'
          ? favePic3DisplayInFunStuff
          : favePic3DisplayInUserGallery
        : null;

    await setDoc(userDocRef, { [`${fieldName}_displayIn${displayLocation}`]: !currentValue }, { merge: true });

    if (fieldName === 'myprofilepic') {
      if (displayLocation === 'FunStuff') {
        setProfilePicDisplayInFunStuff(!currentValue);
      } else {
        setProfilePicDisplayInUserGallery(!currentValue);
      }
    } else if (fieldName === 'myfavoriteimage') {
      if (displayLocation === 'FunStuff') {
        setFavePic1DisplayInFunStuff(!currentValue);
      } else {
        setFavePic1DisplayInUserGallery(!currentValue);
      }
    } else if (fieldName === 'mysecondfavorite') {
      if (displayLocation === 'FunStuff') {
        setFavePic2DisplayInFunStuff(!currentValue);
      } else {
        setFavePic2DisplayInUserGallery(!currentValue);
      }
    } else if (fieldName === 'mythirdfavorite') {
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

  const handleModalClose = async () => {
    const fieldName = selectedImage.name.split(' ').join('').toLowerCase();
    
    await handleImageTextUpdate(fieldName, selectedImageText);
    
    await handleImageDisplayToggle(fieldName, 'FunStuff', selectedImageDisplayFunStuff);
    await handleImageDisplayToggle(fieldName, 'UserGallery', selectedImageDisplayUserGallery);
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
        case 'myprofilepic':
          setProfilePic(null);
          setmyprofilepic_text('');
          setProfilePicDisplayInFunStuff(false);
          setProfilePicDisplayInUserGallery(false);
          break;
        case 'myfavoriteimage':
          setFavePic1(null);
          setFavePic1Text('');
          setFavePic1DisplayInFunStuff(false);
          setFavePic1DisplayInUserGallery(false);
          break;
        case 'mysecondfavorite':
          setFavePic2(null);
          setFavePic2Text('');
          setFavePic2DisplayInFunStuff(false);
          setFavePic2DisplayInUserGallery(false);
          break;
        case 'mythirdfavorite':
          setFavePic3(null);
          setFavePic3Text('');
          setFavePic3DisplayInFunStuff(false);
          setFavePic3DisplayInUserGallery(false);
          break;
        default:
          break;
      }
      const handleAboutTextUpdate = async () => {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            aboutText,
            aboutDisplayInFunStuff,
            aboutDisplayInUserGallery
          },
          { merge: true }
        );
      };
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#bee4ed', '#49176e']} style={globalStyles.container}>
        <LinearGradient colors={['#bee4ed', '#acc4d9']} style={{ padding: 0 }}>
          <Appbar.Header style={{ backgroundColor: 'transparent' }}>
            <Appbar.Content
              title={`Welcome ${nickname || 'User'}`}
              titleStyle={{
                color: '#2E5090',
                ...globalStyles.appbarTitle,
              }}
            />
            <LogoutButton handleLogout={handleLogout} />
          </Appbar.Header>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <View style={globalStyles.swiperContainer}>
            <Swiper
              autoplay={true}
              showsPagination={false}
              showsButtons={true}
              nextButton={<Image source={rightfacing} style={{ width: 50, height: 50 }} />}
              prevButton={<Image source={leftfacing} style={{ width: 50, height: 50 }} />}
              style={globalStyles.swiper}
            >
              {[
                { uri: profilePic, name: 'My Profile Pic', text: myprofilepic_text },
                { uri: favePic1, name: 'My Favorite Image', text: favePic1Text },
                { uri: favePic2, name: 'My Second Favorite', text: favePic2Text },
                { uri: favePic3, name: 'My Third Favorite', text: favePic3Text },
              ].map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={globalStyles.swiperItem}
                  onPress={() => handleImagePress(image.uri, image.name)}
                >
                  <Text>{image.name}</Text>
                  {image.uri ? (
                    <Image source={{ uri: image.uri }} style={globalStyles.imageContainer} />
                  ) : (
                    <View style={globalStyles.noImageContainer}>
                      <Text>No Image</Text>
                    </View>
                  )}
                  <Text>{image?.text}</Text>
                </TouchableOpacity>
              ))}
            </Swiper>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MoodTracker')}
                style={globalStyles.button}
              >
                <Text style={globalStyles.buttonText}>Go to Mood Tracker</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={handleModalClose}
>
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={globalStyles.centeredView}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={globalStyles.modalContainer}>
        <Text style={globalStyles.modalText}>About You:</Text>
        <TextInput
          value={aboutText}
          onChangeText={setAboutText}
          placeholder="Gender...Pronouns...Hobbies...Anything you want to share!"
          style={[globalStyles.modalTextInput, globalStyles.inputField]}
        />
        <View style={globalStyles.switchRow}>
          <Text>Display About Text in Fun Stuff</Text>
          <Switch value={aboutDisplayInFunStuff} onValueChange={setAboutDisplayInFunStuff} />
        </View>
        <View style={globalStyles.switchRow}>
          <Text>Display About Text in User Gallery</Text>
          <Switch value={aboutDisplayInUserGallery} onValueChange={setAboutDisplayInUserGallery} />
        </View>
        <Text>What do you want to change about {selectedImage.name}?</Text>
        <TextInput
          value={selectedImageText}
          onChangeText={setSelectedImageText}
          placeholder="Enter image text"
          style={[globalStyles.modalTextInput, globalStyles.inputField]}
        />
        <View style={globalStyles.switchRow}>
          <Text>Display in Fun Stuff:</Text>
          <Switch value={selectedImageDisplayFunStuff} onValueChange={setSelectedImageDisplayFunStuff} />
        </View>
        <View style={globalStyles.switchRow}>
          <Text>Display in User Gallery:</Text>
          <Switch value={selectedImageDisplayUserGallery} onValueChange={setSelectedImageDisplayUserGallery} />
        </View>
        <TouchableOpacity
          style={globalStyles.modalButton}
          onPress={() => {
            handleChooseImage(
              selectedImage.name.split(' ').join('').toLowerCase(),
              selectedImageDisplayFunStuff,
              selectedImageDisplayUserGallery,
              selectedImageText
            );
            handleImageTextUpdate(
              selectedImage.name.split(' ').join('').toLowerCase(),
              selectedImageText
            );
          }}
        >
          <Text style={{ color: '#FFFFFF' }}>Choose a new image.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.modalButton}
          onPress={() =>
            handleDeleteImage(selectedImage.name.split(' ').join('').toLowerCase())
          }
        >
          <Text style={{ color: '#FFFFFF' }}>Delete this image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.modalButton} onPress={handleModalClose}>
          <Text style={{ color: '#FFFFFF' }}>I'm done.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
</Modal>

        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default UserScreen;