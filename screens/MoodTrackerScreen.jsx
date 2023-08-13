import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView, SafeAreaView} from 'react-native';
import { AuthContext } from '../AuthContext';
import { getFirestore, addDoc, Timestamp, query, where, collection, orderBy } from '@firebase/firestore';
import { globalStyles } from '../assets/globalStyles';
import { useTheme } from 'react-native-paper';
import { onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const MoodTrackerScreen = () => {
  const { user } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  const [customMood, setCustomMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const { fonts } = useTheme();
  const [showCustomMoodInput, setShowCustomMoodInput] = useState(false);

  const moodOptions = [
    { mood: 'Furious', color: '#FF0000' },
    { mood: 'Angry', color: '#FF4500' },
    { mood: 'Upset', color: '#ff8e00' },
    { mood: 'Neutral', color: '#FFFF00' },
    { mood: 'Content', color: '#046a38' },
    { mood: 'Happy', color: '#00c0ff' },
    { mood: 'Excited', color: '#00f' },
    { mood: 'Joyful', color: '#8b48fe' },
    { mood: 'Blissful', color: '#1f1137' },
    { mood: 'Custom', color: '#FF9cce' },
  ];

  const addOrUpdateJournalEntry = async (mood) => {
    if (!user) return;
  
    const selectedMood = mood !== 'Custom' ? mood : customMood;
    console.log("Selected mood:", selectedMood); // Log selected mood
  
    const db = getFirestore();
    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
  
    await addDoc(journalCollectionRef, {
      date: Timestamp.fromDate(new Date()),
      mood: selectedMood,
      entry: journalEntry,
    });
  };
  

  const handleMoodSelect = (selectedMood) => {
    if (selectedMood === 'Custom') {
      setShowCustomMoodInput(true);
    } else {
      setMood(selectedMood);
    }
  };

  const handleCustomMoodInput = (text) => {
    console.log("Handling custom mood input:", text); // Log custom mood input
    setCustomMood(text);
    if (text.endsWith('\n')) {
      handleCustomMoodSubmit();
    }
  };
  
  

  const handleCustomMoodSubmit = async () => {
    if (customMood.trim() === '') return;
    console.log("Submitting custom mood:", customMood); // Log custom mood
    await addOrUpdateJournalEntry(customMood);
    setShowCustomMoodInput(false);
    setCustomMood('');
    setMood(null);
  };
  

  const handleJournalEntryInput = async (text) => {
    setJournalEntry(text);
    if (text.endsWith('\n')) {
      await addOrUpdateJournalEntry(mood);
      setJournalEntry('');
    }
  };

  useEffect(() => {
    if (!user) return;

    const db = getFirestore();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
    const q = query(journalCollectionRef, where('date', '>=', Timestamp.fromDate(oneWeekAgo)), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data());
      console.log("Weekly entries from database:", results); // Log weekly entries
      setWeeklyEntries(results);
    });
    

    return () => unsubscribe();
  }, [user]);

  const renderMoodButtons = () => (
    moodOptions.map((option, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleMoodSelect(option.mood)}
        style={{ margin: 5, padding: 5 }}
      >
        <Text style={{ color: option.color }}>{option.mood}</Text>
      </TouchableOpacity>
    ))
  );

  const renderHeader = () => (
    <View>
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontFamily: fonts.regular.fontFamily, color: '#49176e' }}>Mood Tracker Screen</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>{renderMoodButtons()}</View>
      {showCustomMoodInput && (
  <View>
    <Text>How you feelin'?:</Text>
    <TextInput
  value={customMood}
  onChangeText={text => setCustomMood(text.replace('\n', ''))}
  onSubmitEditing={handleCustomMoodSubmit}
  placeholder="I'm feeling..."
  returnKeyType="done"
/>

  </View>
)}
      <ScrollView style={{ marginVertical: 10 }} keyboardShouldPersistTaps="handled">
        <TextInput
          value={journalEntry}
          onChangeText={handleJournalEntryInput}
          placeholder="Write your journal entry here..."
          multiline
          returnKeyType="done"
          style={{ minHeight: 100, borderWidth: 1, borderRadius: 5, padding: 10 }}
        />
      </ScrollView>
    </View>
  );

  const renderWeeklyEntries = () => (
    <FlatList
      data={weeklyEntries}
      keyExtractor={(item) => item.date.toDate().toString()}
      renderItem={({ item }) => (
        <View style={{ marginVertical: 10 }}>
          <Text>Date: {item.date.toDate().toLocaleDateString()}</Text>
          <Text>Mood: {item.mood}</Text>
          <Text>Entry: {item.entry}</Text>
        </View>
      )}
      ListHeaderComponent={<Text style={{ fontSize: 18, marginVertical: 10 }}>Recent Entries:</Text>}
    />
  );

  return (
    <View style={globalStyles.container}>
      {renderHeader()}
      {renderWeeklyEntries()}
    </View>
  );
};

export default MoodTrackerScreen;
