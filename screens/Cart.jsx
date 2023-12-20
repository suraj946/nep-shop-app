import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { colors, defaultStyle } from "../styles/styles";
import Header from "../components/Header";
import Heading from "../components/Heading";
import { Button } from "react-native-paper";
import CartItem from "../components/CartItem";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigation();

  // TODO Optimize the increment and decrement
  const incrementHandler = (id, quantity, stock) => {
    quantity += 1;
    if (quantity > stock) {
      Toast.show({ type: "error", text1: "Maximum quantity increarsed" });
      return;
    }
    dispatch({ type: "updateQuantity", payload: { product: id, quantity } });
  };

  const decrementHandler = (id, quantity) => {
    quantity -= 1;
    if (quantity <= 0) {
      Alert.alert("Confirm", "Remove product from cart", [
        { text: "No", onPress: () => null, style: "cancel" },
        {
          text: "Yes",
          onPress: () => dispatch({ type: "removeFromCart", payload: id }),
        },
      ]);
      return;
    }
    dispatch({ type: "updateQuantity", payload: { product: id, quantity } });
  };

  const emptyCartHandler = () => {
    if (cartItems.length > 0) {
      Alert.alert("Confirm", "Clear cart", [
        { text: "No", onPress: () => null, style: "cancel" },
        {
          text: "Yes",
          onPress: () => dispatch({ type: "clearCart" }),
        },
      ]);
    }
  };

  return (
    <View style={{ ...defaultStyle, padding: moderateScale(0) }}>
      <StatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff" 
      />
      <Header back={true} inCart={true} emptyCartHandler={emptyCartHandler} />
      <Heading
        text1={"Shopping"}
        text2={"Cart"}
        containerStyle={{ paddingTop: 25, marginLeft: 15 }}
      />

      <View style={styles.cartItemCont}>
        {cartItems.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {cartItems.map((item, index) => (
              <CartItem
                key={item.product}
                name={item.name}
                price={item.price}
                imgSrc={item.image}
                stock={item.stock}
                index={index}
                id={item.product}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                quantity={item.quantity}
                navigate={navigate}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noItemView}>
            <Text style={styles.noItemText}>No items yet</Text>
          </View>
        )}
      </View>

      <View style={styles.cartInfoCont}>
        <Text>{cartItems.length} Items</Text>
        <Text>₹
            {
                cartItems.reduce((prev, curr) => prev + curr.quantity*curr.price, 0)
            }
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigate.navigate("Confirmorder")}
        disabled={cartItems.length <= 0}
      >
        <Button
          icon={"cart"}
          textColor={colors.color2}
          style={{
            ...styles.checkoutBtn,
            backgroundColor:
              cartItems.length <= 0 ? colors.btnDisable : colors.color1,
          }}
        >
          Checkout
        </Button>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  cartItemCont: {
    flex: 1,
    paddingVertical: verticalScale(17),
  },
  noItemView: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  noItemText: {
    fontSize: moderateScale(35),
    color: colors.color3_light,
  },
  cartInfoCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(30),
  },
  checkoutBtn: {
    margin: moderateScale(20),
    padding: moderateScale(4),
    borderRadius: moderateScale(100),
  },
});
