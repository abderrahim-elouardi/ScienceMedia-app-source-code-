import MessageModal from '@/components/ui/model';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

export default function MessagesScreen() {

    const colorScheme = useColorScheme();
    const messages = [
        {
            id: 1,
            name: 'Alice',
            lastMessage: 'Hey, how are you?',
            numberNewMessages: 2,
            image: 'https://randomuser.me/api/ports/1',
        },
        {
            id: 2,
            name: 'Bob',
            lastMessage: 'See you later!',
            numberNewMessages: 1,
            image: 'https://randomuser.me/api/ports/2',
        }
    ];


  return (
    <View style={styles.container}>
        <ScrollView 
            style={{ width: '100%', flex: 1 }} 
            contentContainerStyle={{ 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}
        >
            {messages.map((message) => (
                <View style={styles.messageModalHovered} key={message.id}>
                    <MessageModal profileImage={message.image} senderName={message.name} lastMessage={message.lastMessage} numbrNewMessage={message.numberNewMessages} />
                </View>
            ))}
            
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    messageModalHovered:{
        width: '98%',
        height:70,
        marginTop: 10,
    },
    titleTextDarkThem:{
        fontSize: 24,
        fontWeight: 'bold',
        color:'white',
        width: '100%',
        height:100
    },
    titleTextNotDarkThem:{
        fontSize: 24,
        fontWeight: 'bold',
        color:'black',
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});