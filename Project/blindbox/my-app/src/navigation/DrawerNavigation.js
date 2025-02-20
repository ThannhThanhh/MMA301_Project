import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

const DrawerStack = createDrawerNavigator()
const DrawerNavigation = () => {
  const userRole = useSelector((state) => state.auth.role); // Replace state.user.role with your actual state path
  return (
    <DrawerStack.Navigator>
      <DrawerStack.Screen
      />
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;