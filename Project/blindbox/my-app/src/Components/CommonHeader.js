import { View, Text, SafeAreaView, StyleSheet, Pressable, Image, Alert } from 'react-native';
import React from 'react';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { colors } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ShoppingCartIcon } from 'react-native-heroicons/outline';
import logo from '../../assets/fluffy.png';
import { selectCartTotalQuantity } from '../redux/orebiSlices';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const CommonHeader = ({ title, isLoggedIn, setIsLoggedIn }) => {
    const navigation = useNavigation();
    const totalQuantity = useSelector(selectCartTotalQuantity);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false); // Update the login state
        Alert.alert('Logged out', 'You have been logged out successfully.'); // Optional alert
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ArrowLeftIcon color={colors.textBlack} size={20} />
                    <Text style={{ color: colors.textBlack, marginLeft: 5, fontWeight: '700' }}>{title}</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image source={logo} alt="logo-icon" style={styles.logo} />
                </Pressable>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <Pressable onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </Pressable>
                    ) : (
                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Login</Text>
                        </Pressable>
                    )}
                    <Pressable onPress={() => navigation.navigate('Cart')} style={styles.cartIcon}>
                        <ShoppingCartIcon color={colors.textBlack} size={22} />
                        <View style={styles.cartCount}>
                            <Text style={styles.cartText}>{totalQuantity > 0 ? totalQuantity : 0}</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    logo: {
        width: 200,
        height: 45,
        objectFit: 'contain',
        marginRight: 35,
    },
    cartIcon: {
        position: 'relative',
    },
    cartCount: {
        borderRadius: 50,
        backgroundColor: 'black',
        position: 'absolute',
        right: -4,
        top: -6,
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    logoutText: {
        color: colors.textBlack,
        fontWeight: '700',
        marginRight: 15, // Add spacing between logout and cart
    },
    loginText: {
        color: colors.textBlack,
        fontWeight: '700',
        marginRight: 15, // Add spacing between login and cart
    },
});

export default CommonHeader;
