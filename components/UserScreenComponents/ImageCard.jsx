// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
// import DisplayImageSwitch from './DisplayImageSwitch';

// const ImageCard = ({ imageUri, imageName, handleChooseImage, handleImageDisplayToggle, displayInFunStuff, displayInUserGallery }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const handlePress = () => {
//     setModalVisible(!modalVisible);
//   };

//   const handleModalClose = () => {
//     setModalVisible(!modalVisible);
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={handlePress}>
//         <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
//       </TouchableOpacity>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={handleModalClose}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Would you like to change this image?</Text>
//             <TouchableOpacity style={styles.button} onPress={() => { handleChooseImage(); handleModalClose(); }}>
//               <Text style={styles.textStyle}>Yes</Text>
//             </TouchableOpacity>
//             <DisplayImageSwitch
//               imageUri={imageUri}
//               displayInFunStuff={displayInFunStuff}
//               displayInUserGallery={displayInUserGallery}
//               handleImageDisplayToggle={handleImageDisplayToggle}
//               imageName={imageName}
//             />
//             <TouchableOpacity style={styles.button} onPress={handleModalClose}>
//               <Text style={styles.textStyle}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "#FADADD", // cotton candy pink
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '80%',
//     height: '60%'
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//     backgroundColor: "#d3d3d3", // soft gray
//     marginTop: 10
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center"
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center"
//   }
// });

// export default ImageCard;
