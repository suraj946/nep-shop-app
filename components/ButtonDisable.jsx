import React from "react";
import { colors, formStyles as styles } from "../styles/styles";
import { Button } from "react-native-paper";

const ButtonDisable = ({ loading=false, disable=false, handler, text="", extraStyle = {}, textColor = colors.color2 }) => {
  return (
    <Button
      style={{...styles.btn, ...extraStyle}}
      textColor={loading || disable ? colors.btnDisable : textColor}
      loading={loading}
      onPress={loading || disable ? null : handler}
    >
      {text}
    </Button>
  );
};

export default ButtonDisable;
