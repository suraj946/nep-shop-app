import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling, formStyles as styles, defaultImage} from '../styles/styles';
import Footer from "../components/Footer";
import { Avatar, Button, TextInput } from 'react-native-paper';
import ButtonDisable from '../components/ButtonDisable';
import mime from 'mime';
import { useDispatch } from 'react-redux';
import { useMessageErrUser } from '../utils/hook';
import { register } from '../redux/action/userAction';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const Signup = ({navigation, route}) => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [number, setNumber] = useState("");
  const dispatch = useDispatch();

  const disable = !name || !email || !password || !address || !city || !pinCode || !country || !number;  

  const loading = useMessageErrUser(navigation, dispatch, "Profile");

  const signUpHandler = ()=>{
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("pinCode", pinCode);
    formData.append("country", country);
    formData.append("phone", number);

    if(avatar !== ""){
      formData.append("file", {
        uri:avatar,
        type:mime.getType(avatar),
        name:avatar.split("/").pop()
      })
    }
    dispatch(register(formData));
  }

  useEffect(() => {
    if(route.params?.image) setAvatar(route.params.image)
  }, [route.params]);
  

  return (
    <>
    <View style={defaultStyle}>
      <View style={{marginBottom:verticalScale(10)}}>
        <Text style={formHeading}>Sign-Up</Text>
      </View>
      
      <ScrollView style={{
        backgroundColor:colors.color7,
        flex:1,
        padding:moderateScale(10),
        borderRadius:moderateScale(10),
        elevation:12
      }} showsVerticalScrollIndicator={false} >
        <View style={{minHeight:verticalScale(730)}}>
            <Avatar.Image style={{alignSelf:"center", backgroundColor:colors.color1}} 
                size={moderateScale(100)}
                source={avatar ? {uri:avatar} : defaultImage.avatar}
            />
            <TouchableOpacity onPress={()=>navigation.navigate("Camera", {signup:true})}>
                <Button textColor={colors.color1} style={{padding:moderateScale(5)}}>Change Photo</Button>
            </TouchableOpacity>

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Name'
                value={name}
                onChangeText={setName}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Email'
                keyboardType='email-address'
                value={email}
                onChangeText={setEmail}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Password'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Address'
                value={address}
                onChangeText={setAddress}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='City'
                value={city}
                onChangeText={setCity}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Pin Code'
                value={pinCode}
                onChangeText={setPinCode}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Country'
                value={country}
                onChangeText={setCountry}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Phone Number'
                keyboardType='phone-pad'
                value={number}
                onChangeText={setNumber}
                disabled={loading}
            />

            <ButtonDisable text={"Sign-UP"} loading={loading} disable={disable} handler={signUpHandler} />

            <Text style={styles.txt}>Already have an account?</Text>

            <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("Login")}>
            <Text style={{...styles.link, marginBottom:verticalScale(10)}}>login</Text>
            </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
    <Footer activeRoute='Profile' />
    </>
  )
}

export default Signup;