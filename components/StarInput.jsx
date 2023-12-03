import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Avatar } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../styles/styles';

const StarInput = ({
    onRatingChange,
    size=25, 
    defaultColor=colors.starDefault, 
    starCount = 5, 
    activeColor="#ffff00", 
    containerStyle={},
    disabled=false
}) => {
    const [rating, setRating] = useState(5);
    const generateColor = (index) => {
        return index <= rating ? activeColor : defaultColor;
    }
    const handleChange = (num) => {
        setRating(num);
        onRatingChange(num);
    }

    return(
        <View style={{...styles.starCont, ...containerStyle}}>
            {
                [...Array(starCount)].map((n, i) => (
                    <TouchableOpacity disabled={disabled} activeOpacity={0.9} key={i} onPress={()=>handleChange(i+1)}>
                        <Avatar.Icon 
                            icon={"star"} 
                            size={moderateScale(size)} 
                            color={generateColor(i+1)} 
                            style={{...styles.star, opacity:disabled ? 0.5 : 1}} />
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}

export default StarInput;

const styles = StyleSheet.create({
    starCont:{
        display:"flex",
        flexDirection:"row",
    },
    star:{
        margin:moderateScale(2),
        backgroundColor:"transparent",
    }
})