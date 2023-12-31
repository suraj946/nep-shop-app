import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Avatar, Button } from 'react-native-paper';
import { colors } from '../styles/styles';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import * as Linking from 'expo-linking';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  const handlePress = async() => {
    if(Platform.OS=='ios'){
      Linking.openURL('app-settings:')
    }
    else{
      startActivityAsync(
        ActivityAction.WIFI_SETTINGS
      );
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      {
        (!isConnected) && <View style={styles.container}>
            <Avatar.Icon icon={"wifi-off"} size={moderateScale(200)} color={colors.color1} style={styles.icon}/>
            <Text style={styles.noInternetText}>No Internet Connection</Text>
            <Button onPress={handlePress} textColor={colors.color2} style={styles.btn} >Setting</Button>
        </View>
      }
    </View>
  );
};

export default ConnectionStatus;

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:colors.color2,
        paddingTop:verticalScale(150),
        alignItems:"center"
    },
    icon:{
        backgroundColor:colors.color2
    },
    noInternetText:{
        fontSize:moderateScale(25),
        color:colors.color3_light
    },
    btn:{
        backgroundColor:colors.color1,
        width:"30%",
        marginTop:verticalScale(25)
    }
})
