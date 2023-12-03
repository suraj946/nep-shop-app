import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, defaultStyle, formHeading } from "../../styles/styles";
import Header from "../../components/Header";
import { Avatar } from "react-native-paper";
import ButtonDisable from "../../components/ButtonDisable";
import axios from "axios";
import {server} from "../../redux/store";
import mime from "mime";
import {useErrorMessage} from '../../utils/hook';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ManagesImages = ({ navigation, route }) => {
  const [images, setImages] = useState(route.params.images);
  const [productId] = useState(route.params.id);
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [disableAll, setDisableAll] = useState(false);

  const deleteImageHandler = (imageId, setDelLoading) => {
    if(images.length === 1){
      return Toast.show({type:"error", text1:"At least one image is required"});
    }
    Alert.alert("Confirm", "Delete this image ?", [
      {text:"Cancel", onPress:null},
      {text:"Yes", onPress:async() => {
        try {
          setDelLoading(true);
          setDisableAll(true);
          const {data} = await axios.delete(`${server}/product/images/${productId}?id=${imageId}`,{withCredentials:true});
          if(data.success){
            setDelLoading(false);
            setDisableAll(false);
            setMessage(data.message);
            setImages(images.filter(i => i._id !== imageId));
          }
        } catch (err) {
            setDelLoading(false);
            setDisableAll(false);
            setError(err.response.data.message);
        }
      }},
    ])
  };

  const addImageHandler = async() => {
    const myForm = new FormData();
    myForm.append("file", {
      uri:image,
      type:mime.getType(image),
      name:image.split("/").pop()
    });

    try {
      setAddLoading(true);
      setDisableAll(true);
      const {data} = await axios.post(`${server}/product/images/${productId}`, myForm, {
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true
      });

      if(data.success){
        setImage(null);
        setAddLoading(false);
        setDisableAll(false);
        setImages([...images, data.image]);
        setMessage(data.message);
      }
    } catch (err) {
      setAddLoading(false);
      setDisableAll(false);
      setError(err.response.data.message)
    }
  };

  useErrorMessage(error, message, setError, setMessage);

  useEffect(() => {
    if(route.params?.image){
      setImage(route.params.image);
      setImageChanged(true);
      route.params.image = null;
    }
  }, [route.params]);

  return (
    <View style={{ ...defaultStyle, backgroundColor: colors.color5 }}>
      <Header back={true} />
      <View style={{ marginVertical: verticalScale(16), paddingTop: verticalScale(40) }}>
        <Text style={formHeading}>Images</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: verticalScale(8) }}
      >
        <View style={styles.imgCardCont}>
          {images.map((i) => (
            <ImageCard
              key={i._id}
              id={i._id}
              src={i.url}
              deleteHandler={deleteImageHandler}
              disable={disableAll}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.belowBox}>
        <Image style={styles.belowBoxImg} source={{ uri: image }} />
        <View style={styles.actionCont}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={disableAll ? null : () =>
              navigation.navigate("Camera", { updateImage: true })
            }
          >
            <Avatar.Icon icon={"camera"} style={{...styles.iconStyle, backgroundColor:disableAll ? colors.btnDisable : colors.color1}} size={moderateScale(33)} />
          </TouchableOpacity>
        </View>
        <ButtonDisable
          extraStyle={{
            margin: moderateScale(4),
            width: scale(160),
            alignSelf: "center",
            padding: moderateScale(2),
          }}
          loading={addLoading}
          text={"Add"}
          handler={addImageHandler}
          disable={!imageChanged || disableAll || !image}
        />
      </View>
    </View>
  );
};

const ImageCard = ({ id, src, deleteHandler, disable=false }) => {
  const [delLoading, setDelLoading] = useState(false)
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: src }} style={{...styles.cardImageStyle, opacity:delLoading ? 0.4 : 1}} />
      <TouchableOpacity
        onPress={disable ? null : () => deleteHandler(id, setDelLoading)}
        style={styles.iconCont}
        activeOpacity={0.9}
      >
        {
          delLoading ? (
            <ActivityIndicator size={"larger"} color={colors.color1}/>
          ) : (
            <Avatar.Icon
              icon={"delete"}
              size={moderateScale(31)}
              style={{ backgroundColor: disable ? colors.btnDisable : colors.color1 }}
              color={colors.color2}
            />
          )
        }
      </TouchableOpacity>
    </View>
  );
};

export default ManagesImages;

const styles = StyleSheet.create({
  imgCardCont: {
    minHeight: verticalScale(450),
    backgroundColor: colors.color2,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
  },
  belowBox: {
    backgroundColor: colors.color3_light,
    padding: moderateScale(8),
    borderRadius: 10,
  },
  belowBoxImg: {
    width: scale(100),
    height: scale(100),
    backgroundColor: colors.color2,
    alignSelf: "center",
    resizeMode: "contain",
  },
  actionCont: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconStyle: {
    backgroundColor: colors.color1,
    margin: moderateScale(8),
  },

  //card styles
  cardContainer: {
    height: verticalScale(225),
    backgroundColor: colors.color2,
    elevation: 10,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(5),
    margin: moderateScale(8),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent:"center"
  },
  cardImageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  iconCont: {
    position: "absolute",
    top: verticalScale(-4),
    right: scale(-4),
  },
});
