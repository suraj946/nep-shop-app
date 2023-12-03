import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../styles/styles';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Avatar } from 'react-native-paper';

const AdminInfoCard = ({
    icon,
    text="",
    value=0,
    bgColor=colors.blue_light,
    elemColor=colors.blueCol,
    handler=()=>{}
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handler}>
        <View style={{...styles.card, backgroundColor:bgColor, borderColor:elemColor}}>
            <Avatar.Icon color={elemColor} icon={icon} size={60} style={{
                backgroundColor:bgColor,
            }} />
            <View style={styles.textViews}>
                <Text style={{
                    fontSize:moderateScale(18),
                    color:elemColor,
                    textTransform:"uppercase"
                }}>{text}</Text>
                <Text style={{
                    fontSize:moderateScale(22),
                    color:elemColor
                }}>{value}</Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default AdminInfoCard;

const styles = StyleSheet.create({
    card:{
        marginVertical:verticalScale(5),
        marginHorizontal:scale(5),
        flexDirection:"row",
        alignItems:"center",
        padding:moderateScale(5),
        borderRadius:moderateScale(5),
        borderWidth:1,
    },
    textViews:{
        flex:1,
        marginHorizontal:scale(10),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    }
});