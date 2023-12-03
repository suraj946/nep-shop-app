import { ScrollView, StyleSheet, Text, View, Alert, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {defaultStyle, colors, formHeading} from "../styles/styles";
import Header from "../components/Header";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import ButtonDisable from "../components/ButtonDisable";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import {server} from "../redux/store";
import {useErrorMessage} from "../utils/hook";
import { OrderShimmer } from '../components/Shimmers';

const OrderDetails = ({navigation, route}) => {
  const {user:{role}} = useSelector(state => state.user);
  const [order, setOrder] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const abortControllerRef = useRef(null);

  useErrorMessage(error, message, setError, setMessage);

  const updateHandler = async()=>{
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    try {
      setUpdateLoading(true);
      const {data} = await axios.put(`${server}/order/single/${route.params.id}`, {}, {
        signal:abortControllerRef.current?.signal,
        withCredentials:true
      });
      setUpdateLoading(false);
      if(data.success){
        const newOrder = {...order};
        newOrder.orderStatus = data.updatedStatus;
        setOrder(newOrder);
        setMessage(data.message);
      }
    } catch (err) {
      if(err.name !== "CanceledError"){
        setError(err.response.data.message);
      }
      setUpdateLoading(false);
    }
  }

  const fetchOrder = async() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      setFetchLoading(true);
      const {data} = await axios.get(`${server}/order/single/${route.params.id}`, {signal:abortControllerRef.current?.signal});
      if(data.success){
        setFetchLoading(false);
        setOrder(data.order);
      }
    } catch (err) {
      if(err.name !== "CanceledError"){
        setError(err.response.data.message);
      }
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
    return () => abortControllerRef.current?.abort();
  }, []);
  

  const copyTheValue = async(label, value) => {
    await Clipboard.setStringAsync(value);
    Alert.alert("Success", `${label} copied to clipboard`);
  }

  return (
    <View style={{...defaultStyle, backgroundColor:colors.color4}}>
      <Header back={true} />
      <View style={{marginTop:verticalScale(16), paddingTop:verticalScale(40)}}>
        <Text style={formHeading}>Order Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      {
        fetchLoading ? (
          <>
            <OrderShimmer />
            <OrderShimmer />
            <OrderShimmer />
          </>
        ) : (
          order?._id && <View style={styles.container}>
            {
              role === "admin" &&
              <View style={styles.cardView}>
                <TextView label='Ordered by' value={order.user.name} />
                <TextView onClickHandler={copyTheValue} label='Email' value={order.user.email} />
              </View>
            }
            <View style={styles.cardView}>
              <StatusWithArrow label='status' value={order.orderStatus}/>
              {(role === "admin" && order.orderStatus !== "Delivered") &&
                <ButtonDisable 
                  text={"Update"}
                  loading={updateLoading}
                  extraStyle={styles.updateBtn}
                  textColor={colors.color1}
                  handler={updateHandler}
                />
              }
              <View style={styles.otherInfoView}>
                <TextView label='Address' value={order.shippingInfo.address} />
                <TextView label='City' value={order.shippingInfo.city} />
                <TextView label='Country' value={order.shippingInfo.country} />
                <TextView label='Pin Code' value={order.shippingInfo.pinCode} />
                <TextView label='Phone' value={order.shippingInfo.phone} />
                <TextView label='Ordered On' value={order.createdAt.split("T")[0]} />
              </View>
            </View>

            <View style={styles.cardView}>
              <StatusWithArrow label='Payment Method' value={order.paymentMethod} />
              {order.paymentMethod === "ONLINE" &&
                <View style={styles.otherInfoView}>
                  <TextView label='payment id' value={order.paymentInfo.id} onClickHandler={copyTheValue}/>
                  <TextView label='payment status' value={order.paymentInfo.status}/>
                </View>
              }
            </View>

            <View style={styles.cardView}>
              {
                order.orderItems.map(item => (
                  <OrderItemCard key={item._id} name={item.name} price={item.price} quantity={item.quantity} image={item.image} productId={item.product} navigation={navigation} />
                ))
              }
            </View>

            <View style={styles.cardView}>
                <PriceTag heading={"Items Price"} price={order.itemsPrice}/>
                <PriceTag heading={"Tax"} price={order.tax}/>
                <PriceTag heading={"Shipping Charges"} price={order.shippingCharges}/>
                <View style={{borderBottomWidth:1, borderColor:colors.color1}} />
                <PriceTag heading={"Total Amount"} price={order.totalAmount}/>
            </View>
          </View>
        )
      }
      </ScrollView>
    </View>
  )
}

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

const OrderItemCard = ({name, price, quantity, image, productId, navigation}) => {
  return(
    <View style={styles.itemCard}>
      <Image source={{uri:image}} style={styles.cardImage}/>
      <View style={styles.cardInfoView}>
        <Text onPress={() => navigation.navigate("Productdetails", {id:productId})} style={styles.nameText}>{name}</Text>
        <Text style={styles.cardInfoText}>
          <Text>Price : </Text>
          ₹{price}
        </Text>
        <Text style={styles.cardInfoText}>
          <Text>Quantity : </Text>
          {quantity}
        </Text>
      </View>
    </View>
  )
}

const TextView = ({label="", value="", onClickHandler=()=>{}}) => {
  return (
    <View style={{
      margin:moderateScale(5),
      flexDirection:"row",
    }}>
      <Text style={{
        fontSize:moderateScale(16),
        fontWeight:'700',
        textTransform:"capitalize"
      }}>{label} : </Text>
      <Text 
        onPress={() => onClickHandler(label, value)}
        style={{
          fontSize:18
        }}
      >{value}</Text>
    </View>
  )
}

const StatusWithArrow = ({label="", value="", icon="greater-than"}) => {
  return(
    <View style={styles.arrowView}>
      <Text style={styles.txt}>{label}</Text>
      <Avatar.Icon icon={icon}color={colors.color1} size={moderateScale(30)} style={styles.avatar}/>
      <Text style={styles.arrowText}>{value}</Text>
    </View>
  )
}

export default OrderDetails;

const styles = StyleSheet.create({
  container:{
      marginTop:verticalScale(10),
      flex:1,
      alignItems:"center"
  },
  cardView:{
    marginBottom:verticalScale(10),
    backgroundColor:colors.color2,
    paddingHorizontal:scale(5),
    paddingVertical:verticalScale(10),
    width:"97%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius:moderateScale(5)
  },
  updateBtn:{
    borderWidth:1, 
    backgroundColor:colors.color2,
    borderColor:colors.color1,
    width:"45%",
    alignSelf:"center",
    marginVertical:verticalScale(10),
    padding:0
  },
  otherInfoView:{
    marginTop:verticalScale(5),
  },

  //StatusWith Arrow style starts here
  arrowView:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  txt:{
    fontSize:moderateScale(20),
    textTransform:"capitalize"
  },
  avatar:{
    backgroundColor:colors.color2,
    marginHorizontal:scale(2)
  },
  arrowText:{
    fontSize:moderateScale(20),
    textTransform:"uppercase",
    backgroundColor:colors.color1,
    color:colors.color2,
    paddingHorizontal:scale(5),
    borderRadius:3
  },
  //StatusWith Arrow style ends here

  //OrderItemCard style starts here
  itemCard:{
    flexDirection:"row",
    alignItems:"center",
    marginVertical:verticalScale(5),
    borderWidth:1,
    borderRadius:moderateScale(5),
    borderColor:colors.color3_light,
    padding:moderateScale(5)
  },
  cardImage:{
    width:scale(80),
    height:scale(80),
    resizeMode:"contain"
  },
  cardInfoView:{
    marginLeft:scale(60),
    height:scale(80),
    justifyContent:"space-between",
    padding:moderateScale(5)
  },
  nameText:{
    color:colors.color1, 
    fontSize:moderateScale(22),
    fontWeight:"600",
    textDecorationLine:"underline"
  },
  cardInfoText:{
    fontSize:moderateScale(16),
    color:colors.color3_light
  }

});