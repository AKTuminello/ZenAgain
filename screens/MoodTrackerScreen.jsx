import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AuthContext } from '../AuthContext';
import { getFirestore, doc, setDoc, Timestamp } from '@firebase/firestore';
import { globalStyles } from '../assets/globalStyles';

const MoodTrackerScreen = () => {
  const { user } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  const [customMood, setCustomMood] = useState(null);

  const moodOptions = [
    { mood: 'Furious', color: '#FF0000' },
    { mood: 'Angry', color: '#FF4500' },
    { mood: 'Upset', color: '#ff8e00' },
    { mood: 'Neutral', color: '#FFFF00' },
    { mood: 'Content', color: '#046a38' },
    { mood: 'Happy', color: '#00c0ff' },
    { mood: 'Excited', color: '#00f'},
    { mood: 'Joyful', color: '#8b48fe' },
    { mood: 'Blissful', color: '#1f1137' },
    { mood: 'Custom', color: '#FFFFFF' },
  ];

  const addOrUpdateJournalEntry = async (selectedMood) => {
    const db = getFirestore();
    const journalRef = doc(db, 'journal', user.uid);
    const keywords = selectedMood === 'Custom' ? [customMood] : [];

    await setDoc(journalRef, {
      date: Timestamp.fromDate(new Date()),
      mood: selectedMood,
      keywords
    }, { merge: true });
  };

  const handleMoodSelect = async (selectedMood) => {
    setMood(selectedMood);
    if (user) {
      await addOrUpdateJournalEntry(selectedMood);
    }
  };

  const handleCustomMoodInput = async (text) => {
    setCustomMood(text);
    if (user) {
      const db = getFirestore();
      const moodDocRef = doc(db, 'moods', user.uid);
      await setDoc(moodDocRef, { customMood: text }, { merge: true });
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text>Mood Tracker Screen</Text>
      {moodOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={{ backgroundColor: option.color, padding: 10, margin: 10 }}
          onPress={() => handleMoodSelect(option.mood)}
        >
          <Text>{option.mood}</Text>
        </TouchableOpacity>
      ))}
      {mood === 'Custom' && (
        <TextInput
          value={customMood}
          onChangeText={handleCustomMoodInput}
          placeholder="Enter your mood..."
          style={{ width: '80%', padding: 10, borderWidth: 1, borderRadius: 5, alignSelf: 'center', marginTop: 10 }}
        />
      )}
    </ScrollView>
  );
};

export default MoodTrackerScreen;
