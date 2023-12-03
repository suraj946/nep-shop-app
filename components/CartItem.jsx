import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../styles/styles';
import { Avatar } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


const CartItem = ({
    name, price, imgSrc, stock, index, id, incrementHandler, decrementHandler, quantity, navigate
}) => {
  return (
    <View style={styles.cartItemCont}>
        <View style={{...styles.imgCont,backgroundColor:index % 2 === 0 ? colors.color1 : colors.color3}}>
            <Image style={styles.pImg} source={{uri:imgSrc}} />
        </View>
        <View style={{width:"40%", paddingHorizontal:scale(20)}}>
            <Text numberOfLines={1} style={{fontSize:moderateScale(15)}} onPress={()=>navigate.navigate("Productdetails", {id})}>{name}</Text>
            <Text numberOfLines={1} style={{fontSize:moderateScale(15), fontWeight:"900"}}>₹{price}</Text>
        </View>
        <View style={styles.incDecCont}>
            <TouchableOpacity onPress={()=>decrementHandler(id, quantity)} activeOpacity={0.6}>
              <Avatar.Icon icon={"minus"} size={moderateScale(27)} style={styles.iconStyle} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity onPress={()=>incrementHandler(id, quantity, stock)} activeOpacity={0.6}>
              <Avatar.Icon icon={"plus"} size={moderateScale(27)} style={styles.iconStyle} />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default CartItem;

const styles = StyleSheet.create({
    cartItemCont:{
        flexDirection:"row",
        height:verticalScale(75),
        marginVertical:verticalScale(15)
    },
    imgCont:{
        width:"40%",
        borderTopRightRadius:moderateScale(100),
        borderBottomRightRadius:moderateScale(100),
    },
    pImg:{
        width:scale(80),
        height:scale(80),
        resizeMode:"contain",
        top:"-20%",
        left:"30%"
    },
    incDecCont:{
        width:"20%",
        alignItems:"center",
        height:verticalScale(68),
        justifyContent:"space-between",
        alignSelf:"center"
    },
    iconStyle:{
        borderRadius:5,
        backgroundColor:colors.color1,
        opacity:0.8
    },
    qtyText:{
        fontSize:moderateScale(20),
        paddingHorizontal:scale(5),
        color:colors.color3
      },
});