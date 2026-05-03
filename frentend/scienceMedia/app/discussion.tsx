import MessageModal from '@/components/ui/model';
import { Image, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function MessagesScreen() {


const {senderName , profileImage} = useLocalSearchParams();
const auth_user_id = 1
  const discussionData = [
    {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
{
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
{
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
{
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
{
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: 1,
    time: "12:30",
  },
  {
    message: "Hey, how are you?",
    senderId: senderName,
    time: "12:30",
  },
];
  return (
    <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 , backgroundColor: 'green', padding: 10, borderRadius: 10  }}>
            <Image source={{ uri: profileImage as string}} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{senderName}</Text>
        </View>
        <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
            {discussionData.map((message, index) => (
                <View key={index} style={message.senderId === auth_user_id ? styles.messageSent : styles.messageReceived}>
                    <Text>{message.message}</Text>
                    <Text style={styles.time}>{message.time}</Text>
                </View>
            ))}
        </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
    messageSent: {
        marginTop: 10,
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    messageReceived: {
        marginTop: 10,
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
    time: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
});