import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  colors,
  defaultStyle,
  formHeading,
  inputStyling,
} from "../../styles/styles";
import Header from "../../components/Header";
import { Button, TextInput } from "react-native-paper";
import Loader from "../../components/Loader";
import ButtonDisable from "../../components/ButtonDisable";
import SelectCategory from "../../components/SelectCategory";
import { useSelector } from "react-redux";
import axios from "axios";
import {server} from "../../redux/store";
import { useErrorMessage } from "../../utils/hook";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CheckBox from "../../components/CheckBox";

const UpdateProduct = ({ navigation, route }) => {
  const {categories} = useSelector(state => state.product);
  const id = route.params.id;
  const [visible, setVisible] = useState(false);

  const [initialProduct, setInitialProduct] = useState({});
  const [formData, setFormData] = useState({});
  const [categoryText, setCategoryText] = useState("Select Category");
  const [categoryID, setCategoryID] = useState(undefined);
  const [isFeatured, setIsFeatured] = useState(null);
  const [isNewArrival, setIsNewArrival] = useState(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const disable = !formData.name || !formData.description || !formData.price || !formData.stock;

  const onTextChange = (key, val) => {
    setFormData({...formData,[key]:val});
  }

  const removeCategoryHandler = () => {
    setCategoryID(null);
    setCategoryText("Select Category");
  }

  useEffect(()=>{
    (async() => {
      try {
        setLoading(true);
        const {data} = await axios.get(`${server}/product/single/${id}`);
        if(data.success){
          setLoading(false);
          setInitialProduct(data.product);
        }
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setFormData({
      name:initialProduct?.name,
      description:initialProduct?.description,
      price:initialProduct?.price?.toString(),
      stock:initialProduct?.stock?.toString(),
      discount:initialProduct?.discount?.toString(),
    });
    if(initialProduct?.category){
      setCategoryText(initialProduct.category.name);
      setCategoryID(initialProduct.category._id);
    }
    setIsFeatured(initialProduct?.isFeatured);
    setIsNewArrival(initialProduct?.isNewArrival);
  }, [initialProduct._id]);
  

  useErrorMessage(error, message, setError, setMessage);

  const updateProductHandler = async() => {
    const dataToUpdate = {...formData, isFeatured, isNewArrival};
    if(categoryID){
      dataToUpdate["category"] = categoryID;
    }
    try {
      setUpdateLoading(true);
      const {data} = await axios.put(`${server}/product/single/${id}`, dataToUpdate, {
        headers:{
          "Content-Type" : "application/json"
        },
        withCredentials:true
      });
      if(data.success){
        setUpdateLoading(false);
        setMessage(data.message);
        navigation.goBack();
      }
    } catch (err) {
      setUpdateLoading(false);
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <View style={defaultStyle}>
        <Header back={true} />
        <View style={{ marginVertical: verticalScale(16), paddingTop: verticalScale(40) }}>
          <Text style={formHeading}>Update Product</Text>
        </View>
        {loading ? (
          <Loader />
        ) : (
          <ScrollView
            style={styles.updateFormCont}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.innerBox}>
              <Button
                textColor={colors.color2}
                style={styles.manageImgBtn}
                onPress={() =>
                  navigation.navigate("Managesimages", { id, images:initialProduct?.images })
                }
              >
                Manages Images
              </Button>

              <TextInput
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text)=>onTextChange("name", text)}
                disabled={updateLoading}
              />
              <TextInput
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder="Description"
                value={formData.description}
                onChangeText={(text)=>onTextChange("description", text)}
                disabled={updateLoading}
              />
              <TextInput
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder="Price"
                value={formData.price}
                onChangeText={(text)=>onTextChange("price", text)}
                keyboardType="number-pad"
                disabled={updateLoading}
              />
              <TextInput
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder="Stock"
                value={formData.stock}
                onChangeText={(text)=>onTextChange("stock", text)}
                keyboardType="number-pad"
                disabled={updateLoading}
              />
              <TextInput
                style={inputStyling}
                activeUnderlineColor={colors.color1}
                placeholder="Discount"
                value={formData.discount}
                onChangeText={(text)=>onTextChange("discount", text)}
                keyboardType="number-pad"
                disabled={updateLoading}
              />
              <CheckBox isChecked={isFeatured} setIsChecked={setIsFeatured} loading={updateLoading} label={"featured product"}  />
              <CheckBox isChecked={isNewArrival} setIsChecked={setIsNewArrival} loading={updateLoading} label={"new arrival product"}  />
              <Text
                style={{
                  ...inputStyling,
                  textAlign: "center",
                  textAlignVertical: "center",
                  borderRadius: 4,
                  color: updateLoading ? colors.btnDisable : null,
                }}
                onPress={updateLoading ? null : () => setVisible(true)}
              >
                {categoryText}
              </Text>
              {
                categoryID && <Button onPress={removeCategoryHandler} style={styles.removeCatBtn} textColor={colors.color2} icon={"close"}>Remove Category</Button>
              }
              <ButtonDisable
                disable={disable}
                loading={updateLoading}
                handler={updateProductHandler}
                text={"Update"}
              />
            </View>
          </ScrollView>
        )}
      </View>
      <SelectCategory
        visible={visible}
        setVisible={setVisible}
        setCategory={setCategoryText}
        setCategoryID={setCategoryID}
        categories={categories}
      />
    </>
  );
};

export default UpdateProduct;

const styles = StyleSheet.create({
  updateFormCont: {
    backgroundColor: colors.color7,
    padding: moderateScale(8),
    elevation: 10,
    borderRadius: moderateScale(10),
  },
  innerBox: {
    justifyContent: "center",
    minHeight: verticalScale(430),
  },
  manageImgBtn: {
    backgroundColor: colors.color1,
    width: scale(150),
    alignSelf: "center",
    marginBottom: verticalScale(20),
    padding: moderateScale(3),
  },
  removeCatBtn:{
    backgroundColor:colors.color1,
    width:"40%",
    alignSelf:"center"
  }
});
