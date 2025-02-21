import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import React from 'react';
import Header from '../Components/Header';
import { useSelector } from 'react-redux';
import CartProduct from '../Screens/CartProduct';
import { colors } from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Cart = () => {
  const navigation = useNavigation();
  const { products } = useSelector(state => state.orebiSlices);
  const subtotal = products.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = 50;
  const total = subtotal - discount;

  return (
    <ImageBackground
      source={require('../../assets/cartCover.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {products && products.length > 0 ? (
            <>
              <View style={styles.productList}>
                {products.map((item) => (
                  <CartProduct key={item.productId} item={item} />
                ))}
              </View>
              <View style={{ backgroundColor: colors.defaultWhite, padding: 20 }}>
                <View style={styles.row}>
                  <Text style={styles.text}>Subtotal</Text>
                  <Text style={styles.subtotal}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.text}>Discount</Text>
                  <Text style={styles.discount}>-${discount}</Text>
                </View>
                <View style={[styles.row, { marginVertical: 5 }]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.total}>${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => Toast.show({
                  type: 'error',
                  text1: 'Please login to initialize the Checkout',
                  text1Style: { color: 'red' },
                  text2: 'Login feature is on progress, please wait...',
                  text2Style: { color: 'black' },
                })}
                  style={styles.checkoutButton}>
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}
                  style={styles.continueButton}>
                  <Text style={styles.continueText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}
                style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Shopping</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
  },
  productList: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.textBlack,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textBlack,
  },
  discount: {
    fontSize: 16,
    color: colors.textGray,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textBlack,
    fontWeight: '700',
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textBlack,
  },
  checkoutButton: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  checkoutText: {
    color: colors.defaultWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: colors.defaultWhite,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.lightText,
  },
  continueText: {
    color: colors.textBlack,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCart: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textBlack,
    textAlign: 'center',
    fontWeight: '800',
  },
  backButton: {
    backgroundColor: colors.defaultWhite,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.lightText,
    marginTop: 20,
  },
  backButtonText: {
    color: colors.textBlack,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Cart;
