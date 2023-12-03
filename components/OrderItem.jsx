import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { colors } from '../styles/styles';
import { Button } from 'react-native-paper';
import { useState } from 'react';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const OrderItem = ({
    id,
    price, 
    address:{address, city, country, pinCode, phone}, 
    createdAt, 
    status, 
    paymentMethod, 
    updateHandler = ()=>{}, 
    admin=false, 
    disable=false,
    i = 0
}) => {
  const addressStr = [address, city, country, pinCode].filter(Boolean).join(' ');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={{
        ...styles.orderItemCont,
        backgroundColor:i%2 === 0 ? colors.color2 : colors.color3
    }}>
      <Button 
        onPress={() => navigation.navigate("Orderdetails", {id})}
        textColor={colors.color2} 
        style={{
          ...styles.idBtn, 
          backgroundColor:i%2 === 0 ? colors.color3 : colors.color1
        }}>ID - #{id}
      </Button>

      <TextBox title={"Address"} value={addressStr} i={i} />
      <TextBox title={"Phone"} value={phone} i={i} />
      <TextBox title={"Ordered On"} value={createdAt} i={i} />
      <TextBox title={"Price"} value={price} i={i} />
      <TextBox title={"Status"} value={status} i={i} />
      <TextBox title={"Payment Method"} value={paymentMethod} i={i} />
      { (admin && status !== "Delivered") && 
        <Button
            textColor={(loading || disable) ? colors.btnDisable : colors.color2}
            icon={"update"}
            style={{
                width:scale(180),
                alignSelf:"center",
                marginTop:verticalScale(10),
                backgroundColor:i%2===0 ? colors.color3 : colors.color1
            }}
            loading={loading}
            onPress={(loading || disable) ? null : ()=>updateHandler(id, setLoading)}
        >Update</Button> 
      }
    </View>
  )
}

const TextBox = ({title, value, i})=>(
    <Text style={{
        marginVertical:verticalScale(5),
        color:i%2 === 0 ? colors.color3 : colors.color2
    }}>
        <Text style={{fontWeight:"900"}}>{title} - </Text>
        { title==="Price"?"₹":"" }
        {value}
    </Text>
)

export default memo(OrderItem);

const styles = StyleSheet.create({
    orderItemCont:{
        padding:moderateScale(15),
        borderRadius:moderateScale(10),
        marginVertical:verticalScale(8),
        elevation:5,
        paddingTop:verticalScale(25),
    },
    idBtn:{
      backgroundColor:colors.color1,
      borderRadius:0,
      position:"absolute",
      top:0,
      left:0,
      width:"109%",
      borderTopLeftRadius:moderateScale(10),
      borderTopRightRadius:moderateScale(10),
    }
});