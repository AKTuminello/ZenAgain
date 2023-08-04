import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { updateDoc, doc } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';

const auth = getAuth();

const uriToBlob = async (uri) => {
  const byteString = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return new Blob([byteString], { type: 'image/jpeg' });
};

export const handleImageSelection = async (user, imageNumber) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    const fileName = result.uri.substring(result.uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `userImages/${user.uid}/${fileName}`);
    const blob = await uriToBlob(result.uri);

    uploadBytesResumable(storageRef, blob).on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, (error) => {
      console.error('Error uploading image: ', error);
    }, () => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log('File available at', downloadURL);
        updateDoc(doc(db, 'users', user.uid), {
          [`favePic${imageNumber}`]: downloadURL
        });
      });
    });
  }
};
