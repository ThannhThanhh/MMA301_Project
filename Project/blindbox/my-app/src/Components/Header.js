import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bars4Icon, ShoppingCartIcon } from 'react-native-heroicons/outline';
import logo from '../../assets/fluffy.png';
import { colors } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotalQuantity } from '../redux/orebiSlices';
import { logoutUser } from '../redux/authSlice';

const Header = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch(); // Add dispatch to use the Redux logout action
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const totalQuantity = useSelector(selectCartTotalQuantity);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            setIsLoggedIn(!!token); 
        };

        checkLoginStatus();

        const unsubscribe = navigation.addListener('focus', checkLoginStatus);
        return unsubscribe; 
    }, [navigation]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token'); 
        await AsyncStorage.removeItem('userRole'); // Clear the role when logging out
        dispatch(logoutUser()); // Dispatch Redux action to update state
        setIsLoggedIn(false); // Update local state to reflect logout
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <Pressable onPress={() => navigation.openDrawer()}>
                    <Bars4Icon color={colors.textBlack} size={20} />
                </Pressable>

                <Pressable onPress={() => navigation.navigate('Home')} style={styles.logoContainer}>
                    <Image source={logo} alt="logo-icon" style={styles.logo} />
                </Pressable>

                <View style={styles.authContainer}>
                    {isLoggedIn ? (
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={styles.authText}>Logout</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.authText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Pressable onPress={() => navigation.navigate('Cart')} style={styles.cartIcon}>
                    <ShoppingCartIcon color={colors.textBlack} size={22} />
                    <View style={styles.cartCount}>
                        <Text style={styles.cartText}>{totalQuantity > 0 ? totalQuantity : 0}</Text>
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 45,
        resizeMode: 'contain',
    },
    authContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    authText: {
        color: colors.textBlack,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});

export default Header;
