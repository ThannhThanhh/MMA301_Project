import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Hello = ({ route }) => {
    const navigation = useNavigation();
    const { username } = route.params; 

    return (
        <View style={styles.container}>
            <Text style={styles.helloText}>
                Hello, {username} <Icon name="happy-outline" size={30} color="#FFD700" />
            </Text>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.homeButtonText}>Go to Homepage</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    helloText: {
        fontSize: 32,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeButton: {
        backgroundColor: '#F97794',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    homeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Hello;
