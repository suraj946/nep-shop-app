import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Checkbox } from "react-native-paper";
import { colors } from "../styles/styles";
import { moderateScale } from "react-native-size-matters";

const CheckBox = ({loading, isChecked, setIsChecked, label}) => {
  return (
    <View style={styles.checkBoxCont}>
      <Checkbox
        status={isChecked ? "checked" : "unchecked"}
        onPress={() => setIsChecked(!isChecked)}
        disabled={loading}
        color={loading ? colors.btnDisable : colors.color1}
        uncheckedColor={colors.color3}
      />
      <Text style={{...styles.label, color:isChecked ? colors.color1 : colors.color3}}>{label}</Text>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
    checkBoxCont:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    },
    label:{
        textTransform:"uppercase",
        fontSize:moderateScale(15)
    }
});
