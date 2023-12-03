import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { moderateScale } from 'react-native-size-matters';
import { verticalScale } from 'react-native-size-matters';
import { scale } from 'react-native-size-matters';
import { colors } from '../styles/styles';
import { Avatar } from 'react-native-paper';

const SearchByStock = ({state, setState}) => {
    const [stock, setStock] = useState(state);

    const getStyle = (num) => ({
        backgroundColor:(stock === num) ? colors.color1 : colors.color5,
        color:(stock === num) ? colors.color2 : "grey"
    });

    const onChangeStock = (stockStatus) => {
        setState(stockStatus);
        setStock(stockStatus);
    }

    return (
        <View style={{
            flexDirection:"row",
            flexWrap:"wrap",
            alignItems:"center"
        }}>
            {stock !== "" && 
                <TouchableOpacity style={styles.closeView} activeOpacity={0.9} onPress={() => onChangeStock("")}>
                    <Avatar.Icon icon={"close"} style={{backgroundColor:colors.color1}} size={35} color={colors.color2} />
                    <Text style={styles.text}>Clear</Text>    
                </TouchableOpacity>
            }
            <Text 
                style={{...styles.stockText, ...getStyle("0")}}
                onPress={() => onChangeStock("0")}
            >Out Of Stock</Text>
            <Text 
                style={{...styles.stockText, ...getStyle("5")}}
                onPress={() => onChangeStock("5")}
            >Less Than Five</Text>
        </View>
    )
}

export default SearchByStock

const styles = StyleSheet.create({
    stockText:{
        backgroundColor:colors.color5,
        color:"grey",
        fontSize:moderateScale(16),
        fontWeight:"bold",
        paddingVertical:verticalScale(5),
        paddingHorizontal:scale(8),
        borderRadius:moderateScale(20),
        margin:moderateScale(5)
    },
    closeView:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:colors.color1,
        paddingHorizontal:scale(8),
        borderRadius:moderateScale(20),
        margin:moderateScale(5)
    },
    text:{
        fontSize:moderateScale(16),
        fontWeight:"bold",
        color:colors.color2
    }
})