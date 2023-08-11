import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView, Modal } from 'react-native';
import { AuthContext } from '../AuthContext';
import { getFirestore, doc, setDoc, Timestamp, arrayUnion, query, where, collection, getDocs, orderBy, addDoc } from '@firebase/firestore';
import { globalStyles } from '../assets/globalStyles';
import { useTheme } from 'react-native-paper';
import { onSnapshot } from 'firebase/firestore';

const MoodTrackerScreen = () => {
  const { user } = useContext(AuthContext);
  const [mood, setMood] = useState(null);
  const [customMood, setCustomMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const { fonts } = useTheme();
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  

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

  const addOrUpdateJournalEntry = async (selectedMood) => {
    if (!user) return;
  
    const db = getFirestore();
    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
    const keywords = selectedMood === 'Custom' ? [customMood] : [];
  
    await addDoc(journalCollectionRef, {
      date: Timestamp.fromDate(new Date()),
      mood: selectedMood,
      keywords: arrayUnion(...keywords),
      entry: journalEntry,
    });
  };

  const handleMoodSelect = async (selectedMood) => {
    setMood(selectedMood);
    await addOrUpdateJournalEntry(selectedMood);
    setMood(null); // Clear the selected mood
  };

  const handleCustomMoodInput = (text) => {
    setCustomMood(text);
  };

  const handleJournalEntryInput = async (text) => {
    setJournalEntry(text);
    if (text.endsWith('\n')) {
      await addOrUpdateJournalEntry(mood);
      setJournalEntry('');
    }
  };

  const handleSearchKeywordInput = async (text) => {
    setSearchKeyword(text);
  
    if (text.trim() === '') {
      setSearchResults([]);
      setIsSearchModalVisible(false); // Hide modal if search is empty
      return;
    }
  
    const db = getFirestore();
    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
    const querySnapshot = await getDocs(query(journalCollectionRef, where('keywords', 'array-contains', text.toLowerCase())));
  
    const results = querySnapshot.docs.map((doc) => doc.data());
    setSearchResults(results);
    setIsSearchModalVisible(true); // Show modal if there are results
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
      setWeeklyEntries(results);
    });
  
    
    return () => unsubscribe();
  }, [user]);

  const loadWeeklyEntries = async () => {
    if (!user) return;
  
    const db = getFirestore();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
    const querySnapshot = await getDocs(query(journalCollectionRef, where('date', '>=', Timestamp.fromDate(oneWeekAgo)), orderBy('date', 'desc')));
  
    const results = querySnapshot.docs.map((doc) => doc.data());
    console.log('Weekly Entries:', results); // Added this line
    setWeeklyEntries(results);
  };

  const renderMoodButtons = () => (
    moodOptions.map((option, index) => (
      <TouchableOpacity 
        key={index} 
        onPress={() => handleMoodSelect(option.mood)}
        style={{ margin: 5, padding: 5 }} // Added margin and padding here
      >
        <Text style={{ color: option.color }}>{option.mood}</Text>
      </TouchableOpacity>
    ))
  );
  

  const renderHeader = () => (
    <View>
      <View
        style={{
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: fonts.regular.fontFamily,
            color: '#49176e',
          }}
        >
          Mood Tracker Screen
        </Text>
      </View>
      <TextInput
        value={searchKeyword}
        onChangeText={handleSearchKeywordInput}
        placeholder="Search by keyword..."
        style={{ width: '80%', padding: 10, borderWidth: 1, borderRadius: 5, alignSelf: 'center', marginTop: 10 }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
  {renderMoodButtons()}
</View>
      {mood === 'Custom' && (
        <TextInput
          value={customMood}
          onChangeText={handleCustomMoodInput}
          placeholder="Enter custom mood..."
        />
      )}
      <ScrollView
        style={{ marginVertical: 10 }}
        keyboardShouldPersistTaps="handled"
      >
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
      ListHeaderComponent={<Text style={{ fontSize: 18, marginVertical: 10 }}>Last Week's Entries:</Text>}
    />
  );
  const renderSearchModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isSearchModalVisible}
      onRequestClose={() => setIsSearchModalVisible(false)}
    >
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Search Results:</Text>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.date.toDate().toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10 }}>
              <Text>Date: {item.date.toDate().toLocaleDateString()}</Text>
              <Text>Mood: {item.mood}</Text>
              <Text>Entry: {item.entry}</Text>
            </View>
          )}
        />
        <TouchableOpacity onPress={() => setIsSearchModalVisible(false)}>
          <Text style={{ color: '#007BFF', marginTop: 10 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
  

  return (
    <View style={globalStyles.container}>
      {renderHeader()}
      {renderSearchModal()}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.date.toDate().toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>Date: {item.date.toDate().toLocaleDateString()}</Text>
            <Text>Mood: {item.mood}</Text>
            <Text>Entry: {item.entry}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={{ fontSize: 18, marginVertical: 10 }}>Search Results:</Text>}
      />
      {renderWeeklyEntries()}
    </View>
  );
};

export default MoodTrackerScreen;
