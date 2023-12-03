import { Text, View } from 'react-native';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

const Heading = ({text1, text2, containerStyle}) => {
  return (
    <View style={containerStyle}>
      <Text style={{fontSize:moderateScale(23)}}>{text1}</Text>
      <Text style={{fontSize:moderateScale(23), fontWeight:"900"}}>{text2}</Text>
    </View>
  )
}

export default Heading;
