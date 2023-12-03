import { ScrollView, Text, View } from 'react-native';
import React, { useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling} from '../styles/styles';
import { TextInput } from 'react-native-paper';
import Header from "../components/Header";
import ButtonDisable from '../components/ButtonDisable';
import {useDispatch, useSelector} from "react-redux";
import { updateProfile } from '../redux/action/otherAction';
import { useMessageErrOther } from '../utils/hook';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const UpdateProfile = ({navigation}) => {
  const {user} = useSelector(state => state.user);
  const [initialState, setInitialState] = useState({
    name:user?.name,
    email:user?.email,
    address:user?.address,
    city:user?.city,
    pinCode:user?.pinCode,
    country:user?.country,
    phone:user?.phone,
  });
  const [updatedState, setUpdatedState] = useState({
    name:user?.name,
    email:user?.email,
    address:user?.address,
    city:user?.city,
    pinCode:user?.pinCode,
    country:user?.country,
    phone:user?.phone,
  });
  const dispatch = useDispatch();

  const loading = useMessageErrOther(dispatch, navigation, "Profile");

  const onTextChange = (key, val) => {
    setUpdatedState({...updatedState,[key]:val});
  }

  const updateProfileHandler = ()=>{
    const dataToUpdate = {};
    for (const key in initialState){
      if(initialState[key] !== updatedState[key]){
        dataToUpdate[key] = updatedState[key];
      }
    }
    dispatch(updateProfile(dataToUpdate, updateStore));
  }

  const updateStore = (updatedField) => {
    dispatch({type:"loadUserSuccess", payload:{...user, ...updatedField}});
  }

  return (
    <View style={defaultStyle}>
      <Header back={true} />

      <View style={{marginVertical:verticalScale(16), paddingTop:verticalScale(40)}}>
        <Text style={formHeading}>Edit Profile</Text>
      </View>
      
      <View style={{
        backgroundColor:colors.color7,
        padding:moderateScale(9),
        borderRadius:moderateScale(10),
        elevation:12
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Name'
                value={updatedState.name}
                onChangeText={(text)=>onTextChange("name", text)}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Email'
                keyboardType='email-address'
                value={updatedState.email}
                onChangeText={(text)=>onTextChange("email", text)}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Address'
                value={updatedState.address}
                onChangeText={(text)=>onTextChange("address", text)}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='City'
                value={updatedState.city}
                onChangeText={(text)=>onTextChange("city", text)}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Pin Code'
                value={updatedState.pinCode}
                onChangeText={(text)=>onTextChange("pinCode", text)}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Country'
                value={updatedState.country}
                onChangeText={(text)=>onTextChange("country", text)}
                disabled={loading}
            />

            <TextInput 
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder='Phone number'
                keyboardType='phone-pad'
                value={updatedState.phone}
                onChangeText={(text)=>onTextChange("phone", text)}
                disabled={loading}
            />
            <ButtonDisable text={"Update"} loading={loading} handler={updateProfileHandler}/>
        </ScrollView>
      </View>
    </View>
  )
}

export default UpdateProfile;
