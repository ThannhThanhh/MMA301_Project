import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from '../Screens/Intro';
import Home from '../Screens/Home';
import Cart from '../Screens/Cart';
import ProductDetails from '../Screens/ProductDetails';
import Addresses from '../Screens/Addresses';
import Contact from '../Screens/Contact';
import Checkout from '../Screens/Checkout';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import Hello from '../Screens/Hello';
import ChangePassword from '../Screens/ChangePassword';
import ForgotPassword from '../Screens/ForgotPassword';
import ResetPassword from '../Screens/ResetPassword';
import ManageProduct from '../Screens/ManageProduct';

const RootStack = createNativeStackNavigator()
const StackNagivation = () => {
  return (
    <RootStack.Navigator initialRouteName='Intro'>
      <RootStack.Screen
        name='Intro'
        component={Intro}
        options={{ headerShown: false }} />
      <RootStack.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }} />
      <RootStack.Screen
        name='Cart'
        component={Cart}
        options={{ headerShown: false }} />
      <RootStack.Screen
        name='ProductDetails'
        component={ProductDetails}
        options={{ headerShown: false }} />
      <RootStack.Screen
        name='Addresses'
        component={Addresses}
        options={{ headerShown: false }} />
      <RootStack.Screen
        name='Contact'
        component={Contact}
        options={{ headerShown: false }} />
      <RootStack.Screen
        name='Checkout'
        component={Checkout}
        options={{ headerShown: false }} />
      <RootStack.Screen 
        name= 'Login'
        component={Login}
        options={{headerShown: false}}/>
        <RootStack.Screen 
        name= 'Signup'
        component={Signup}
        options={{headerShown: false}}/>
        <RootStack.Screen 
        name= 'Hello'
        component={Hello}
        options={{headerShown: false}}/>
        <RootStack.Screen 
        name= 'ChangePassword'
        component={ChangePassword}
        options={{headerShown: false}}/>
        <RootStack.Screen 
        name= 'ForgotPassword'
        component={ForgotPassword}
        options={{headerShown: false}}/>
        <RootStack.Screen 
        name= 'ResetPassword'
        component={ResetPassword}
        options={{headerShown: false}}/>
        <RootStack.Screen 
        name= 'ManageProduct'
        component={ManageProduct}
        options={{headerShown: false}}/>
    </RootStack.Navigator>
  );
};

export default StackNagivation;