import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, defaultStyle, formHeading, inputStyling } from '../../styles/styles';
import Header from '../../components/Header';
import { Avatar, TextInput } from 'react-native-paper';
import ButtonDisable from '../../components/ButtonDisable';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../redux/store';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Category = () => {
    const [category, setCategory] = useState("");
    const {categories} = useSelector(state => state.product);
    const dispatch = useDispatch();
    const disable = !category;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);

    const addCategoryHandler = async()=>{
      try {
        setLoading(true);
        setBtnDisable(true);
        const {data} = await axios.post(`${server}/product/category`, {name : category.trim()}, {
          headers:{
            "Content-Type" : "application/json"
          },
          withCredentials:true
        });
        setLoading(false);
        setBtnDisable(false);
        if(data.success){
          setCategory("");
          dispatch({type:"getCategoriesSuccess", payload:[...categories, data.category]});
          setMessage(data.message);
        }
      } catch (err) {
        setLoading(false);
        setBtnDisable(false);
        setError(err.response.data.message);
      }
    }

    const deleteCatHandler = async(id, setDelLoading)=>{
      try {
        setDelLoading(true);
        setBtnDisable(true);
        const {data} = await axios.delete(`${server}/product/category/${id}`, {}, {
          withCredentials:true
        });
        setDelLoading(false);
        setBtnDisable(false);
        if(data.success){
          const updatedCategory = categories.filter(i => i._id !== id);
          dispatch({type:"getCategoriesSuccess", payload:updatedCategory})
        }
        setMessage(data.message);
      } catch (err) {
        setDelLoading(false);
        setBtnDisable(false);
        setError(err.response.data.message);
      }
    }

    const handler = (id, setDelLoading) =>{
      Alert.alert("Confirm", "Delete this category", [
        {text:"Cancel", onPress: () => null},
        {text:"Yes", onPress: ()=>deleteCatHandler(id, setDelLoading)}
      ]);
    }

    useEffect(() => {
      if(error){
        Toast.show({type:"error", text1:error});
        setError(null);
      }
      if(message){
        Toast.show({type:"success", text1:message});
        setMessage(null);
      }
    }, [error, message]);
    
  return (
    <>
    <View style={defaultStyle}>
      <Header back={true} />

      <View style={{marginVertical:verticalScale(16), paddingTop:verticalScale(40)}}>
        <Text style={formHeading}>Category</Text>
      </View>

      <View style={styles.inpCont}>
        <TextInput
          style={inputStyling}
          activeUnderlineColor={colors.color1}
          placeholder='Category'
          value={category}
          onChangeText={setCategory}
          disabled={loading}
        />
        <ButtonDisable loading={loading} disable={disable} handler={addCategoryHandler} text={"Add"} />
      </View> 

      {
        categories.length !== 0 ? (
          <ScrollView style={styles.categoryContAdmin} showsVerticalScrollIndicator={false}>
            {
                categories.map(i=>(
                    <CategoryCard key={i._id} name={i.name} id={i._id} handler={handler} disable={btnDisable}/>
                ))
            }
          </ScrollView>
        ) : (
          <View style={styles.noCategoryView}>
            <Text style={styles.noCategoryText}>No Category Yet</Text>
          </View>
        )
      }
    </View>
    {/* <CustomAlert
      title={"Warning"}
      message={"Delete this category"}
      isVisible={visible}
      setIsVisible={setVisible}
      actions={[
        {
          text:"Cancel",
          onPress:()=>null
        },
        {
          text:"Yes",
          onPress:
        }
      ]}
      closeOnIgnore={true}
    /> */}
    </>
  )
}

const CategoryCard = ({name, id, handler, disable})=>{
  const [delLoading, setDelLoading] = useState(false);
  return (
    <View style={styles.categoryCardCont}>
        <Text style={styles.categoryText}>{name}</Text>
        {
          delLoading  ? (
            <ActivityIndicator size={Platform.OS === "android" ? moderateScale(27) : "small"} color={colors.color1} />
          ) : (
            <TouchableOpacity disabled={disable} activeOpacity={0.7} onPress={()=>handler(id, setDelLoading)}>
              <Avatar.Icon icon={"delete"} size={moderateScale(27)} style={{backgroundColor:disable ? colors.btnDisable : colors.color1}} />
            </TouchableOpacity>
          )
        }
    </View>
)}
export default Category;

const styles = StyleSheet.create({
    categoryContAdmin:{
        minHeight:verticalScale(300),
        backgroundColor:colors.color7,
        padding:moderateScale(5),
        marginHorizontal:scale(4),
        borderRadius:moderateScale(10)
    },
    inpCont:{
        backgroundColor:colors.color7,
        marginHorizontal:scale(5),
        marginBottom:verticalScale(15),
        borderRadius:moderateScale(10),
        padding:moderateScale(8),
    },
    categoryCardCont:{
        backgroundColor:colors.color2,
        elevation:5,
        borderRadius:moderateScale(10),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:moderateScale(8),
        margin:moderateScale(7)
    },
    categoryText:{
        fontWeight:"600",
        textTransform:"uppercase",
        letterSpacing:2
    },
    noCategoryView:{
      height:"50%",
      justifyContent:"center",
      alignItems:"center"
    },
    noCategoryText:{
      fontSize:moderateScale(30),
      color:colors.color3_light
    }
});
