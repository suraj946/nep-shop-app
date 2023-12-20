import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import {colors, defaultStyle} from "../styles/styles";
import Carousel from 'react-native-snap-carousel';
import { Avatar, Button, TextInput } from 'react-native-paper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { useErrorMessage } from '../utils/hook';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import axios from 'axios';
import { server } from '../redux/store';
import ReviewCard from '../components/ReviewCard';
import Star from '../components/Star';
import StarInput from '../components/StarInput';
import ButtonDisable from '../components/ButtonDisable';
import { ProductDetailShimmer } from '../components/Shimmers';

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDER_WIDTH;

const Productdetails = ({route:{params}}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const isCarousel = useRef(null);
  const [quantity, setQuantity] = useState(1);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  const abortControllerRef = useRef(null);

  const discountedPrice = product.price - Math.round((product.price * product.discount)/100);

  useErrorMessage(error, message, setError, setMessage);

  const fetchDetails = async()=>{
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      setFetchLoading(true);
      const {data} = await axios.get(`${server}/product/single/${params.id}`, {signal:abortControllerRef.current?.signal});
      if(data.success){
        setFetchLoading(false);
        setProduct(data.product);
        setReviews(data.reviews);
      }
    } catch (err) {
      setFetchLoading(false);
      if(err.name !== "CanceledError"){
        setError(err.response.data.message);
      }
    }
  }

  const incrementQty = ()=>{
    if(quantity >= product.stock){
      return ;
    }
    setQuantity((prev)=>prev+1);
  }
  const decrementQty = ()=>{
    if(quantity <= 1){
      return;
    }
    setQuantity((prev)=>prev-1);
  }

  const addToCartHandler = ()=>{
    if(product.stock <= 0){
      Toast.show({type:"error", text1:"Out of Stock"});
      return
    }
    dispatch({type:"addToCart", payload:{
        product:params.id,
        name:product.name,
        price:discountedPrice,
        stock:product.stock,
        quantity,
        image:product.images[0]?.url
    }});
    Toast.show({type:"success", text1:"Added to cart"});
  }

  const postReview = async() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    try {
      setReviewLoading(true);
      const {data} = await axios.post(`${server}/product/review/${params.id}`,{
        reviewText:review,
        rating
      },{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true,
        signal:abortControllerRef.current?.signal
      });
      if(data.success){
        setReviewLoading(false);
        setMessage(data.message);
        setReview("");
        const temp = [...reviews];
        const index = temp.findIndex(i=>i.user._id === user._id);
        if(index !== -1){
          temp[index].rating = rating;
          temp[index].reviewText = review;
          setReviews([...temp]);
        }else{
          setReviews([data?.review, ...reviews]);
        }
      }
    } catch (err) {
        setReviewLoading(false);
        if(err.name !== "CanceledError"){
          setError(err.response.data.message);
        }
    }
  }

  useEffect(() => {
    fetchDetails();
    return () => {
      abortControllerRef.current?.abort();
    }
  }, []);

  return (
  <>
    <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.color1} 
    />
  <View style={{...defaultStyle, padding:0, backgroundColor:colors.color1}}>
    <Header back={true} />
    {
      fetchLoading ? <ProductDetailShimmer /> : (
        <ScrollView style={{marginTop:verticalScale(20)}}>
          <Carousel 
            layout="stack"
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            ref={isCarousel}
            data={product.images}
            renderItem={CarouselCardItem}
          />
          <View style={styles.productDetailCont}>
            <View style={{
              width:"20%",
              height:verticalScale(5),
              backgroundColor:colors.color3_light,
              borderRadius:20,
              alignSelf:"center",
              marginBottom:4
            }} />
            {product.stock === 0 && <Text style={styles.outOfStock}>OUT OF STOCK</Text>}
            <Text style={{fontSize:moderateScale(24), marginTop:verticalScale(10)}} numberOfLines={2}>{product.name}</Text>

            <Text style={styles.dicountTxt}>{product.discount}% OFF</Text>
            <View style={styles.priceView}>
              <Text style={styles.beforeDis}>₹{product.price}</Text>
              <Text style={styles.afterDis}>₹{discountedPrice}</Text>
            </View>

            <Text style={{lineHeight:verticalScale(15), letterSpacing:1, marginVertical:verticalScale(10), fontSize:moderateScale(14)}} numberOfLines={8}>{product.description}</Text>

            <Star size={moderateScale(30)} rating={product.averageRating} activeColor={colors.color1} />

            <View style={styles.quantityCont}>
              <Text style={{color:colors.color1, fontSize:moderateScale(20), fontWeight:"300"}}>Quantity</Text>
              <View style={styles.actionCont}>
                <TouchableOpacity onPress={decrementQty} activeOpacity={0.6}>
                  <Avatar.Icon icon={"minus"} size={moderateScale(26)} style={styles.iconStyle} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity onPress={incrementQty} activeOpacity={0.6}>
                  <Avatar.Icon icon={"plus"} size={moderateScale(26)} style={styles.iconStyle} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={addToCartHandler}>
              <Button icon={"cart"} style={styles.btnCart} textColor={colors.color2}>Add To Cart</Button>
            </TouchableOpacity>

            <View style={styles.reviewCont}>
              <View style={styles.postReviewCont}>
                <Text style={styles.reviewHeading}>Rate this product</Text>
                <View style={styles.formView}>
                  <StarInput onRatingChange={(num)=>setRating(num)} activeColor={colors.color1} size={35} disabled={reviewLoading}/>
                  <TextInput 
                    label={"Review"}
                    value={review}
                    onChangeText={text => setReview(text)}
                    multiline={true}
                    placeholder='Post a review...'
                    numberOfLines={5}
                    mode='outlined'
                    disabled={reviewLoading}
                  />
                  <ButtonDisable 
                    text={"Post"}
                    disable={reviewLoading || !review}
                    loading={reviewLoading}
                    handler={postReview}
                    extraStyle={{padding:0, width:scale(120), alignSelf:"center"}}
                  />
                </View>
              </View>
              <Text style={styles.reviewHeading}>Reviews{` (${reviews.length})`}</Text>
              {
                reviews.length === 0 ? (
                  <Text style={{
                    fontSize:moderateScale(25),
                    color:colors.color3_light,
                    textAlign:"center",
                    marginTop:verticalScale(10)
                  }}>No reviews yet</Text>
                ):(
                  reviews.map(i=>(
                    <ReviewCard key={i._id} userName={i.user.name} userImage={i.user.avatar.url} rating={i.rating} reviewText={i.reviewText}/>
                  ))
                )
              }
            </View>
          </View>
        </ScrollView>
      )
    }
  </View>
  </>
  )
}

const CarouselCardItem = ({item, index})=>{
  return(
    <View key={index} style={styles.carouselCont}>
      <Image source={{uri:item.url}} style={styles.cardImage} />
    </View>
  )
}

export default Productdetails;

const styles = StyleSheet.create({
  carouselCont:{
    width:ITEM_WIDTH,
    height:ITEM_WIDTH,
    alignItems:"center",
    justifyContent:"center",
  },
  cardImage:{
    width:"90%",
    height:"90%",
    resizeMode:"contain",
  },
  productDetailCont:{
    marginTop:verticalScale(10),
    width:"100%",
    backgroundColor:colors.color2,
    borderTopLeftRadius:moderateScale(50),
    borderTopRightRadius:moderateScale(50),
    padding:moderateScale(15),
    paddingTop:verticalScale(10)
  },
  quantityCont:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    padding:moderateScale(8)
  },
  actionCont:{
    flexDirection:"row",
    width:scale(80),
    justifyContent:"space-between",
    alignItems:"center",
  },
  iconStyle:{
    borderRadius:moderateScale(5),
    backgroundColor:colors.color1,
    opacity:0.8
  },
  qtyText:{
    fontSize:moderateScale(20),
    paddingHorizontal:scale(5),
    color:colors.color3
  },
  btnCart:{
    backgroundColor:colors.color1,
    padding:moderateScale(5),
    marginVertical:verticalScale(20),
    opacity:0.9,
    borderRadius:100
  },


  outOfStock:{
    alignSelf:"center",
    color:colors.cDanger,
    fontSize:moderateScale(20),
    borderWidth:1,
    borderColor:colors.color1,
    padding:moderateScale(5)
  },

  dicountTxt:{
    fontSize:moderateScale(17),
    color:colors.cSuccess,
    paddingVertical:verticalScale(2)
  },
  priceView:{
    flexDirection:"row",
    alignItems:"center"
  },
  beforeDis:{
    fontSize:moderateScale(16),
    textDecorationLine:"line-through",
    marginRight:scale(10)
  },
  afterDis:{
    fontSize:moderateScale(20),
    marginRight:scale(5),
    color:colors.color1
  },
  reviewCont:{
    // backgroundColor:"grey",
    marginBottom:verticalScale(20)
  },
  reviewHeading:{
    fontSize:moderateScale(20),
    color:colors.color3_light,
    alignSelf:"center",
    borderBottomWidth:moderateScale(2),
    borderColor:colors.color3_light,
    paddingBottom:verticalScale(2)
  },
  postReviewCont:{
    marginVertical:verticalScale(5),
  },
  formView:{
    position:"relative",
  },
});