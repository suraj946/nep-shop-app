import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { colors, defaultStyle, formHeading } from '../../styles/styles';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Chart from '../../components/Chart';
import { ButtonBox } from '../Profile';
import { getAdminDetails } from '../../redux/action/productAction';
import { useDispatch, useSelector } from 'react-redux';
import {moderateScale, scale, verticalScale} from "react-native-size-matters";
import AdminInfoCard from '../../components/AdminInfoCard';

const AdminPanel = ({navigation}) => {
    const dispatch = useDispatch();
    const {loading, inStock, outOfStock, lessThanFive, newOrder} = useSelector(state => state.adminProduct);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getAdminDetails());
        setRefreshing(false);
    }, []);

    const navigationHandler = (text)=>{
        switch(text){
            case "Product":
                navigation.navigate("Addproduct");
                break;
            case "All Orders":
                navigation.navigate("Adminorders");
                break;
            case "Category":
                navigation.navigate("Category");
                break;
            case "Product List":
                navigation.navigate("Adminproductlist");
                break;
            default:
                console.log("In navigation of admin --> navigationHandler --> switch default");
                break;
        }
    }

    useEffect(() => {
        dispatch(getAdminDetails());
    }, []);

  return (
    <View style={defaultStyle}>
      <Header back={true} />
      <View style={{marginVertical:verticalScale(10), paddingTop:verticalScale(45)}}>
        <Text style={formHeading}>Admin Panel</Text>
      </View>
      {
        loading ? <Loader />:(
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.chartCont}>
                    <Chart outOfStock={outOfStock || 0} inStock={inStock || 0}/>
                </View>

                <View>
                    <View style={styles.actionCont}>
                        <ButtonBox icon={"plus"} text={"Product"} handler={navigationHandler} />
                        <ButtonBox icon={"format-list-bulleted-square"} text={"All Orders"} handler={navigationHandler} reverse={true} />
                        <ButtonBox icon={"plus"} text={"Category"} handler={navigationHandler} />
                    </View>
                    <View style={styles.actionCont}>
                        <ButtonBox icon={"menu"} text={"Product List"} handler={navigationHandler} />
                    </View>
                </View>

                <View>
                    <Text style={styles.reportText}>Report</Text>
                    <AdminInfoCard 
                        icon={"bell"} 
                        text='new order' 
                        value={newOrder} 
                        handler={() => {navigation.navigate("Adminorders", {status:"New"})}}
                    />
                    <AdminInfoCard 
                        icon={"alert"} 
                        text='out of stock' 
                        value={outOfStock} 
                        bgColor={colors.cDanger_light} 
                        elemColor={colors.cDanger} 
                        handler={() => {navigation.navigate("Adminproductlist", {stockState:"0"})}}
                    />
                    <AdminInfoCard 
                        icon={"alert"} 
                        text='stock less than 5' 
                        value={lessThanFive} 
                        bgColor={colors.cDanger_light} 
                        elemColor={colors.cDanger} 
                        handler={() => {navigation.navigate("Adminproductlist", {stockState:"5"})}}
                    />
                </View>
            </ScrollView>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
    chartCont:{
        backgroundColor:colors.color7,
        borderRadius:10,
        padding:moderateScale(15),
        alignItems:"center",
        justifyContent:"center",
        marginBottom:verticalScale(5)
    },
    actionCont:{
        flexDirection:"row",
        marginHorizontal:scale(10),
        marginVertical:verticalScale(5),
        justifyContent:"space-around",
    },
    reportText:{
        marginTop:verticalScale(10),
        fontSize:moderateScale(25),
        alignSelf:"center",
        borderBottomWidth:1.5,
        padding:moderateScale(3),
        color:colors.color3_light
    }
});

export default AdminPanel;