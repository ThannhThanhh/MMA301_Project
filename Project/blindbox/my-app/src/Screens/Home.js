import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import { colors } from "../constants";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ShoppingCartIcon } from "react-native-heroicons/outline";
import Loader from "../Components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/orebiSlices";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "react-native-axios";
import { Picker } from "@react-native-picker/picker";

const { height, width } = Dimensions.get("window");
const bannerOne = require("../../assets/images/banner1.png");
const bannerTwo = require("../../assets/images/banner2.png");
const bannerThree = require("../../assets/images/banner3.png");

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // Cắt danh sách sản phẩm dựa trên trang hiện tại
  const displayedProducts = products.slice(0, currentPage * productsPerPage);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            "http://192.168.1.9:9999/product/list",
            {
              params: {
                brand: selectedBrand || undefined,
                name: debouncedSearchTerm || undefined,
              },
            }
          );
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const fetchBrands = async () => {
        try {
          const response = await axios.get(
            "http://192.168.1.9:9999/product/brands"
          );
          setBrands(["All Brands", ...response.data]);
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      };

      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem("authToken");
        setIsLoggedIn(!!token);
      };

      fetchProducts();
      fetchBrands();
      checkLoginStatus();
    }, [selectedBrand, debouncedSearchTerm])
  );

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand === "All Brands" ? "" : brand);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsLoggedIn(false);
      Alert.alert("Logout Success", "You have been logged out.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const images = [bannerOne, bannerTwo, bannerThree];

  const RenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productView}
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item._id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.img} />

      <View style={styles.textView}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>

        <View style={styles.priceCartContainer}>
          <Text style={styles.price}>{item.price},000 VNĐ</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(
                addToCart({
                  productId: item._id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                })
              );
              Toast.show({
                type: "success",
                text1: `${item.name} added to cart successfully`,
              });
            }}
            style={styles.cartButton}
          >
            <ShoppingCartIcon size={20} color={colors.textBlack} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <Loader title="Product is Loading..." />
        ) : (
          <FlatList
            data={displayedProducts}
            contentContainerStyle={styles.container}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            renderItem={RenderItem}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 2000);
            }}
            numColumns={2}
            ListFooterComponent={
              displayedProducts.length < products.length || currentPage > 1 ? (
                <View style={styles.footerButtons}>
                  {displayedProducts.length < products.length && (
                    <TouchableOpacity
                      style={styles.loadMoreButton}
                      onPress={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <Text style={styles.loadMoreText}>Xem thêm</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage > 1 && (
                    <TouchableOpacity
                      style={styles.collapseButton}
                      onPress={() => setCurrentPage(1)}
                    >
                      <Text style={styles.loadMoreText}>Thu gọn</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : null
            }
            ListHeaderComponent={
              <View>
                <Carousel
                  loop
                  width={width}
                  style={styles.carouselContainer}
                  autoPlay={true}
                  data={images}
                  scrollAnimationDuration={1000}
                  renderItem={({ item }) => (
                    <View>
                      <Image source={item} style={styles.carouselImage} />
                    </View>
                  )}
                />

                {/* Search and Brand Filter */}
                <View style={styles.filterContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                  <View style={styles.dropdownContainer}>
                    <Picker
                      selectedValue={
                        selectedBrand === "" ? "All Brands" : selectedBrand
                      }
                      onValueChange={handleBrandChange}
                      style={styles.dropdown}
                      mode="dropdown"
                    >
                      {brands.map((brand) => (
                        <Picker.Item key={brand} label={brand} value={brand} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Nếu không có sản phẩm, hiển thị thông báo */}
                {products.length === 0 && (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No products found !</Text>
                  </View>
                )}
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#B3E5FC",
    paddingBottom: '100%',
  },
  noProductsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  noProductsText: {
    fontSize: 18,
    color: colors.lightText,
  },
  carouselContainer: {
    height: 250,
    marginBottom: 10,
    width: '100%',
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#f8f8f8",
  },
  dropdownContainer: {
    width: 180,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    overflow: "hidden",
  },
  dropdown: {
    height: 50,
  },
  productView: {
    width: 200,
    height: height / 2.5,
    borderWidth: 0,
    margin: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "pink",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    justifyContent: "space-between",
  },
  img: {
    width: "90%",
    height: "66%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  textView: {
    padding: 10,
  },
  productName: {
    fontSize: 11,
    fontWeight: "750",
    color: colors.textBlack,
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  priceCartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  price: {
    fontWeight: "700",
    color: colors.textBlack,
    fontSize: 12,
  },
  cartButton: {
    backgroundColor: colors.designColor,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  loadMoreButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
    marginHorizontal: 10,
  },
  collapseButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
    marginHorizontal: 10,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },  
});

export default Home;
