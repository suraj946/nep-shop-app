import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling, formStyles as styles} from '../styles/styles';
import Footer from "../components/Footer";
import { TextInput } from 'react-native-paper';
import ButtonDisable from '../components/ButtonDisable';
import { useErrorMessage } from '../utils/hook';
import axios from 'axios';
import { server } from '../redux/store';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const Verify = ({navigation}) => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [counter, setCounter] = useState(30);
  const disable = !otp || !password;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const verifyHandler = async()=>{
    try {
      setLoading(true);
      const {data} = await axios.put(`${server}/user/resetpassword`, {otp, password}, {
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      });
      if(data.success){
        setLoading(false);
        setMessage(data.message);
        navigation.navigate("Login");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  useEffect(() => {
    if (counter > 0) {
      const interval = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
    }
  }, [counter]);

  useErrorMessage(error, message, setError, setMessage);
  

  return (
    <>
    <View style={defaultStyle}>
      <View style={{marginVertical:verticalScale(18)}}>
        <Text style={formHeading}>Reset Password</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={{flexDirection:"row", justifyContent:"center", marginBottom:verticalScale(20), alignItems:"center"}}>
          <Text style={{fontSize:moderateScale(20), fontStyle:"italic"}}>Click Resend in</Text>
          <Text style={{fontSize:moderateScale(20), fontWeight:"700"}}> : {counter} Sec</Text>
        </View>
        <TextInput 
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='OTP'
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          disabled={loading}
        />

        <TextInput 
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='New Password'
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          disabled={loading}
        />

        <ButtonDisable text={"Reset Password"} loading={loading} disable={disable} handler={verifyHandler} />

        <Text style={styles.txt}>or</Text>

        <TouchableOpacity activeOpacity={0.9} onPress={counter === 0 ? () => navigation.navigate("Forgetpassword") : null}>
          <Text style={styles.link}>Resend Otp</Text>
        </TouchableOpacity>

      </View>
      
    </View>
    <Footer activeRoute='Profile' />
    </>
  )
}

export default Verify;