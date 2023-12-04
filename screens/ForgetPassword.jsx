import { Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling, formStyles as styles} from '../styles/styles';
import Footer from "../components/Footer";
import { TextInput } from 'react-native-paper';
import ButtonDisable from '../components/ButtonDisable';
import axios from 'axios'
import {server} from '../redux/store';
import { useErrorMessage } from '../utils/hook';
import { verticalScale } from 'react-native-size-matters';

const ForgetPassword = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const disable = !email;
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const forgetPasswordHandler = async()=>{
    try {
      setLoading(true);
      const {data} = await axios.post(`${server}/user/forgotpassword`, {email}, {
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      });
      if(data.success){
        setLoading(false);
        setMessage(data.message);
        navigation.navigate("Verify");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  useErrorMessage(error, message, setError, setMessage);

  return (
    <>
    <View style={defaultStyle}>
      <View style={{marginBottom:verticalScale(10)}}>
        <Text style={formHeading}>Forget Password</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput 
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='Email'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
          disabled={loading}
        />

        <ButtonDisable loading={loading} disable={disable} handler={forgetPasswordHandler} text={"Send OTP"} />

        <Text style={styles.txt}>or</Text>

        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>login</Text>
        </TouchableOpacity>

      </View>
      
    </View>
    <Footer activeRoute='Profile' />
    </>
  )
}

export default ForgetPassword;