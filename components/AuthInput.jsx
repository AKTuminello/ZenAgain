import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const AuthInput = ({ value, onChangeText, placeholder, secureTextEntry = false, autoCapitalize = "sentences" }) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    paddingTop: 50,
  },
});

export default AuthInput;
