import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  colors,
  defaultImage,
  defaultStyle,
  formHeading,
  inputStyling,
} from "../../styles/styles";
import Header from "../../components/Header";
import { Avatar, Button, TextInput } from "react-native-paper";
import ButtonDisable from "../../components/ButtonDisable";
import SelectCategory from "../../components/SelectCategory";
import { useSelector } from "react-redux";
import mime from "mime";
import axios from "axios";
import {server} from "../../redux/store";
import { useErrorMessage } from "../../utils/hook";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CheckBox from "../../components/CheckBox";

const AddProduct = ({ navigation, route }) => {
  const {categories} = useSelector(state => state.product);
  const [visible, setVisible] = useState(false);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState("Select Category");
  const [categoryID, setCategoryID] = useState(undefined);

  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const disable =
    !name || !description || !price || !stock  || !image;

  const removeCategoryHandler = () => {
    setCategoryID(null);
    setCategory("Select Category");
  }

  const createProductHandler = async() => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("discount", discount);
    formData.append("isFeatured", isFeatured);
    formData.append("file", {
      uri:image,
      type:mime.getType(image),
      name:image.split("/").pop()
    });
    if(categoryID){
      formData.append("category", categoryID);
    }

    try {
      setCreateLoading(true);
      const {data} = await axios.post(`${server}/product/new`, formData, {
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true
      });
      if(data.success){
        setCreateLoading(false);
        setMessage(data.message);
        navigation.goBack()
      }
    } catch (err) {
      setError(err.response.data.message);
      setCreateLoading(false);
    }
  };

  useErrorMessage(error, message, setError, setMessage);

  useEffect(() => {
    if(route.params?.image) setImage(route.params.image)
  }, [route.params]);

  return (
    <>
      <View style={defaultStyle}>
        <Header back={true} />
        <View style={{ paddingBottom: verticalScale(10), paddingTop: verticalScale(25) }}>
          <Text style={formHeading}>New Product</Text>
        </View>

        <ScrollView
          style={styles.updateFormCont}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerBox}>
            <View style={styles.imgCont}>
              <Avatar.Image
                size={moderateScale(100)}
                style={{ backgroundColor: colors.color1 }}
                source={image ? { uri: image } :defaultImage.avatar }
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={createLoading ? null : () => navigation.navigate("Camera", { addProduct: true })}
              >
                <Avatar.Icon
                  icon={"camera"}
                  size={moderateScale(27)}
                  color={colors.color3}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={inputStyling}
              activeUnderlineColor={colors.color1}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              disabled={createLoading}
            />
            <TextInput
              style={inputStyling}
              activeUnderlineColor={colors.color1}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              disabled={createLoading}
            />
            <TextInput
              style={inputStyling}
              activeUnderlineColor={colors.color1}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              disabled={createLoading}
            />
            <TextInput
              style={inputStyling}
              activeUnderlineColor={colors.color1}
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="number-pad"
              disabled={createLoading}
            />
            <TextInput
              style={inputStyling}
              activeUnderlineColor={colors.color1}
              placeholder="Discount"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="number-pad"
              disabled={createLoading}
            />
            <CheckBox isChecked={isFeatured} setIsChecked={setIsFeatured} loading={createLoading} label={"featured product"} />
            <Text
              style={{
                ...inputStyling,
                textAlign: "center",
                textAlignVertical: "center",
                borderRadius: 4,
                color: createLoading ? colors.btnDisable : null,
              }}
              onPress={createLoading ? null : () => setVisible(true)}
            >
              {category}
            </Text>

            {
              categoryID && <Button onPress={removeCategoryHandler} style={styles.removeCatBtn} textColor={colors.color2} icon={"close"}>Remove Category</Button>
            }

            <ButtonDisable
              disable={disable}
              loading={createLoading}
              handler={createProductHandler}
              text={"Create"}
            />
          </View>
        </ScrollView>
      </View>
      <SelectCategory
        visible={visible}
        setVisible={setVisible}
        setCategory={setCategory}
        setCategoryID={setCategoryID}
        categories={categories}
      />
    </>
  );
};

const styles = StyleSheet.create({
  updateFormCont: {
    backgroundColor: colors.color7,
    padding: moderateScale(10),
    elevation: 10,
    borderRadius: 10,
  },
  innerBox: {
    justifyContent: "center",
    minHeight: verticalScale(450),
  },
  imgCont: {
    height: moderateScale(100),
    width: moderateScale(100),
    alignSelf: "center",
    marginBottom: verticalScale(15),
  },
  icon: {
    backgroundColor: colors.color2,
    position: "absolute",
    right: scale(-2),
    bottom: verticalScale(-2),
  },
  removeCatBtn:{
    backgroundColor:colors.color1,
    width:"40%",
    alignSelf:"center"
  }
});

export default AddProduct;
