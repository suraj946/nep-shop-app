import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { colors, defaultStyle, formHeading } from '../../styles/styles'
import Header from '../../components/Header'
import OrderItem from '../../components/OrderItem'
import { useGetOrders } from '../../utils/hook'
import { useState } from 'react'
import axios from 'axios'
import { server } from '../../redux/store'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import ChooseOrder from '../../components/ChooseOrder'
import { OrderShimmer } from '../../components/Shimmers'

const AdminOrders = ({route}) => {
  const [orders, setOrders] = useState([]);
  const [disable, setDisable] = useState(false);
  const [status, setStatus] = useState(route.params?.status || "All");
  const loading = useGetOrders(setOrders, status, true);

  const updateOrderHandler = useCallback(async(id, setProcessLoading)=>{
    try {
      setDisable(true);
      setProcessLoading(true);
      const {data} = await axios.put(`${server}/order/single/${id}`, {}, {
        withCredentials:true
      });
      setDisable(false);
      setProcessLoading(false);
      if(data.success){
        const orderIndex = orders.findIndex(i => i._id === id);
        if(orderIndex !== -1){
          const toUpdateOrders = [...orders];
          toUpdateOrders[orderIndex].orderStatus = data.updatedStatus;
          setOrders(toUpdateOrders);
        }
        Toast.show({ type:"success", text1:data.message });
      }
    } catch (error) {
      setDisable(false);
      setProcessLoading(false);
      Toast.show({ type:"error", text1:error.response.data.message });
    }
  }, []);

  return (
    <View style={{...defaultStyle, backgroundColor:colors.color5}}>
      <Header back={true}/>
      <View style={{paddingTop:verticalScale(25)}}>
        <Text style={formHeading}>Orders</Text>
      </View>

      <ChooseOrder status={status} buttonsArray={["All", "New", "Processing", "Shipped", "Delivered"] } onButtonChange={setStatus}/>

      {
        loading ? (
          <>
          <OrderShimmer />
          <OrderShimmer />
          <OrderShimmer />
          </>
        ):(
          <View style={{padding:moderateScale(8), flex:1}}>
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
                  admin={true}
                  disable={disable}
                  updateHandler={updateOrderHandler}
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

export default AdminOrders;

const styles = StyleSheet.create({
  noOrderView:{
    height:scale(500),
    justifyContent:"center",
    alignItems:"center"
  },
  noOrderText:{
    fontSize:moderateScale(30),
    color:colors.color3_light
  }
})