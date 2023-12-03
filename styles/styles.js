import {StyleSheet, Platform, StatusBar} from "react-native";
import {moderateScale, scale, verticalScale} from "react-native-size-matters";

export const colors = {
    color1 : "#ff0040",
    color1_light : "#f53d6b",
    color1_light2 : "#fa5f86",
    color2:"white",
    color3:"rgb(45,45,45)",
    color3_light:"rgb(98, 98, 98)",
    color4:"transparent",
    color5:"#f2f2f2",
    color6:"#f7f7f7",
    color7:"#b5b3b3",
    btnDisable:"#a3a3a3",
    cDanger:"#dc3545",
    cDanger_light:"#fcb8be",
    cSuccess:"#039122",
    starDefault:"#c2c2c2",
    shimmerColor:"#c2c0c0",
    shimmerColorDark:"#a1a1a1",
    blue_light:"#a5c6fa",
    blueCol:"#0a67fa"
}

export const defaultStyle = StyleSheet.create({
    padding:moderateScale(5),
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: colors.color2
});

export const inputStyling = StyleSheet.create({
    height:scale(40),
    backgroundColor: colors.color2,
    marginVertical:verticalScale(7),
    marginHorizontal:scale(3),
});

export const formHeading = {
    backgroundColor:colors.color1,
    padding:moderateScale(5),
    fontSize:moderateScale(22),
    borderRadius:moderateScale(5),
    color:colors.color2,
    textAlign:"center",
    fontWeight:"600"
}

export const formStyles = StyleSheet.create({
    formContainer:{
        flex:1,
        backgroundColor:colors.color7,
        padding:moderateScale(8),
        borderRadius:moderateScale(8),
        justifyContent:"center",
        elevation:12
    },
    forgetTxt:{
        alignSelf:"flex-end",
        marginVertical:verticalScale(8),
        marginHorizontal:scale(15),
        fontSize:moderateScale(16),
        color:colors.color3,
        fontWeight:"500"
    },
    btn:{
        backgroundColor:colors.color1,
        borderRadius:moderateScale(80),
        padding:moderateScale(4),
        margin:moderateScale(18),
    },
    txt:{
        alignSelf:"center",
        fontSize:moderateScale(18),
        fontWeight:"400",
        color:colors.color3,
        textTransform:"uppercase"
    },
    link:{
        alignSelf:"center",
        fontSize:moderateScale(21),
        marginVertical:verticalScale(10),
        marginHorizontal:scale(18),
        color:colors.color1,
        textTransform:"uppercase"
    }
});

export const defaultImage = {
    avatar:require("../assets/defaultAvatar.jpg")
}

