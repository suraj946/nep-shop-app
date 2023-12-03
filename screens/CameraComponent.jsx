import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Avatar, Button } from 'react-native-paper';
import { colors, defaultStyle } from '../styles/styles';
import * as ImagePicker from "expo-image-picker";
import { moderateScale, verticalScale } from 'react-native-size-matters';

const {width} = Dimensions.get("window")

const CameraComponent = ({navigation, route}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [camera, setCamera] = useState(null);

    const sendImageToCaller = (img)=>{
        if(route.params?.updateProfile){
            return navigation.navigate("Profile", {image:img});
        }

        if(route.params?.signup){
            return navigation.navigate("Signup", {image:img});
        }

        if(route.params?.addProduct){
            return navigation.navigate("Addproduct", {image:img});
        }

        if(route.params?.updateImage){
            return navigation.navigate("Managesimages", {image:img});
        }
    }

    const openImagePicker = async()=>{
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(permissionResult.granted === false){
            return alert("Permission to access gallery is required");
        }
        const data = await ImagePicker.launchImageLibraryAsync({
            allowsEditing:true,
            aspect:[1,1],
            quality:1
        });
        if(data.canceled){
            return;
        }
        sendImageToCaller(data.assets[0].uri);
    }

    const clickPicture = async()=>{
        const data = await camera.takePictureAsync();
        sendImageToCaller(data.uri);
    }

    const changeCameraType = ()=>{
        setType(prevType => prevType === CameraType.back ? CameraType.front : CameraType.back);
    }

    const getCameraPermission = async()=>{
        const {status} = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
    }

    useEffect(() => {
      getCameraPermission();
    }, []);

    if(hasPermission === null) return <View />
    if(hasPermission === false) return(
        <View style={{...defaultStyle, flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text style={{lineHeight:verticalScale(40), fontSize:moderateScale(30)}}>No access to the camera</Text>
            <Text style={{fontSize:moderateScale(18), color:colors.color3_light, margin:moderateScale(5)}}>Please give permission to access camera</Text>
            <Button style={{margin:moderateScale(10)}} textColor={colors.color1} onPress={getCameraPermission}>Give Permission</Button>
        </View>
    )
    
  return (
    <View style={styles.cameraCont}>
      <Camera type={type} style={styles.cameraStyle} ratio='1:1' ref={(e)=>setCamera(e)} />
      <View style={styles.cameraActionCont}>
        <MyIcon icon={"image"} handler={openImagePicker} />
        <MyIcon icon={"camera"} handler={clickPicture} isMain={true} />
        <MyIcon icon={"camera-flip"} handler={changeCameraType} />
      </View>
    </View>
  )
}

const MyIcon = ({icon, handler, isMain = false})=>(
    <TouchableOpacity activeOpacity={0.8} onPress={handler}>
        <Avatar.Icon icon={icon} size={isMain ? moderateScale(75) : moderateScale(45)} style={{backgroundColor:colors.color1}} color={colors.color2} />
    </TouchableOpacity>
)

export default CameraComponent;

const styles = StyleSheet.create({
    cameraCont:{
        flex:1
    },
    cameraStyle:{
        marginTop:verticalScale(160),
        width:width,
        height:width,
        aspectRatio:1,
    },
    cameraActionCont:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        bottom:verticalScale(28),
        position:"absolute"
    }
});