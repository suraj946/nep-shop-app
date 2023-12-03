import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import {colors} from "../styles/styles";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Avatar, Button } from 'react-native-paper';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SelectCategory = ({visible, setVisible, setCategory, setCategoryID, categories = []}) => {
    const selectCategoryHandler = (i)=>{
        setCategory(i.name);
        setCategoryID(i._id);
        setVisible(false);
    }
  return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
        onRequestClose={()=>{
            setVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={()=> null}>
            <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>setVisible(false)}>
                <Avatar.Icon size={moderateScale(27)} icon={'close'} style={styles.closeIcon} />
            </TouchableOpacity>

            <View style={styles.messageView}>
                <Text numberOfLines={1} style={styles.title}>Select Category</Text>
            </View>

            <ScrollView style={styles.categoryList} contentContainerStyle={{alignItems:"center"}} showsVerticalScrollIndicator={false}>
                {
                    categories.map(i=>(
                        <Button textColor={colors.color2} onPress={()=>selectCategoryHandler(i)} key={i._id} style={styles.categoryBtn}>
                            {i.name}
                        </Button>
                    ))
                }
            </ScrollView>
        </View>
      </Modal>
  )
}

export default SelectCategory;

const styles = StyleSheet.create({
    overlay:{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container:{
        width:"85%",
        height:"40%",
        backgroundColor:colors.color2,
        position:"absolute",
        top:screenHeight/2 - screenWidth/2,
        alignSelf:"center",
        padding:moderateScale(10),
        borderRadius:moderateScale(10),
        elevation:20,
    },
    closeIcon:{
        backgroundColor:colors.color1,
        position:"absolute",
        right:scale(-15),
        top:verticalScale(-15)
    },
    messageView:{
        width:"90%",
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center"
    },
    title:{
        fontSize:moderateScale(25),
        fontWeight:"bold",
        color:colors.color1_light,
    },
    categoryList:{
        padding:moderateScale(15),
    },
    categoryBtn:{
        width:"80%",
        marginVertical:verticalScale(5),
        backgroundColor:colors.color1,
        fontSize:moderateScale(20),
    },
});