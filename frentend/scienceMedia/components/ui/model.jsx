// Modal.js
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const MessageModal = ({ profileImage, senderName, lastMessage, numbrNewMessage }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <View
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: isHovered ? 'gray' : 'white',
            }}
        >
            <Image 
                source={{ uri: profileImage }} 
                style={{ width: 50, height: 50, borderRadius: 25 }} 
            />
            
            <View>
                <Text style={style.name}>{senderName}</Text>
                <Text style={style.lastMessage}>{lastMessage}</Text>
                
                {numbrNewMessage > 0 && (
                    <View style={style.newMessages}>
                        <Text style={{ color: 'white' }}>{numbrNewMessage}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    name: {
        marginTop: -7,
        marginLeft: 20,
        fontWeight: 'bold', 
    },
    lastMessage: {
        marginTop: 5,
        marginLeft: 23,
        color: '#555',
    },
    newMessages: {
        backgroundColor: 'red',
        width: 24,
        height: 24,
        marginTop: -30,
        marginLeft: 270,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    }
});

export default MessageModal;