import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../Components/Header';

const bannerOne = require('../../assets/images/Management.png');

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', description: '', brand: '', image: '' });
  const [editedProduct, setEditedProduct] = useState({ name: '', quantity: '', price: '', description: '', brand: '', image: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.9:9999/product/list');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEditModal = (product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setEditedProduct(product);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setNewProduct({ name: '', quantity: '', price: '', description: '', brand: '', image: '' });
    setModalVisible(true);
  };

  const handleInputChange = (setterFunction, field, value) => {
    setterFunction((prev) => ({ ...prev, [field]: value }));
  };

  const addProduct = async () => {
    try {
      const response = await axios.post('http://192.168.1.9:9999/product/add', newProduct);
      if (response.data && response.data.product) {
        setProducts([...products, response.data.product]);
        Alert.alert("Success", "Product added successfully!");
      } else {
        console.error("Error: Product data is missing in the response", response.data);
      }
      setModalVisible(false);
      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const editProduct = async () => {
    try {
      const response = await axios.put(`http://192.168.1.9:9999/product/update/${selectedProduct._id}`, editedProduct);
      if (response.data) {
        setProducts(products.map((product) => (product._id === response.data._id ? response.data : product)));
        Alert.alert("Success", "Product edited successfully!");
      }
      setModalVisible(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const confirmDeleteProduct = (productId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteProduct(productId),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://192.168.1.9:9999/product/delete/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Image source={bannerOne} style={styles.bannerImage} />

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
                <Text style={styles.productDetails}>Price: ${item.price}</Text>
                <Text style={styles.productDetails}>Brand: {item.brand}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                    <Icon name="edit" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteProduct(item._id)}>
                    <Icon name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />

        {/* Add/Edit Product Modal */}
        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={isEditMode ? editedProduct.name : newProduct.name}
                onChangeText={(value) => handleInputChange(isEditMode ? setEditedProduct : setNewProduct, 'name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={String(isEditMode ? editedProduct.quantity : newProduct.quantity)}
                onChangeText={(value) => handleInputChange(isEditMode ? setEditedProduct : setNewProduct, 'quantity', parseInt(value))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={String(isEditMode ? editedProduct.price : newProduct.price)}
                onChangeText={(value) => handleInputChange(isEditMode ? setEditedProduct : setNewProduct, 'price', parseFloat(value))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={isEditMode ? editedProduct.description : newProduct.description}
                onChangeText={(value) => handleInputChange(isEditMode ? setEditedProduct : setNewProduct, 'description', value)}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Brand"
                value={isEditMode ? editedProduct.brand : newProduct.brand}
                onChangeText={(value) => handleInputChange(isEditMode ? setEditedProduct : setNewProduct, 'brand', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={isEditMode ? editedProduct.image : newProduct.image}
                onChangeText={(value) => handleInputChange(isEditMode ? setEditedProduct : setNewProduct, 'image', value)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={isEditMode ? editProduct : addProduct}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: 'red' }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#white',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: -40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    borderRadius: 30,
    marginVertical: 10,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#333',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    color: '#777',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
});

export default ManageProduct;
