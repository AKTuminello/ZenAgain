import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const ModalContent = ({ isModalVisible, setModalVisible, selectedBlend }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      {selectedBlend && (
        <View style={styles.centeredView}>
          <Text style={styles.text}>{selectedBlend.name}</Text>
          <Text style={styles.text}>{selectedBlend.description}</Text>
          <Text style={styles.text}>{selectedBlend.ingredients}</Text>
          <FAB icon="close" onPress={() => setModalVisible(false)} style={styles.closeButton} />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  text: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default ModalContent;
