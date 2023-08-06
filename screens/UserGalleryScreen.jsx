import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableHighlight, Modal, Dimensions } from 'react-native';
import { collection, getDocs } from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { AuthContext } from '../AuthContext.jsx';
import { Appbar } from 'react-native-paper';

const { width } = Dimensions.get('window');

const UserGalleryScreen = () => {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserImagesFromFirestore();
    }
  }, [user]);

  const fetchUserImagesFromFirestore = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => doc.data());

    const images = [];
    users.forEach(user => {
      if (user.profilePic_displayInUserGallery) {
        images.push({ 
          url: user.profilePic, 
          text: user.profilePic_text || '', 
          nickname: user.nickname 
        });
      }
      if (user.favePic1_displayInUserGallery) {
        images.push({ 
          url: user.favePic1, 
          text: user.myfavoriteimage_text || '', 
          nickname: user.nickname 
        });
      }
      if (user.favePic2_displayInUserGallery) {
        images.push({ 
          url: user.favePic2, 
          text: user.mysecondfavorite_text || '', 
          nickname: user.nickname 
        });
      }
      if (user.favePic3_displayInUserGallery) {
        images.push({ 
          url: user.favePic3, 
          text: user.mythirdfavorite_text || '', 
          nickname: user.nickname 
        });
      }
    });

    setImages(images);
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
            </View>
          </TouchableHighlight>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <TouchableHighlight style={styles.modalContainer} onPress={handleCloseModal}>
            {modalImage && <Image source={{ uri: modalImage.url }} style={styles.modalImage} />}
          </TouchableHighlight>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
    borderWidth: 2,
    borderColor: '#000',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: width / 2,
    width: width / 2,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalContainer: {
    backgroundColor: "black",
    width: '100%',
    height: '100%',
  },
});

export default UserGalleryScreen;
