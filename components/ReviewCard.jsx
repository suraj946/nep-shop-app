import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useState } from 'react';
import { Avatar } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { colors } from '../styles/styles';
import Star from './Star';

const ReviewCard = ({
    userName, 
    userImage, 
    rating, 
    reviewText, 
    isAdmin=false, 
    reviewId=undefined, 
    productId=undefined, 
    disabled=false, 
    deleteHandler=()=>{}}
) => {
    const [loading, setLoading] = useState(false);
  return (
    <View style={styles.card}>
        <View style={styles.userInfoView}>
            <View style={styles.nameImgView}>
                <Avatar.Image source={{uri:userImage}} size={moderateScale(40)} />
                <Text style={styles.nameTxt}>{userName}</Text>
            </View>

            <View>
            {
                isAdmin && <View>
                    {loading ? (
                        <ActivityIndicator color={colors.color1} />
                    ):(
                        <TouchableOpacity activeOpacity={0.9} disabled={disabled} onPress={()=>deleteHandler(productId, reviewId, setLoading)}>
                            <Avatar.Icon icon={"delete"} size={30}
                                color={colors.color2}
                                style={{
                                    backgroundColor:disabled ? colors.btnDisable : colors.color1,
                                }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            }
            </View>
        </View>
        <Star rating={rating} activeColor={colors.color1}/>
        <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  )
}

export default memo(ReviewCard);

const styles = StyleSheet.create({
    card:{
        width:"100%",
        marginVertical:verticalScale(5),
    },
    userInfoView:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    nameImgView:{
        flexDirection:"row",
        alignItems:"center",
    },
    nameTxt:{
        fontSize:moderateScale(17),
        marginLeft:scale(10),
        color:colors.color3
    },
    reviewText:{
        fontSize:moderateScale(15),
        color:colors.color3_light,
        marginHorizontal:scale(5)
    },
});