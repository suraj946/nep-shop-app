import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { Avatar, Button } from "react-native-paper";
import { colors } from "../styles/styles";
import { moderateScale, verticalScale } from "react-native-size-matters";

const SearchByCategory = ({
  categories,
  category,
  setCategory,
  gotoFunc = null,
  style = {},
}) => {
  const handleClick = (id) => {
    setCategory && setCategory(id);
    gotoFunc && gotoFunc(id);
  };
  return (
    <View style={{ ...styles.categoryCont, ...style }}>
      <ScrollView
        horizontal
        contentContainerStyle={{ alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
      >
        {category && (
          <TouchableOpacity
            style={styles.closeIconCont}
            activeOpacity={0.8}
            onPress={() => setCategory("")}
          >
            <Avatar.Icon
              icon={"close"}
              size={moderateScale(30)}
              color={colors.color2}
              style={styles.closeIcon}
            />
            <Text style={{ color: colors.color2, fontSize: moderateScale(18) }}>
              {categories.filter((cat) => cat._id === category)[0].name}
            </Text>
          </TouchableOpacity>
        )}
        {categories &&
          categories.map((item) => (
            <Button
              key={item._id}
              style={{
                backgroundColor:
                  category === item._id ? colors.color1 : colors.color5,
                borderRadius: moderateScale(100),
                margin: moderateScale(5),
              }}
              onPress={() => handleClick(item._id)}
            >
              <Text
                style={{
                  fontSize: moderateScale(17),
                  color: category === item._id ? colors.color2 : "grey",
                }}
              >
                {item.name}
              </Text>
            </Button>
          ))}
      </ScrollView>
    </View>
  );
};

export default memo(SearchByCategory);

const styles = StyleSheet.create({
  categoryCont: {
    marginTop: verticalScale(4),
    flexDirection: "row",
    height: verticalScale(50),
  },
  closeIconCont: {
    backgroundColor: colors.color1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(1),
    paddingRight: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  closeIcon: {
    backgroundColor: colors.color1,
  },
});
