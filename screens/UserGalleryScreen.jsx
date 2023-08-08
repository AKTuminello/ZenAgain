import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableHighlight, Modal, Dimensions, Button } from 'react-native';
import { collection, getDocs, doc, setDoc, arrayUnion, getDoc, arrayRemove } from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { AuthContext } from '../AuthContext.jsx';
import { Appbar } from 'react-native-paper';
import { globalStyles } from '../assets/globalStyles';

const { width } = Dimensions.get('window');

const UserGalleryScreen = () => {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [likes, setLikes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserImagesFromFirestore();
      fetchFriendsFromFirestore();
      fetchLikesFromFirestore();
    }
  }, [user]);

  const fetchUserImagesFromFirestore = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => doc.data());
    const images = [];
    users.forEach(user => {
      if (user.profilePic_displayInUserGallery) {
        images.push({ url: user.profilePic, text: user.profilePic_text || '', nickname: user.nickname });
      }
      if (user.favePic1_displayInUserGallery) {
        images.push({ url: user.favePic1, text: user.myfavoriteimage_text || '', nickname: user.nickname });
      }
      if (user.favePic2_displayInUserGallery) {
        images.push({ url: user.favePic2, text: user.mysecondfavorite_text || '', nickname: user.nickname });
      }
      if (user.favePic3_displayInUserGallery) {
        images.push({ url: user.favePic3, text: user.mythirdfavorite_text || '', nickname: user.nickname });
      }
    });
    setImages(images);
  };

  const fetchFriendsFromFirestore = async () => {
    const db = getFirestore();
    const friendsRef = doc(db, 'friends', user.uid);
    const friendsDoc = await getDoc(friendsRef);
    if (friendsDoc.exists()) {
      setFriends(friendsDoc.data().friends || []);
    }
  };

  const fetchLikesFromFirestore = async () => {
    const db = getFirestore();
    const likesRef = doc(db, 'likes', 'Rese4L1rDINgjUEMLgQ5');
    const likesDoc = await getDoc(likesRef);
    if (likesDoc.exists()) {
      setLikes(likesDoc.data().likedImages || []);
    }
  };

  const handleLikeImage = async (imageUrl) => {
    const db = getFirestore();
    const likesRef = doc(db, 'likes', 'Rese4L1rDINgjUEMLgQ5');
    if (likes.includes(imageUrl)) {
      await setDoc(likesRef, { likedImages: arrayRemove(imageUrl) }, { merge: true });
      setLikes(prev => prev.filter(like => like !== imageUrl));
    } else {
      await setDoc(likesRef, { likedImages: arrayUnion(imageUrl) }, { merge: true });
      setLikes(prev => [...prev, imageUrl]);
    }
  };

  const addFriend = async (friend) => {
    const friendExists = friends.some(f => f.nickname === friend.nickname);
    if (friendExists) {
      alert('You are already friends with this user.');
      return;
    }
    const db = getFirestore();
    const friendsRef = doc(db, 'friends', user.uid);
    await setDoc(friendsRef, { friends: arrayUnion(friend) }, { merge: true });
    setFriends([...friends, friend]);
  };

  const handleOpenModal = (image) => {
    setModalImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalImage(null);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="User Gallery" />
      </Appbar.Header>
      <FlatList
        data={images}
        keyExtractor={item => item.url}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleOpenModal(item)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.url }} style={styles.image} />
              {item.nickname && <Text>{item.nickname}</Text>}
              {item.text ? <Text>{item.text}</Text> : <Text>No text provided</Text>}
              <Button title={likes.includes(item.url) ? "Unlike" : "Like"} onPress={() => handleLikeImage(item.url)} />
              <Text>Likes: {likes.filter(like => like === item.url).length}</Text>
              <Button title="Add Friend" onPress={() => addFriend({ nickname: item.nickname })} />
            </View>
          </TouchableHighlight>
        )}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.centeredView}>
          <TouchableHighlight onPress={handleCloseModal} style={styles.modalTouchable}>
            <Image source={{ uri: modalImage?.url }} style={styles.modalImage} />
          </TouchableHighlight>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { flex: 1, flexDirection: 'column', margin: 1, borderWidth: 2, borderColor: '#000' },
  image: { height: width / 2, aspectRatio: 1 },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  modalTouchable: { width: '90%', height: '70%', alignItems: 'center', justifyContent: 'center' },
  modalImage: { width: '100%', height: '100%', resizeMode: 'contain' },
});

export default UserGalleryScreen;
