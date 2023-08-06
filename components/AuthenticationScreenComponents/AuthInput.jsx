import React, { forwardRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const AuthInput = forwardRef(({ value, setValue, placeholder, secureTextEntry = false, onSubmitEditing = null }, ref) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      onSubmitEditing={onSubmitEditing}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
      ref={ref}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    color: 'black',
  },
});

export default AuthInput;
