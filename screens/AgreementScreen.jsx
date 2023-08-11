import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const AgreementScreen = ({ onAgree }) => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary, fontWeight: 'bold' }]}>
        User Agreement
      </Text>

      <Text style={[styles.paragraph, { color: colors.text, fontWeight: 'normal' }]}>
        This is where the legal text goes. The screen scrolls, just in case.
      </Text>

      <Button title="I Agree to the Terms" color={colors.accent} onPress={onAgree} />
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

