import { StyleSheet } from 'react-native';

const themeColors = {
  primary: '#a4b4be',
  accent: '#49176e',
  background: '#aea1d0',
  surface: '#265ef7',
  text: '#300040',
  error: '#a4b4be',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: themeColors.background,
    padding: 0,
  },
  buttonText: {
    color: '#300040',
  },
  swiperContainer: {
    height: '75%',
  },
  
  swiperItem: {
    marginTop: 75,
    marginBottom: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: '75%',
    width: '90%',
    backgroundColor: '#FFB7D5',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextInput: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    margin: 20,
  },
  text: {
    color: themeColors.text,
  },
  instructionsText: {
    color: themeColors.text,
    fontFamily: 'JosefinSans-Italic', // Assuming italic style
    fontStyle: 'italic',
    textAlign: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },

  appbarTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: themeColors.accent,
  },
  });

