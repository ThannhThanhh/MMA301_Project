import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import axios from 'axios';

const Signup = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSignup = async () => {
    if (!username || !password || !email || !fullName || !phone || !address) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.9:9999/user/register', {
        username,
        password,
        email,
        fullName,
        phone,
        address,
      });

      if (response.status === 201) {
        Alert.alert("Success", response.data.message); 
        setUsername('');
        setPassword('');
        setEmail('');
        setFullName('');
        setPhone('');
        setAddress('');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        Alert.alert("Error", error.response.data.message); 
      } else {
        Alert.alert("Error", "Something went wrong. Please try again."); 
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/1.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Create Account</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
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
  headerContainer: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#262626',
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
  createButton: {
    backgroundColor: '#F97794',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '50%', // Width of "Create" button
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

export default Signup;
