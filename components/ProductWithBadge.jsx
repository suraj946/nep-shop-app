import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { colors } from '../styles/styles';
import { Badge, Button } from 'react-native-paper';
import Star from './Star';

const ProductWithBadge = ({
    image,
    name,
    price,
    stock,
    i,
    id,
    navigation,
    addToCart,
    discount,
    averageRating,
    typeText
}) => {
    const discountedPrice = price - Math.round((price * discount)/100);
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Productdetails", {id})} activeOpacity={0.9}>
        <View style={{...styles.cardCont, backgroundColor : i%2 === 0 ? colors.color3 : colors.color2}}>
            <CustomBadge text={typeText} />
            <View style={styles.imageCont}>
                <Image source={{ uri: image }} style={styles.imageStyle} />
            </View>
            <View style={styles.infoCont}>
                <Text numberOfLines={1} style={styles.nameTxt}>{name}</Text>
                <View style={styles.otherView}>
                    <Text style={styles.discoutTxt}>Less {discount}% Discount</Text>
                    <View style={styles.priceView}>
                        <Text style={{...styles.beforeDis, color:i%2===0 ? colors.color2 : colors.color3}}>₹{price}</Text>
                        <Text style={styles.afterDis}>₹{discountedPrice}</Text>
                    </View>
                    <Star rating={averageRating} defaultColor={colors.starDefault} activeColor={colors.color1} containerStyle={{margin:moderateScale(5)}} />
                    <Button 
                        textColor={colors.color1} 
                        style={{
                            marginTop:verticalScale(10),
                            backgroundColor:i%2===0 ? colors.color2 : colors.color3
                        }}
                        icon={"cart"}
                        onPress={() => addToCart({id, name, image, stock, price : discountedPrice, quantity:1})}
                    >Add To Cart</Button>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default ProductWithBadge;

// export const Star = ({rating, size=25, defaultColor=colors.starDefault, starCount = 5, activeColor="#ffff00", containerStyle={}}) => {
//     const generateColor = (index) => {
//         return index <= rating ? activeColor : defaultColor;
//     }
//     return(
//         <View style={{...styles.starCont, ...containerStyle}}>
//             {
//                 [...Array(starCount)].map((n, i) => (
//                     <Avatar.Icon key={i} icon={"star"} size={moderateScale(size)} color={generateColor(i+1)} style={styles.star} />
//                 ))
//             }
//         </View>
//     )
// }

export const CustomBadge = ({text, bgColor=colors.color1, contStyle={}}) => {
    return(
        <View style={{...styles.badge, ...contStyle}}>
            <Badge style={{...styles.label, backgroundColor:bgColor}}>{text}</Badge>
        </View>
    )
}

const styles = StyleSheet.create({
    cardCont:{
        width:scale(317),
        height:scale(200),
        margin:moderateScale(5),
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        flexDirection:"row",
        borderRadius:moderateScale(5),
        position:"relative"
    },
    imageCont:{
        backgroundColor:colors.color1,
        flex:0.5,
        borderRadius:moderateScale(5),
        borderTopRightRadius:moderateScale(150),
        borderBottomRightRadius:moderateScale(150),
        justifyContent:"center",
        alignItems:"center"
    },
    imageStyle:{
        width:scale(120),
        height:scale(120)
    },
    infoCont:{
        flex:0.5,
        padding:moderateScale(10),
    },
    nameTxt:{
        fontSize:moderateScale(20),
        color:colors.color1,
    },
    otherView:{
        marginTop:verticalScale(15),
    },
    discoutTxt:{
        fontSize:moderateScale(17),
        color:colors.color2,
        backgroundColor:colors.color1,
        borderRadius:moderateScale(50),
        padding:moderateScale(5),
        textAlign:"center"
    },
    priceView:{
        display:"flex",
        flexDirection:"row",
        marginTop:verticalScale(10),
        alignItems:"center",
        justifyContent:"center"
    },
    priceTxt:{
        color:colors.color2,
        fontSize:moderateScale(16),
    },
    beforeDis:{
        color:colors.color2,
        fontSize:moderateScale(15),
        textDecorationLine:"line-through",
        textDecorationStyle:"solid"
    },
    afterDis:{
        color:colors.color1,
        fontSize:moderateScale(17),
        marginLeft:scale(10),
        textAlign:"center",
        fontWeight:"600"
    },

    //badge tyle
    badge: {
        position:"absolute",
        zIndex:100,
        borderRadius:moderateScale(20),
        padding:moderateScale(5),
        right:scale(-3),
        top:verticalScale(-8),
    },
    label: {
        color:colors.color2,
        fontSize:moderateScale(13),
        textTransform:"capitalize"
    },
});