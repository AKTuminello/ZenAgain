import { StyleSheet } from 'react-native';

const themeColors = {
  primary: '#bbe4ed',
  accent: '#49176e',
  background: '#aea1d0',
  surface: '#49176e',
  text: '#2E5090',
  error: '#a4b4be',
  navbarText: '#FFFFFF'
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: themeColors.background,
    padding: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
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

  modalText: {
    fontSize: 24, 
    color: '#300040',
    marginBottom: 15, 
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 18, 
    color: '#300040',
    fontFamily: 'JosefinSans-Italic', 
    fontStyle: 'italic',
    textAlign: 'center', 
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
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
    backgroundColor: '#300040',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    fontFamily: 'JosefinSans-Regular',
    color: '#FFFFFF',
  
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
    fontSize: 20,
  },
  instructionsText: {
    color: themeColors.text,
    fontFamily: 'JosefinSans-Italic', 
    fontStyle: 'italic',
    textAlign: 'center',
  },

  
  appbarTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: themeColors.accent,
  },

  titleContainer: {
    paddingTop: 25,
  },

  navbar: {
    backgroundColor: themeColors.surface,
  },

  swiperText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily:  'JosefinSans-SemiBoldItalic',
    color: '#FC4483', 
    marginBottom: 10,
  },

  inputField: {
    backgroundColor: '#FFFFFF', 
    borderColor: '#300040', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: 10, 
    fontSize: 16,
  },

  buttonContainer: {
    backgroundColor: '#300040',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: 'center'

  },

  });

