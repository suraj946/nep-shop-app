import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react'
import { colors } from '../styles/styles';
import { Button } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomBadge } from './ProductWithBadge';
import Star from './Star';

const ProductCard = ({
    name, stock, image, price, discount, i, id, navigation, addToCart, typeText, averageRating
}) => {
    const discountedPrice = price - Math.round((price * discount)/100);
  return (
    <TouchableOpacity style={styles.productCardCont} onPress={()=>navigation.navigate("Productdetails", {id})} activeOpacity={1}>
        <View style={styles.badge}>
            <CustomBadge text={typeText} bgColor={colors.color3_light} contStyle={{right:scale(-6)}}/>
        </View>
        <View style={{...styles.card, backgroundColor:i % 2 === 0 ? colors.color1 : colors.color2}}>
            <View style={styles.productInfo}>
                <Text
                    numberOfLines={1}
                    style={{
                        color:i%2 === 0 ? colors.color2 : colors.color3,
                        fontSize:moderateScale(22),
                        fontWeight:"300"
                    }}
                >{name}</Text>
                <Text
                    numberOfLines={1}
                    style={{
                        color:i%2 === 0 ? colors.color2 : colors.color3,
                        fontSize:moderateScale(18),
                        fontWeight:"700"
                    }}
                >₹{price}</Text>

                <Star rating={averageRating} defaultColor={colors.starDefault} />
            </View>

            <Image source={{uri:image}} style={styles.productCardImg}/>

            <TouchableOpacity
                style={{
                    backgroundColor:i%2 === 0 ? colors.color2 : colors.color3,
                    width:"100%",
                    borderRadius:moderateScale(0),
                    borderBottomLeftRadius:moderateScale(5),
                    borderBottomRightRadius:moderateScale(5),
                    height:verticalScale(28)
                }}
            >
                <Button 
                    textColor={i%2 === 0 ? colors.color1 : colors.color2}
                    onPress={()=>addToCart({id, name, image, stock, price : discountedPrice, quantity:1})}
                >Add To Cart</Button>
            </TouchableOpacity>
        </View> 
    </TouchableOpacity>
  )
}

export default memo(ProductCard);

const styles = StyleSheet.create({
    productCardCont:{
        width:scale(190),
        height:verticalScale(290),
        margin:moderateScale(10),
    },
    card:{
        width:"100%",
        height:"100%",
        borderRadius:moderateScale(5),
        alignItems:"center",
        justifyContent:"space-between",
        elevation:6,
    },
    productCardImg:{
        width:scale(180),
        height:scale(180),
        resizeMode:"contain",
    },
    productInfo:{
        width:"100%",
        padding:moderateScale(10),
        paddingVertical:verticalScale(5),
        alignItems:"center",
    }
});