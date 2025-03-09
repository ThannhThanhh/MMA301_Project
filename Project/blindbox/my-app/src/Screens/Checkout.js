import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { colors } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { resetCart } from "../redux/orebiSlices"; // Import action để xóa giỏ hàng

const Checkout = () => {
  const navigation = useNavigation();
  const { products } = useSelector((state) => state.orebiSlices);
  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 50;
  const total = subtotal - discount;

  // State lưu thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "COD", // Mặc định là thanh toán khi nhận hàng
  });

  const dispatch = useDispatch();
  const handleConfirmOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      Toast.show({
        type: "error",
        text1: "Please fill in all shipping details",
        text1Style: { color: "red" },
      });
      return;
    }

    const orderData = {
      customerName: shippingInfo.name,
      address: shippingInfo.address,
      phone: shippingInfo.phone,
      paymentMethod: shippingInfo.paymentMethod,
      items: products,
      totalAmount: total,
      createdAt: new Date().toISOString(),
    };
  
    try {
      const response = await fetch("http://192.168.1.9:9999/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to place order");
      }

    // Hiển thị thông báo đặt hàng thành công
    Toast.show({
      type: "success",
      text1: "Order Confirmed!",
      text1Style: { color: "green" },
      text2: "Your order has been successfully placed.",
      text2Style: { color: "black" },
    });

    // Xóa giỏ hàng
    dispatch(resetCart());

    // Điều hướng đến trang xác nhận thành công
    //     navigation.navigate("OrderSuccess");

    // Điều hướng về trang Home
    setTimeout(() => {
      navigation.navigate("Home");
    }, 3000); // Chờ 3 giây trước khi chuyển trang
  } catch (error) {
    console.error("Error placing order:", error);
    Toast.show({
      type: "error",
      text1: "Order Failed!",
      text1Style: { color: "red" },
      text2: "Something went wrong. Please try again.",
    });
  }
  };

  return (
    <ImageBackground
      source={require("../../assets/cartCover.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.checkoutTitle}>Shipping Information</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={shippingInfo.name}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Shipping Address"
              value={shippingInfo.address}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, address: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={shippingInfo.phone}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, phone: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Payment Method"
              value={shippingInfo.paymentMethod}
              editable={false} 
            />
          </View>

          <View style={{ backgroundColor: colors.defaultWhite, padding: 20 }}>
            <View style={styles.row}>
              <Text style={styles.text}>Subtotal</Text>
              <Text style={styles.subtotal}>{subtotal.toFixed(3)} VND</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Discount</Text>
              <Text style={styles.discount}>-{discount.toFixed(3)} VND</Text>
            </View>
            <View style={[styles.row, { marginVertical: 5 }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>{total.toFixed(3)} VND</Text>
            </View>

            <TouchableOpacity
              onPress={handleConfirmOrder}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutText}>Confirm Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Back</Text>
            </TouchableOpacity>
          </View>
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
  checkoutTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textBlack,
    textAlign: "center",
    marginVertical: 10,
  },
  inputContainer: {
    backgroundColor: colors.defaultWhite,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: colors.defaultWhite,
  },
  productList: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: colors.textBlack,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textBlack,
  },
  discount: {
    fontSize: 16,
    color: colors.textGray,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textBlack,
    fontWeight: "700",
  },
  total: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textBlack,
  },
  checkoutButton: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  checkoutText: {
    color: colors.defaultWhite,
    fontSize: 16,
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: colors.defaultWhite,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.lightText,
  },
  continueText: {
    color: colors.textBlack,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Checkout;
