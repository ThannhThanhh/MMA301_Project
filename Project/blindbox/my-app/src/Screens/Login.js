import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice'; // Import the setUser action

const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.9:9999/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                const { userId, token, role } = data;
                Alert.alert('Login Successful', data.message);
              
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('username', username); 

                dispatch(setUser({ userId, token, role }));

                navigation.navigate('Hello', { username });
            } else {
                Alert.alert('Login Failed', data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/1.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.backButtonText}>&lt;</Text>
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Sign in</Text>
                    <Text style={styles.subHeaderText}>to your account</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>
                        Forgot your password?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton} onPress={handleLogin}>
                    <Text style={styles.createButtonText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.footerText}>
                        Don’t have an account?
                        <Text style={{ textDecorationLine: 'underline' }}> Create</Text>
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#FFFFFF99',
        borderRadius: 10,
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerContainer: {
        marginBottom: 30,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#262626',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        color: '#262626',
        textAlign: 'center',
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    forgotPasswordText: {
        color: '#BEBEBE',
        textAlign: 'right',
        width: '90%',
        fontSize: 15,
        marginVertical: 10,
    },
    createButton: {
        backgroundColor: '#F97794',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        marginTop: 20,
    },
    createButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    footerText: {
        color: '#262626',
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
    },
});

export default Login;
