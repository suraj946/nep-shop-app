import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "../styles/styles";

const ChooseOrder = ({ buttonsArray = [], onButtonChange, status = "All" }) => {
  const [selectedBtn, setSelectedBtn] = useState(status);

  const handleClick = (button) => {
    setSelectedBtn(button);
    onButtonChange(button);
  };
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {buttonsArray.map((button) => (
          <Button
            key={button}
            style={{
              backgroundColor:
                button === selectedBtn ? colors.color1 : colors.color5,
              borderRadius: moderateScale(100),
              margin: moderateScale(5),
              borderWidth:1,
              borderColor:colors.color1
            }}
            onPress={() => handleClick(button)}
          >
            <Text
              style={{
                fontSize: moderateScale(17),
                color: button === selectedBtn ? colors.color2 : "grey",
                textTransform: "capitalize",
              }}
            >
              {button}
            </Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
}

export default ChooseOrder;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(5),
    flexDirection: "row",
  },
});
