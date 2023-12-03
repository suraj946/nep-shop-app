import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '../styles/styles';
import { moderateScale } from 'react-native-size-matters';

const Loader = ({style={}}) => {
  return (
    <ActivityIndicator size={moderateScale(60)} color={colors.color1}
        style={{
            position:"absolute",
            top:"50%",
            alignSelf:"center",
            ...style
        }}
    />
  )
}

export default Loader;

