import { Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling, formStyles as styles} from '../styles/styles';
import Footer from "../components/Footer";
import { TextInput } from 'react-native-paper';
import ButtonDisable from '../components/ButtonDisable';
import {useDispatch} from "react-redux";
import { login } from '../redux/action/userAction';
import { useMessageErrUser } from '../utils/hook';
import { moderateScale } from 'react-native-size-matters';

const Login = ({navigation, route}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const disable = !password || !email;
  const dispatch = useDispatch();

  const loading = useMessageErrUser(navigation, dispatch, route.params?.path, route.params?.data);

  const loginHandler = ()=>{
    dispatch(login(email, password));
  }
  
  return (
    <>
    <View style={defaultStyle}>
      <View style={{marginVertical:moderateScale(18)}}>
        <Text style={formHeading}>Login</Text>
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
        <TextInput 
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='Password'
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          disabled={loading}
        />

        <TouchableOpacity activeOpacity={0.9} onPress={()=>navigation.navigate("Forgetpassword")}>
          <Text style={styles.forgetTxt}>Forget Password?</Text>
        </TouchableOpacity>

        <ButtonDisable loading={loading} disable={disable} handler={loginHandler} text={"Sign-In"} />

        <Text style={styles.txt}>New Here?</Text>

        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>sign up</Text>
        </TouchableOpacity>

      </View>
      
    </View>
    <Footer activeRoute='Profile' />
    </>
  )
}

export default Login;