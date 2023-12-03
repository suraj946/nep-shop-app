import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../styles/styles';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Footer = ({activeRoute="Home"}) => {
  const avatarOptions = {
    color:colors.color2,
    style:{backgroundColor:colors.color1},
    size:moderateScale(40)
  }

  const navigate = useNavigation();
  const {loading, isAuthenticated} = useSelector(state => state.user);
  
  const navigationHandler = (key)=>{
    switch(key){
      case 0:
        navigate.navigate("Home");
        break;
      case 1:
        navigate.navigate("Cart");
        break;
      case 2:
        if(isAuthenticated) navigate.navigate("Profile");
        else navigate.navigate("Login");
        break;
      default:
        navigate.navigate("Home");
        break;
    }
  }
  return (
    (loading === false && <View style={styles.footerCont}>
      <View style={styles.tabCont}>
        <TouchableOpacity activeOpacity={0.8} onPress={()=>navigationHandler(1)}>
          <Avatar.Icon
            icon={activeRoute === "Cart" ? "shopping" : "shopping-outline"}
            {...avatarOptions}
          />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={()=>navigationHandler(2)}>
          <Avatar.Icon
            icon={isAuthenticated ? activeRoute === "Profile" ? "account" : "account-outline" : "login"}
            {...avatarOptions}
          />
        </TouchableOpacity>
      </View>
      <View style={{...styles.homeBtnCont, backgroundColor:colors.color2}}>
        <View style={{borderRadius:100, justifyContent:"center", alignItems:"center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={()=>navigationHandler(0)}>
            <Avatar.Icon
              icon={activeRoute === "Home" ? "home" : "home-outline"}
              {...avatarOptions}
              size={moderateScale(45)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>)
  )
}

export default Footer;

const styles = StyleSheet.create({
  footerCont:{
    backgroundColor:colors.color1,
    borderTopLeftRadius:moderateScale(120),
    borderTopRightRadius:moderateScale(120),
    position:"absolute",
    width:"100%",
    bottom:verticalScale(0)
  },
  tabCont:{
    flexDirection:"row",
    justifyContent:"space-around"
  },
  homeBtnCont:{
    width:scale(55),
    height:scale(55),
    borderRadius:moderateScale(100),
    position:"absolute",
    justifyContent:"center",
    alignItems:"center",
    top:verticalScale(-20),
    alignSelf:"center"
  }
});