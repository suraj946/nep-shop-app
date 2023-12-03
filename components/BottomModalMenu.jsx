import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { verticalScale } from 'react-native-size-matters';
import { moderateScale } from 'react-native-size-matters';
import { scale } from 'react-native-size-matters';
import { colors } from '../styles/styles';

const BottomModalMenu = ({children, title="", visible=false, setVisible}) => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={()=>{
            setVisible(false);
        }}
    >   
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.menuItemContainer}>
            <View style={styles.titleView}>
                <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
            </View>

            {children}
        </View>
    </Modal>
  )
}

export default BottomModalMenu;

const styles = StyleSheet.create({
    overlay:{
        flex:1, 
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        justifyContent:"center", 
        alignItems:"center"
    },
    menuItemContainer:{
        position:"absolute",
        bottom:verticalScale(0),
        backgroundColor:colors.color2,
        width:"100%",
        alignSelf:"center",
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
    },
    titleView:{
        width:"100%",
        backgroundColor:colors.color1,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        padding:moderateScale(5),
        paddingHorizontal:scale(20),
        justifyContent:"center",
        alignItems:"center"
    },
    titleText:{
        fontSize:moderateScale(17),
        color:colors.color2
    }
});