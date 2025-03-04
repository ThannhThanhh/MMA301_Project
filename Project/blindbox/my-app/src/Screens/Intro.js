import { Image, Dimensions, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get('window');

const Intro = () => {
    const navigation = useNavigation();

    return (
        <LinearGradient colors={["#FF7E5F", "#FD3A69"]} style={styles.container}>
            <View style={styles.top}>
                <Image source={require('../../assets/favicon.png')} style={styles.introImg} resizeMode="contain" />
            </View>
            <View style={styles.bottom}>
                <Text style={styles.title}>Discover the Mystery!</Text>
                <Text style={styles.subtitle}>Unbox surprises and collect your favorite items.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Start Now</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    top: {
        height: height * 0.55,
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
    },
    introImg: {
        width: 250,
        height: 250,
        borderRadius: 60,
        borderWidth: 5,
        borderColor: '#fff',
    },
    bottom: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 38,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#fff',
        width: '90%',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FD3A69',
    }
});

export default Intro;
