import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors, defaultStyle } from "../styles/styles";
import Header from "../components/Header";
import Heading from "../components/Heading";
import ConfirmOrderItem from "../components/ConfirmOrderItem";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ConfirmOrder = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [itemsPrice] = useState(
    cartItems.reduce((prev, curr) => prev + curr.quantity * curr.price, 0)
  );
  const [shippingCharges] = useState(itemsPrice > 10000 ? 0 : 200);
  const [tax] = useState(Number((itemsPrice * 0.13).toFixed(2)));
  const [totalAmount] = useState(itemsPrice + shippingCharges + tax);
  const totalCartItems = cartItems.length;

  const navigate = useNavigation();
  return (
    <View style={defaultStyle}>
      <Header back={true} />
      <Heading
        text1={"Confirm"}
        text2={"Order"}
        containerStyle={{ paddingTop: moderateScale(65) }}
      />
      {totalCartItems <= 0 ? (
        <View style={styles.noItems}>
          <Text style = {styles.noItemsText}>Nothing to show here</Text>
        </View>
      ) : (
        <>
          <View style={styles.orderItemCont}>
            <ScrollView>
              {cartItems.map((item) => (
                <ConfirmOrderItem
                  key={item.product}
                  name={item.name}
                  price={item.price}
                  imgSrc={item.image}
                  quantity={item.quantity}
                />
              ))}
            </ScrollView>
          </View>

          <PriceTag heading={"Sub Total"} price={itemsPrice} />
          <PriceTag heading={"Shipping Charges"} price={shippingCharges} />
          <PriceTag heading={"Tax"} price={tax} />
          <View style={styles.line}></View>
          <PriceTag heading={"Total"} price={totalAmount} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigate.navigate("Payment", {
                itemsPrice,
                tax,
                shippingCharges,
                totalAmount,
              })
            }
          >
            <Button
              icon={"chevron-right"}
              textColor={colors.color2}
              style={styles.paymentBtn}
            >
              Payment
            </Button>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const PriceTag = ({ heading, price }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: verticalScale(4),
      paddingHorizontal: scale(5),
    }}
  >
    <Text style={{ fontWeight: "800", fontSize: moderateScale(14) }}>{heading}</Text>
    <Text style={{ fontSize: moderateScale(14) }}>₹{price}</Text>
  </View>
);

export default ConfirmOrder;

const styles = StyleSheet.create({
  orderItemCont: {
    flex: 1,
    paddingVertical: verticalScale(15),
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.color1,
  },
  noItems:{
    height:"70%",
    justifyContent:"center",
    alignItems:"center"
  },
  noItemsText:{
    fontSize:moderateScale(35),
    color:colors.color3_light
  },
  paymentBtn: {
    backgroundColor: colors.color1,
    padding: moderateScale(4),
    borderRadius: moderateScale(100),
    margin: moderateScale(8),
  },
});
