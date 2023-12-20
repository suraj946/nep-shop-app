import { BackHandler, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../styles/styles';
import {Button, Headline, Searchbar} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const SearchModal = ({
    setModalOpen, searchQuery, setSearchQuery, searchedProduct, searchLoading=false
}) => {

    const navigate = useNavigation();
    const backHandler = ()=>{
        setSearchQuery("");
        setModalOpen(false);
        return true;
    }

    const handleClick = () => {
      navigate.navigate("Searchedproduct", {keyword : searchQuery, category:""});
    }

    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backHandler);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backHandler);
      }
    }, []);
    

  return (
    <View style={styles.modalCont}>
      <SafeAreaView>
        <Searchbar placeholder='Search...' onChangeText={(e)=>setSearchQuery(e)} value={searchQuery} style={{marginTop:verticalScale(8)}} />
        {
          searchLoading ? <Loader style={{top:"130%"}} /> :
          <View>
            {
              searchedProduct.length > 0 ?
              <Button onPress={handleClick} style={styles.seeAllBtn} textColor={colors.color2}>See All</Button> 
              :(
                <View style={styles.notFoundBox}>
                  <Text style={{fontSize:moderateScale(32), color:colors.color3_light}}>Nothing to show</Text>
                </View>
              )
            }
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{marginTop:verticalScale(15), paddingBottom:verticalScale(175)}}>
                {searchedProduct.map((item)=>(
                    <SearchItem key={item._id} name={item.name} price={item.price} imgSrc={item.images[0]?.url} handler={()=>navigate.navigate("Productdetails", {id:item._id})} />
                ))}
              </View>
            </ScrollView>
          </View>
        }
      </SafeAreaView>
    </View>
  )
}

const SearchItem = ({
    name, imgSrc, price, handler
})=>{
    return(
        <TouchableOpacity onPress={handler} style={{ marginVertical:verticalScale(15),paddingHorizontal:scale(10)}} activeOpacity={0.8}>
            <View style={styles.searchItemCont}>
              <Image source={{uri:imgSrc}} style={styles.searchItemImg} 
              />
              <View style={{paddingHorizontal:scale(30)}}>
                <Text numberOfLines={1}>{name}</Text>
                <Headline style={{fontWeight:"900"}} numberOfLines={1}>₹{price}</Headline>
              </View>
            </View>
        </TouchableOpacity>
    )
}

export default SearchModal;

const styles = StyleSheet.create({
  modalCont:{
    width:"100%",
    height:"100%",
    padding:moderateScale(5),
    paddingTop:Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor:colors.color2,
    zIndex:100
  },
  searchItemCont:{
    padding:moderateScale(10),
    backgroundColor:colors.color2,
    borderRadius:moderateScale(5),
    elevation:5,
    width:"100%",
    alignItems:"center",
    justifyContent:"flex-end",
    height:verticalScale(75),
    flexDirection:"row",
  },
  searchItemImg:{
    width:moderateScale(85),
    height:moderateScale(85),
    position:"absolute",
    resizeMode:"contain",
    top:verticalScale(-10),
    left:scale(0),
    borderTopLeftRadius:moderateScale(20),
    borderBottomRightRadius:moderateScale(20)
  },
  seeAllBtn:{
    backgroundColor:colors.color1,
    width:scale(90),
    alignSelf:"center",
    marginTop:verticalScale(15)
  },
  notFoundBox:{
    width:"100%",
    display:"flex",
    alignItems:"center",
    marginTop:verticalScale(140)
  }
});