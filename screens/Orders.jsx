import { ScrollView, StyleSheet, Text, View } from 'react-native';;
import React from 'react';
import { colors, defaultStyle, formHeading } from '../styles/styles';
import Header from '../components/Header';
import OrderItem from '../components/OrderItem';
import { useGetOrders } from '../utils/hook';
import { useState } from 'react';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ChooseOrder from '../components/ChooseOrder';
import {OrderShimmer} from "../components/Shimmers";

const Orders = ({route}) => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(route.params?.status || "All");
  const loading = useGetOrders(setOrders, status);

  return (
    <View style={{...defaultStyle, backgroundColor:colors.color5}}>
      <Header back={true}/>
      <View style={{paddingTop:verticalScale(25)}}>
        <Text style={formHeading}>Orders</Text>
      </View>
      <ChooseOrder status={status} buttonsArray={["All", "Processing", "Shipped", "Delivered"]} onButtonChange={setStatus}/>
      {
        loading ? (
          <>
          <OrderShimmer />
          <OrderShimmer />
          <OrderShimmer />
          </>
        ):(
          <View style={{padding:moderateScale(10), flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {
              orders.length > 0 ? orders.map((item, index)=>(
                <OrderItem  
                  key={item._id}
                  i={index}
                  id={item._id}
                  price={item.totalAmount}
                  address={item.shippingInfo}
                  createdAt={item.createdAt.split("T")[0]}
                  status={item.orderStatus}
                  paymentMethod={item.paymentMethod}
                />
              )) : (
                <View style={styles.noOrderView}>
                  <Text style={styles.noOrderText}>No Orders Yet</Text>
                </View>
              )
            }
            </ScrollView>
          </View>
        )
      }
    </View>
  )
}

export default Orders;

const styles = StyleSheet.create({
  noOrderView:{
    height:verticalScale(500),
    justifyContent:"center",
    alignItems:"center"
  },
  noOrderText:{
    fontSize:moderateScale(35),
    color:colors.color3_light,
  }
})
