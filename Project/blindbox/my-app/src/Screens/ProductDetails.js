import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useRoute } from "@react-navigation/native";
import { colors } from "../constants";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import { addToCart } from "../redux/orebiSlices";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message"; // Ensure you have Toast installed
import axios from "react-native-axios";

const { height, width } = Dimensions.get("window");

const ProductDetails = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.9:9999/product/details/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [productId]);
  return (
    <View>
      <Header />
      <View style={styles.container}>
        <View style={styles.imgView}>
          {product ? (
            <Image
              source={{ uri: product.image }}
              alt="product-image"
              style={styles.img}
            />
          ) : (
            <Text style={styles.loaderText}>Product not found</Text>
          )}
        </View>
        {product && (
          <View style={styles.detailsView}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBrand}>Brand: {product.brand}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>
        )}
        {product && (
          <View style={styles.bottomMenu}>
            <View>
              <Text
                style={{
                  color: colors.defaultWhite,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                {product.price},000 VNĐ
              </Text>
            </View>
            <Pressable
              onPress={() => {
                dispatch(addToCart({ ...product, quantity: 1 }));
                Toast.show({
                  type: "success",
                  text1: `${product.name} added to cart successfully`,
                });
              }}
              style={{
                backgroundColor: colors.designColor,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  marginRight: 5,
                  color: colors.textBlack,
                }}
              >
                Add to Cart
              </Text>
              <ArrowRightIcon size={19} color={colors.textBlack} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#B3E5FC",
    height: height,
    position: "relative",
  },
  imgView: {
    width: width,
    height: height / 2,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: 35, // Bo góc ảnh
    borderWidth: 5, // Viền ảnh
    borderColor: "#A7C7E7",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 80,
    borderWidth: 1,
    borderColor: "#FF4F7D",
    width: width - 10,
    alignSelf: "center",
    borderRadius: 6,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: colors.bgColor,
  },
  loaderText: {
    textAlign: "center",
    marginTop: height / 4,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  detailsView: {
    marginTop: 15,
    marginHorizontal: 15,
    paddingLeft: 15,
    backgroundColor: "#FFD1DC",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textBlack,
    marginBottom: 10,
  },
  productBrand: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.buttonColor,
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 20,
    color: colors.textGray,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.designColor,
  },
});
export default ProductDetails;
