import { Image, Dimensions, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Logo from '../../assets/favicon.png';
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get('window');

const Intro = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Image source={Logo} alt="intro-image" />
            </View>
            <View style={styles.bottom}>
                <Text style={styles.title}>Get your own Stuffed Animal</Text>
                <Text style={styles.subtitle}>Choose the right stuffed animal to have a good sleep</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        height: height,
    },
    top: {
        height: height / 2,
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
        padding: 30,
    },
    introImg: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        marginTop: -10,
    },
    bottom: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        color: 'black',
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#000',
        width: '90%',
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff'
    }
})
export default Intro;