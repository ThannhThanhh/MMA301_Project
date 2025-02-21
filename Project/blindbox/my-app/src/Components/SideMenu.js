import { View, Text, SafeAreaView, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { XMarkIcon, HomeIcon, ShoppingCartIcon, UserIcon, LockClosedIcon, PhoneIcon } from 'react-native-heroicons/outline';

const SideMenu = ({userRole}) => {
  // console.log("User Role in SideMenu:", userRole); 

  const navigations = [
    { title: 'Home', icon: HomeIcon },
    { title: 'Intro', icon: UserIcon },
    { title: 'Cart', icon: ShoppingCartIcon },
    { title: 'Addresses', icon: UserIcon },
    { title: 'Contact', icon: PhoneIcon },
    ...(userRole === 'customer' || userRole === 'admin' ? [{ title: 'ChangePassword', icon: LockClosedIcon }] : []),
    ...(userRole === 'admin' ? [{ title: 'ManageProduct', icon: LockClosedIcon }] : []),
  ];

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Navigation</Text>
        <Pressable onPress={() => navigation.dispatch(DrawerActions.closeDrawer())} style={styles.closeButton}>
          <XMarkIcon size={24} color={'#ff6347'} />
        </Pressable>
      </View>

      <View style={styles.menuContainer}>
        {navigations.map(({ title, icon: Icon }) => (
          <Pressable key={title} style={styles.menuItem} onPress={() => navigation.navigate(title)}>
            <Icon size={20} color="#4a4a4a" style={styles.icon} />
            <Text style={styles.menuText}>{title}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#4a4a4a',
    fontWeight: '600',
  },
});

export default SideMenu;
