import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../styles/styles';

const Star = ({
    rating, 
    size=25, 
    defaultColor=colors.starDefault, 
    starCount = 5, 
    activeColor="#ffff00", 
    containerStyle={}
}) => {
    const generateColor = (index) => {
        return index <= rating ? activeColor : defaultColor;
    }
    return(
        <View style={{...styles.starCont, ...containerStyle}}>
            {
                [...Array(starCount)].map((n, i) => (
                    <Avatar.Icon key={i} icon={"star"} size={moderateScale(size)} color={generateColor(i+1)} style={styles.star} />
                ))
            }
        </View>
    )
}

export default Star

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