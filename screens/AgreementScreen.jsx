import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const AgreementScreen = ({ onAgree }) => {
  const { colors, fonts } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary, fontFamily: fonts.medium.fontFamily, fontWeight: 'bold' }]}>
        User Agreement
      </Text>

      <Text style={[styles.paragraph, { color: colors.text, fontFamily: fonts.medium.fontFamily, fontWeight: 'bold' }]}>
        This is where the legal text goes. The screen scrolls, just in case.
      </Text>

      <Button mode="contained" color={colors.accent} labelStyle={{ color: colors.background, fontFamily: fonts.medium.fontFamily, fontWeight: 'bold' }} onPress={onAgree}>I Agree to the Terms</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AgreementScreen;
