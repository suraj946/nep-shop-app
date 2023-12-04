import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling, formStyles as styles} from '../styles/styles';
import { TextInput } from 'react-native-paper';
import Header from '../components/Header';
import ButtonDisable from '../components/ButtonDisable';
import {useDispatch} from "react-redux";
import {useMessageErrOther} from "../utils/hook";
import { changePassword } from '../redux/action/otherAction';
import { verticalScale } from 'react-native-size-matters';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const disable = !oldPassword || !newPassword;
  const dispatch = useDispatch();
  const loading = useMessageErrOther(dispatch);

  const changePasswordHandler = ()=>{
    dispatch(changePassword(oldPassword, newPassword));
    setOldPassword("");
    setNewPassword("");
  }

  return (
    <View style={defaultStyle}>
      <Header back={true} />
      <View style={{paddingVertical:verticalScale(25)}}>
        <Text style={formHeading}>Change Password</Text>
      </View>
      <View style={{...styles.formContainer, flex:0.8}}>
        <TextInput 
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='Old Password'
          secureTextEntry={true}
          value={oldPassword}
          onChangeText={setOldPassword}
          disabled={loading}
        />

        <TextInput 
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='New Password'
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
          disabled={loading}
        />
        <ButtonDisable text={"Change Password"} loading={loading} disable={disable} handler={changePasswordHandler} />
      </View>
      
    </View>
  )
}

export default UpdatePassword;