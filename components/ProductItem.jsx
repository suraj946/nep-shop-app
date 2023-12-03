import { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "../styles/styles";
import { Button } from "react-native-paper";
import Star from "./Star";

const ProductItem = ({
  image,
  name,
  price,
  stock,
  i,
  id,
  navigation,
  addToCart,
  contStyle={},
  averageRating,

}) => {
    // console.log("Card item", Math.round(Math.random()));
  return (
    <TouchableOpacity
      style={{
        ...styles.mainViewStyle,
        ...contStyle
      }}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("Productdetails", { id })}
    >
      <View style={styles.itemCont}>
        <View style={styles.imgCont}>
          <Image source={{ uri: image }} style={styles.imageStyle} />
        </View>
        <View
          style={{
            ...styles.upper,
            backgroundColor: i % 2 == 0 ? colors.color1 : colors.color3,
          }}
        >
          <Text style={styles.nameTxt} numberOfLines={1}>{name}</Text>
        </View>
        <View style={styles.lower}>
          <View style={styles.detailsCont}>
            <Text style={styles.priceTxt}>₹{price}</Text>
            <Star rating={averageRating} defaultColor={colors.starDefault} activeColor={colors.color1} containerStyle={{margin:0}}/>
            <TouchableOpacity
              style={{
                ...styles.addBtn,
                backgroundColor: i % 2 == 0 ? colors.color3 : colors.color1,
              }}
              activeOpacity={0.8}
              onPress={() =>
                addToCart({ id, name, image, stock, price, quantity: 1 })
              }
            >
              <Button textColor={colors.color2}>Add</Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProductItem);

const styles = StyleSheet.create({
    mainViewStyle:{
        width: scale(150),
        margin: moderateScale(10),
    },
    itemCont: {
        width: "100%",
        height: verticalScale(185),
        backgroundColor: colors.color2,
        borderRadius: moderateScale(10),
        position: "relative",
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 8,
    },
    imgCont: {
        width: "100%",
        position: "absolute",
        zIndex: 10,
        flex: 1,
        alignItems: "center",
        top: "15%",
    },
    imageStyle: {
        width: scale(90),
        height: scale(90),
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    upper: {
        height: "35%",
        padding: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    lower: {
        backgroundColor: colors.color2,
        height: "65%",
        position: "relative",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    detailsCont: {
        position: "absolute",
        bottom: verticalScale(0),
        alignItems: "center",
        width: "100%",
    },
    addBtn: {
        width: "100%",
        marginTop: verticalScale(5),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    nameTxt:{
        color: colors.color2,
        fontSize: moderateScale(16),
        textAlign: "center",
    },
    priceTxt:{
        color: colors.color3,
        fontSize: moderateScale(18),
        marginTop: verticalScale(5),
    }
});
