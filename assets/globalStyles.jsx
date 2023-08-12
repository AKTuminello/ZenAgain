import { StyleSheet } from 'react-native';

const themeColors = {
  primary: '#bee4ed',
  accent: '#49176e',
  background: '#aea1d0',
  surface: '#265ef7',
  text: '#00525e',
  error: '#a4b4be',
};

const themeFonts = {
  regular: {
    fontFamily: 'JosefinSans-VariableFont_wght',
    fontWeight: 'normal',
  },
  italic: {
    fontFamily: 'JosefinSans-Italic',
    fontStyle: 'italic',
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  text: {
    color: themeColors.text,
  },
  instructionsText: {
    color: themeColors.text,
    fontFamily: themeFonts.italic.fontFamily,
    fontStyle: themeFonts.italic.fontStyle,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  carouselItemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});
