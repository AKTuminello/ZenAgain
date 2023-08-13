import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles } from '../assets/globalStyles';

const AgreementScreen = ({ onAgree }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
    <LinearGradient colors={['#bee4ed', '#49176e']} style={globalStyles.container}>
    <ScrollView>
      <View style={styles.contentContainer}>
          <Text style={globalStyles.appbarTitle}>User Agreement</Text>
          <Text style={globalStyles.instructionsText}>This is where the legal text goes.</Text>
          <Text style={globalStyles.text}>
          Fortune favoured us, and we got home without meeting a soul. Once we saw a man, who seemed not quite sober, passing along a street in front of us; but we hid in a door till he had disappeared up an opening such as there are here, steep little closes, or "wynds," as they call them in Scotland. My heart beat so loud all the time that sometimes I thought I should faint. I was filled with anxiety about Lucy, not only for her health, lest she should suffer from the exposure, but for her reputation in case the story should get wind. When we got in, and had washed our feet, and had said a prayer of thankfulness together, I tucked her into bed. Before falling asleep she asked--even implored--me not to say a word to any one, even her mother, about her sleep-walking adventure. I hesitated at first to promise; but on thinking of the state of her mother's health, and how the knowledge of such a thing would fret her, and thinking, too, of how such a story might become distorted--nay, infallibly would--in case it should leak out, I thought it wiser to do so. I hope I did right. I have locked the door, and the key is tied to my wrist, so perhaps I shall not be again disturbed. Lucy is sleeping soundly; the reflex of the dawn is high and far over the sea.... Same day, noon.--All goes well. Lucy slept till I woke her and seemed not to have even changed her side. The adventure of the night does not seem to have harmed her; on the contrary, it has benefited her, for she looks better this morning than she has done for weeks. I was sorry to notice that my clumsiness with the safety-pin hurt her. Indeed, it might have been serious, for the skin of her throat was pierced. I must have pinched up a piece of loose skin and have transfixed it, for there are two little red points like pin-pricks, and on the band of her nightdress was a drop of blood. When I apologised and was concerned about it, she laughed and petted me, and said she did not even feel it. Fortunately it cannot leave a scar, as it is so tiny.
  {'\n'}
  Same day, night.--We passed a happy day. The air was clear, and the sun bright, and there was a cool breeze. We took our lunch to Mulgrave Woods, Mrs. Westenra driving by the road and Lucy and I walking by the cliff-path and joining her at the gate. I felt a little sad myself, for I could not but feel how absolutely happy it would have been had Jonathan been with me. But there! I must only be patient. In the evening we strolled in the Casino Terrace, and heard some good music by Spohr and Mackenzie, and went to bed early. Lucy seems more restful than she has been for some time, and fell asleep at once. I shall lock the door and secure the key the same as before, though I do not expect any trouble to-night.
</Text>
          <PaperButton
            mode="contained"
            style={globalStyles.button}
            labelStyle={{ color: '#FFFFFF' }}
            onPress={onAgree}
          >
            I Agree to the Terms
          </PaperButton>
        </View>
        </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: 25,
  },


});

export default AgreementScreen;