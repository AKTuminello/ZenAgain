import React, { useState, useContext, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { AuthContext } from '../AuthContext';
import { getFirestore, addDoc, Timestamp, query, where, collection, orderBy } from '@firebase/firestore';
import { globalStyles } from '../assets/globalStyles';
import { useTheme } from 'react-native-paper';
import { onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const MoodTrackerScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  const [customMood, setCustomMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const { fonts, colors } = useTheme();
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

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#bee4ed',
      },
      headerTintColor: '#000000',
      headerTitle: "MoodTracker",
    });
  }, [navigation]);

  const ListItem = memo(({ item }) => (
    <View style={{ marginVertical: 10 }}>
      <Text style={globalStyles.text}>Date: {item.date.toDate().toLocaleDateString()}</Text>
      <Text style={globalStyles.instructionsText}>Mood: {item.mood}</Text>
      <Text style={globalStyles.text}>Entry: {item.entry}</Text>
    </View>
  ));

  const ListHeader = memo(() => (
    <Text style={[globalStyles.text, { fontSize: 18, marginVertical: 10 }]}>Recent Entries:</Text>
  ));

  const addOrUpdateJournalEntry = async (selectedMood) => {
    if (!user) return;

    const db = getFirestore();
    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');

    await addDoc(journalCollectionRef, {
      date: Timestamp.fromDate(new Date()),
      mood: selectedMood !== 'Custom' ? selectedMood : customMood,
      entry: journalEntry,
    });
  };

  const handleMoodSelect = (selectedMood) => {
    if (selectedMood === 'Custom') {
      setShowCustomMoodInput(true);
    } else {
      setMood(selectedMood);
      addOrUpdateJournalEntry(selectedMood);
    }
  };

  const handleCustomMoodInput = (text) => {
    setCustomMood(text);
    if (text.endsWith('\n')) {
      handleCustomMoodSubmit();
    }
  };

  const handleCustomMoodSubmit = async () => {
    if (customMood.trim() === '') return;
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
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>{renderMoodButtons()}</View>
      {showCustomMoodInput && (
        <View>
          <Text style={globalStyles.instructionsText}>How you feelin'?:</Text>
          <TextInput
            style={globalStyles.inputField}
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
          style={globalStyles.inputField}
          value={journalEntry}
          onChangeText={handleJournalEntryInput}
          placeholder="Write your journal entry here..."
          multiline
          returnKeyType="done"
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
          <Text style={globalStyles.text}>Date: {item.date.toDate().toLocaleDateString()}</Text>
          <Text style={globalStyles.instructionsText}>Mood: {item.mood}</Text>
          <Text style={globalStyles.text}>Entry: {item.entry}</Text>
        </View>
      )}
      ListHeaderComponent={<Text style={[globalStyles.text, { fontSize: 18, marginVertical: 10 }]}>Recent Entries:</Text>}
    />
  );

  return (
    <LinearGradient colors={['#bbe4ed', '#aea1d0', '#49176e']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {renderHeader()}
        {renderWeeklyEntries()}
      </View>
    </LinearGradient>
  );
};

export default MoodTrackerScreen;
