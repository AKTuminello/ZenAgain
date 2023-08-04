import React from 'react';
import { View, Text, TextInput } from 'react-native';

const NicknameDialog = ({ nickname, setNickname, handleNicknameSubmit }) => {
  return (
    <View>
      <Text>Please choose a nickname.
      You only get to do this once, so choose carefully!</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={nickname}
        onChangeText={setNickname}
        onSubmitEditing={handleNicknameSubmit}
      />
    </View>
  );
};

export default NicknameDialog;
