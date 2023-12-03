import { Image, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../styles/styles';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const ConfirmOrderItem = ({
    name, price, imgSrc, quantity
}) => {
  return (
    <View style={{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginHorizontal:scale(4),
        marginVertical:verticalScale(5),
    }}>
      <Image source={{uri:imgSrc}} style={{width:scale(50), height:scale(50), resizeMode:"contain"}} />
      <Text style={{fontSize:moderateScale(16), color:colors.color1, fontWeight:"900"}}>{name}</Text>
      <View style={{flexDirection:"row"}}>
        <Text>{quantity}</Text>
        <Text style={{marginHorizontal:scale(7)}}>X</Text>
        <Text>₹{price}</Text>
      </View>
    </View>
  )
}

export default ConfirmOrderItem;