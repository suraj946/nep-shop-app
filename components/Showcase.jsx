import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../styles/styles';

const Showcase = ({Card, title, typeText, products}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const addToCart = useCallback(({id, name, image, stock, price, quantity}) => {
        if(stock <= 0){
          Toast.show({type:"error", text1:"Out of Stock"});
          return
        }
        dispatch({type:"addToCart", payload:{
          product:id,
          name, price, stock, quantity, image
        }});
        Toast.show({type:"success", text1:"Added to cart"});
    }, [dispatch]);

  return (
    <View style={styles.showCaseView}>
      <Text style={styles.headingText}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {
            products.map((item, index) => (
                <Card 
                    image={item.images[0].url}
                    name={item.name}
                    price={item.price}
                    stock={item.stock}
                    i={index}
                    id={item._id}
                    navigation={navigation}
                    addToCart={addToCart}
                    key={item._id}
                    discount={item.discount}
                    averageRating={item.averageRating}
                    typeText={typeText}
                />
            ))
        }
      </ScrollView>
    </View>
  )
}

export default memo(Showcase);

const styles = StyleSheet.create({
    showCaseView:{
        backgroundColor:colors.color2,
        padding:moderateScale(4),
    },
    headingText:{
        fontSize:moderateScale(25),
        color:colors.color1,
        textTransform:"capitalize",
        fontWeight:"bold",
    }
});