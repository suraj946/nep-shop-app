import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, defaultImage, defaultStyle, formHeading } from '../styles/styles';
import { Avatar, Button } from 'react-native-paper';
import Footer from '../components/Footer';
import Loader from '../components/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/userAction';
import {useMessageErrOther, useMessageErrUser} from "../utils/hook";
import mime from "mime";
import { updateProfilePic } from '../redux/action/otherAction';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Profile = ({navigation, route}) => {
    const dispatch = useDispatch();
    const loading = useMessageErrUser(navigation, dispatch, "Login");
    const loadingPic = useMessageErrOther(dispatch);
    const {user} = useSelector(state => state.user);
    const [avatar, setAvatar] = useState(user?.avatar ? user.avatar.url : defaultImage.avatar);
    const logoutHandler = ()=>{
        dispatch(logout());
    }
    const navigateHandler = (text)=>{
        switch(text){
            case "Dashboard":
                navigation.navigate("Adminpanel");
                break;
            case "Orders":
                navigation.navigate("Orders");
                break;
            case "Profile":
                navigation.navigate("Updateprofile");
                break;
            case "Password":
                navigation.navigate("Updatepassword");
                break;
            case "Logout":
                logoutHandler();
                break;
            default:
                console.log(text);
                break;
        }   
    }

    useEffect(() => {
        if(route.params?.image){
            setAvatar(route.params.image);
            const myForm = new FormData();
            myForm.append("file", {
                uri:route.params.image,
                type:mime.getType(route.params.image),
                name:route.params.image.split("/").pop()
            });
            dispatch(updateProfilePic(myForm, updateStore));
        }
    }, [route.params]);

    const updateStore = (avatarInfo) => {
        dispatch({type:"loadUserSuccess", payload:{...user, avatar : avatarInfo}})
    }

  return (
    <>
    <View style={defaultStyle}>
      <View style={{marginVertical:verticalScale(17)}}>
        <Text style={formHeading}>Profile</Text>
      </View>

      {
        loading ? <Loader /> :
        <>
        <View style={styles.profileCont}>
            <Avatar.Image source={typeof avatar === "string" ? {uri:avatar} : avatar} size={moderateScale(100)} style={{backgroundColor:colors.color1}} />
            <TouchableOpacity disabled={loadingPic} activeOpacity={0.6} onPress={()=>navigation.navigate("Camera", {updateProfile:true})}>
                <Button disabled={loadingPic} loading={loadingPic} textColor={colors.color1} style={{padding:moderateScale(5)}}>Change Photo</Button>
            </TouchableOpacity>
            <Text style={styles.nameText}>{user?.name}</Text>
            <Text style={{fontWeight:"300"}}>{user?.email}</Text>
        </View>

        <View>
            <View style={{...styles.btnCont, justifyContent:"space-evenly"}}>
                <ButtonBox handler={navigateHandler} text={"Orders"} icon={"format-list-bulleted-square"} />
                {
                    user?.role === "admin" && <View style={{marginHorizontal:scale(33)}}>
                        <ButtonBox handler={navigateHandler} text={"Dashboard"} icon={"view-dashboard"} reverse={true} />
                    </View>
                }
                <ButtonBox handler={navigateHandler} text={"Profile"} icon={"pencil"} />
            </View>

            <View style={{...styles.btnCont, justifyContent:"space-evenly"}}>
                <ButtonBox handler={navigateHandler} text={"Password"} icon={"pencil"} />
                <ButtonBox handler={navigateHandler} text={"Logout"} icon={"exit-to-app"} />
            </View>
        </View>
        </>
      }

    </View>
    <Footer activeRoute='Profile'/>
    </>
  )
}

export const ButtonBox = ({
    icon, text, handler, reverse=false, loading=false
})=>{
    return(
        <TouchableOpacity 
            style={{
                backgroundColor:reverse ? colors.color1 : colors.color3_light,
                width:scale(74),
                height:scale(74),
                borderRadius:moderateScale(17),
                alignItems:"center",
            }} 
            onPress={()=>handler(text)} 
            disabled={loading}
            activeOpacity={1}
        >
            <Avatar.Icon 
                size={moderateScale(50)}
                icon={icon}
                style={{backgroundColor:reverse ? colors.color1:colors.color3_light}}
                color={colors.color2}
            />
            <Text style={{color:colors.color2}}>{text}</Text>
        </TouchableOpacity>
    )
}

export default Profile;

const styles = StyleSheet.create({
    profileCont:{
        backgroundColor:colors.color7,
        borderRadius:moderateScale(10),
        padding:moderateScale(15),
        elevation:10,
        alignItems:"center"
    },
    nameText:{
        color:colors.color3,
        fontSize:moderateScale(28),
        fontWeight:"500",
    },
    btnCont:{
        flexDirection:"row",
        marginVertical:verticalScale(15),
        marginHorizontal:scale(7)
    }
});