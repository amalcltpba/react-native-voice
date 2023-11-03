import React, {useEffect, useState} from 'react';
import Voice, {SpeechErrorEvent} from '@react-native-voice/voice';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const start = require('./assets/start.png');
const stop = require('./assets/stop.png');

function App(): JSX.Element {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState([]);
  const [isStartRecording, setIsStartRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    setIsStartRecording(true);
  };

  const onSpeechResults = (e: any) => {
    setResult(e.value);
    setIsStartRecording(false);
  };

  const onSpeechEnd = (e: any) => {
    setIsRecording(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    onSpeechResults;
  };

  const startVoiceRecognizing = async () => {
    try {
      await Voice.start('en-US');

      setResult([]);
      setIsRecording(true);
    } catch (error) {}
  };

  const stopVoiceRecognizing = async () => {
    try {
      setIsRecording(false);

      await Voice.stop();
    } catch (error) {}
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <Text style={styles.appHeading}>Voice to Text</Text>
        <View style={styles.textView}>
          {isStartRecording && (
            <Text style={styles.recording}>Recording.....</Text>
          )}
          {result.map((text: string) => (
            <Text style={styles.searchResult}>{text}</Text>
          ))}
        </View>
        <View style={styles.actionButtonView}>
          {!isRecording ? (
            <TouchableOpacity onPress={startVoiceRecognizing}>
              <Image style={styles.start} source={start} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={stopVoiceRecognizing}>
              <Image style={styles.stop} source={stop} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appHeading: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    fontFamily: 'arial',
    color: '#000',
  },
  recording: {
    color: '#898383',
  },
  textView: {
    margin: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 450,
  },
  searchResult: {
    color: '#000',
    fontSize: 20,
  },
  actionButtonView: {
    alignSelf: 'center',
    marginTop: 50,
  },
  start: {
    width: 100,
    height: 100,
  },
  stop: {
    width: 100,
    height: 100,
  },
  scrollView: {
    height: deviceHeight,
    backgroundColor: '#fff',
  },
});

export default App;

