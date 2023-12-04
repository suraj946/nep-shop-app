import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { colors, defaultStyle } from '../styles/styles';
import Header from '../components/Header';
import Heading from '../components/Heading';
import { Button, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../redux/action/otherAction';
import {useMessageErrOther} from "../utils/hook";
import axios from 'axios';
import { server } from '../redux/store';
import { useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Payment = ({navigation, route}) => {
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const {isAuthenticated, user} = useSelector(state => state.user);
    const {cartItems} = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const loading = useMessageErrOther(dispatch, navigation, "Orders", ()=>({type:"clearCart"}));
    const stripe = useStripe();
    const [loaderLoading, setLoaderLoading] = useState(false);
    const {itemsPrice, tax, totalAmount, shippingCharges} = route.params;

    const redirectToLogin = ()=>{
        navigation.navigate("Login", {path:"Payment", data:{itemsPrice, tax, shippingCharges, totalAmount}});
    }
    const codHandler = (paymentInfo)=>{
        const shippingInfo = {
            address:user.address,
            city:user.city,
            country:user.country,
            pinCode:user.pinCode,
            phone:user.phone,
        }
        dispatch(placeOrder({
            shippingInfo,
            orderItems:cartItems,
            paymentMethod,
            paymentInfo,
            itemsPrice,
            tax,
            shippingCharges,
            totalAmount
        }));
    }
    const onlineHandler = async()=>{
        try {
            const {data} = await axios.post(`${server}/order/payment`, {totalAmount:route.params.totalAmount}, {
                headers:{
                    "Content-Type" : "application/json"
                },
                withCredentials:true
            });
            const init = await stripe.initPaymentSheet({
                paymentIntentClientSecret:data.client_secret,
                merchantDisplayName:"nep-shop"
            });

            if(init.error){
                return Toast.show({type:"error", text1:init.error.message});
            }

            const presentSheet = await stripe.presentPaymentSheet();
            setLoaderLoading(true);

            if(presentSheet.error){
                setLoaderLoading(false);
                return Toast.show({type:"error", text1:presentSheet.error.message});
            }

            const {paymentIntent} = await stripe.retrievePaymentIntent(data.client_secret);
            if(paymentIntent.status === "Succeeded"){
                codHandler({id:paymentIntent.id, status:paymentIntent.status});
            }
        } catch (error) {
            return Toast.show({
                type:"error",
                text1:"Some Error Occured",
                text2:error
            })
        }
    }


  return loaderLoading ? (
    <Loader />
  ) : (
    <View style={defaultStyle}>
        <Header back={true} />
        <Heading text1={"Payment"} text2={"Method"} containerStyle={{paddingTop:25}} />
        <View style={styles.methodCont}>
            <RadioButton.Group value={paymentMethod} onValueChange={setPaymentMethod}>
                <View style={styles.radioBtnCont}>
                    <Text style={styles.radioBtnText}>Cash On Delivery</Text>
                    <RadioButton value='COD' color={colors.color1} />
                </View>
                <View style={styles.radioBtnCont}>
                    <Text style={styles.radioBtnText}>Online</Text>
                    <RadioButton value='ONLINE' color={colors.color1} />
                </View>
            </RadioButton.Group>

            {/* Temporary it wiil be removed when the app will be on production */}
            {
                paymentMethod === "ONLINE"
                && <View style={{
                    position:"absolute",
                    bottom:10,
                    left:10
                }}>
                    <Text style={{color:colors.color1, fontSize:moderateScale(16), marginBottom:5}}>Use the following credentials for testing purpose</Text>
                    <Text style={{color:"#999999"}}>Use - 4242 4242 4242 4242 as card number</Text>
                    <Text style={{color:"#999999"}}>Expiration Date - Any future date</Text>
                    <Text style={{color:"#999999"}}>CVC - any 3 digit number (123)</Text>
                    <Text style={{color:"#999999"}}>Zip code - Any 5-digit ZIP code</Text>
                </View>
            }
        </View>
        <TouchableOpacity activeOpacity={0.7}
            disabled={loading}
            onPress={
                !isAuthenticated ? redirectToLogin : paymentMethod === "COD" ? () => codHandler() : onlineHandler
            }
        >
            <Button loading={loading} icon={paymentMethod === "COD" ? "check-circle" : "circle-multiple-outline"} textColor={colors.color2} style={{...styles.btn, backgroundColor:loading ? colors.btnDisable : colors.color1}}>
                {paymentMethod === "COD" ? "Place Order" : "Pay"}
            </Button>
        </TouchableOpacity>
    </View>
  )
}

export default Payment;

const styles = StyleSheet.create({
    methodCont:{
        backgroundColor:colors.color3,
        flex:1,
        marginVertical:verticalScale(20),
        padding:moderateScale(25),
        justifyContent:"center",
        borderRadius:moderateScale(10),
        marginHorizontal:scale(8)
    },
    radioBtnCont:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginVertical:verticalScale(8)
    },
    radioBtnText:{
        color:colors.color2,
        textTransform:"uppercase",
        fontSize:moderateScale(20),
        fontWeight:"900"
    },
    btn:{
        borderRadius:100,
        padding:moderateScale(6),
        margin:moderateScale(18),
    }
});