import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Avatar } from 'react-native-paper';
import { colors } from '../styles/styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Header = ({back, inCart=false, emptyCartHandler=()=>{} }) => {

    const navigate = useNavigation();
    const route = useRoute();

    const {cartItems} = useSelector(state => state.cart);

  return (
    <>
    {back ? (
        <>
            <TouchableOpacity style={{...styles.iconCont, left:scale(-5)}} onPress={()=>navigate.goBack()}>
                <Avatar.Icon 
                    icon={"arrow-left"}
                    style={{backgroundColor:colors.color4}}
                    color={route.name === "Productdetails" ? colors.color2 : colors.color3}
                />
            </TouchableOpacity>
            <Text style={{...styles.iconCont, ...styles.logoTextStyle,alignSelf:"center"}}>NEP-SHOP</Text>
        </>
    ) : (
        <Text style={{...styles.iconCont, ...styles.logoTextStyle}}>NEP-SHOP</Text>
    )}

    <TouchableOpacity 
        style={[styles.iconCont, {right:scale(-5)}]} 
        onPress={inCart ? emptyCartHandler : ()=>navigate.navigate("Cart")}
    >
        <Avatar.Icon 
            icon={inCart ? "delete-outline" : "cart-outline"}
            style={{backgroundColor:colors.color4}}
            color={route.name === "Productdetails" ? colors.color2 : colors.color3}
        />
        {
            (!inCart && cartItems.length > 0) && <Text style={styles.cartCountText}>{cartItems.length}</Text>
        }
    </TouchableOpacity>
    </>
  )
}

export default Header;

const styles = StyleSheet.create({
    iconCont:{
        position:"absolute",
        // top:verticalScale(5),
        zIndex:10
    },
    cartCountText:{
        position:"absolute",
        backgroundColor:colors.color1,
        width:scale(15),
        height:scale(15),
        color:colors.color2,
        textAlign:"center",
        textAlignVertical:"center",
        borderRadius:moderateScale(50),
        right:scale(18),
        top:verticalScale(1)
    },
    logoTextStyle:{
        fontSize:moderateScale(25),
        top:verticalScale(15),
        color:colors.color1
    }
});