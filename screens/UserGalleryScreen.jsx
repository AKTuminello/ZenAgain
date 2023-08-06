import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { collection, getDocs } from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { AuthContext } from '../AuthContext.jsx';

const UserGalleryScreen = () => {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserImagesFromFirestore();
    }
  }, [user]);

  const fetchUserImagesFromFirestore = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'images'));
    const images = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setImages(images);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </View>
        )}
        numColumns={3}
      />
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
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});

export default UserGalleryScreen;
