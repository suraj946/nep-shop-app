import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, defaultStyle, formHeading } from '../../styles/styles';
import Header from '../../components/Header';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import axios from 'axios';
import { server } from '../../redux/store';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ReviewCard from "../../components/ReviewCard";
import Loader from '../../components/Loader';

const ReviewScreen = ({route}) => {
    const [reviews, setReviews] = useState([]);
    const [productName, setProductName] = useState("");
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect(() => {
      (async() => {
        try {
            setFetchLoading(true);
            const {data} = await axios.get(`${server}/product/review/${route.params?.id}`, {withCredentials:true});
            if(data.success){
                setFetchLoading(false);
                setReviews(data.reviews);
                setProductName(data.productName);
            }
        } catch (error) {
            setFetchLoading(false);
            Toast.show({type:"error", text1:error.response.data.message});
        }
      })()
    }, []);
    
  return (
    <View style={defaultStyle}>
      <Header back={true} />
      {
        fetchLoading ? <Loader /> : (
            <>
            <View style={{marginVertical:verticalScale(10), paddingTop:verticalScale(45)}}>
                <Text style={formHeading}>{productName}</Text>
            </View>
            {
                reviews && reviews.length > 0 ? (
                    <ScrollView style={{padding:moderateScale(7)}} showsVerticalScrollIndicator={false}>
                    {
                        reviews.map(review => (
                            <ReviewCard 
                                key={review._id}
                                userName={review.user.name}
                                userImage={review.user.avatar.url}
                                rating={review.rating}
                                reviewText={review.reviewText}
                                isAdmin={true}
                                reviewId={review._id}
                                productId={route.params?.id}
                            />
                        ))
                    }
                    </ScrollView>
                ) : (
                    <View style={styles.justView}>
                        <Text style={{fontSize:35, color:colors.color3_light}}>Nothing to show</Text>
                    </View>
                )
            }
            </>
        )
      }
    </View>
  )
}

export default ReviewScreen;

const styles = StyleSheet.create({
    justView:{
        width:"100%", 
        height:verticalScale(400), 
        justifyContent:"center", 
        alignItems:"center"
    }
});