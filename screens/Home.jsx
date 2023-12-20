import { ScrollView, StyleSheet, TouchableOpacity, View, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {colors, defaultStyle} from "../styles/styles";
import Header from '../components/Header';
import { Avatar } from 'react-native-paper';
import SearchModal from '../components/SearchModal';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Heading from '../components/Heading';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../redux/action/productAction';
import { useEffectOnChange, useMessageErrProduct } from '../utils/hook';
import SearchByCategory from '../components/SearchByCategory';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import axios from 'axios';
import { server } from '../redux/store';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Showcase from '../components/Showcase';
import ProductItem from '../components/ProductItem';
import ProductWithBadge from '../components/ProductWithBadge';
import { CardItemShimmer, CardWithBadgeShimmer, ProductCardShimmer } from '../components/Shimmers';
import { loadUser } from '../redux/action/userAction';

const Home = ({navigation}) => {
    const dispatch = useDispatch();
    const {featuredProducts, newArrivalProducts, trendingProducts, highDiscountProducts, categories} = useSelector(state => state.product);
    const loading = useMessageErrProduct(dispatch);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedProduct, setSearchedProduct] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getHomePage()
    }, []);

    const getHomePage = async()=>{
        try {
            dispatch({type:"getHomeProductsRequest"});
            const {data} = await axios.get(`${server}/product/gethomeproducts`);
            if(data.success){
                setRefreshing(false);
                dispatch({type:"getHomeProductsSuccess", payload:data});
            }
        } catch (error) {
            setRefreshing(false);
            dispatch({type:"getHomeProductsFail", payload:error.response.data.message});
        }
    }

    const gotoFunc = useCallback((category)=>{
        navigation.navigate("Searchedproduct", {category, keyword:""});
    }, []);

    useEffect(() => {
        (async()=>{
            await Promise.allSettled([getHomePage(), dispatch(loadUser()), dispatch(getAllCategories())]);
        })()
    }, [dispatch]);

    useEffectOnChange(() => {
        let timeOut = setTimeout(() => {
            (async()=>{
                try {
                    setSearchLoading(true);
                    const {data} = await axios.get(`${server}/product/all?keyword=${searchQuery}`, {withCredentials:true});
                    setSearchedProduct(data.products);
                    setSearchLoading(false);
                } catch (err) {
                    setError(err.response.data.message);
                    setSearchLoading(false);
                }
            })();
        }, 500);
        return ()=>clearTimeout(timeOut);
    }, [searchQuery]);

    useEffect(() => {
      if(error){
        Toast.show({type:"error", text1:error});
        setError(null);
      }
    }, [error]);
    
  return (
    <>
    {modalOpen &&
     <SearchModal setModalOpen={setModalOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchedProduct={searchedProduct} searchLoading={searchLoading} />
    }

    <View style={defaultStyle}>
        <Header />

        <View style={styles.subHeader}>
            <View>
                <Heading text1={"Our"} text2={"Products"} />
            </View>
            <View>
                <TouchableOpacity onPress={()=>setModalOpen((prev)=>!prev)}>
                    <Avatar.Icon icon={"magnify"} color={"grey"} style={styles.searchIcon} size={moderateScale(47)} />
                </TouchableOpacity>
            </View>
        </View>

        <SearchByCategory categories={categories} gotoFunc={gotoFunc} />

        <ScrollView style={styles.showCaseCont} showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
            {
                loading ? (
                    <>
                    <CardWithBadgeShimmer />
                    <CardItemShimmer />
                    <CardWithBadgeShimmer />
                    <ProductCardShimmer />
                    </>
                ) : (
                    <>
                    <Showcase products={featuredProducts} title={"featured product"} Card={ProductWithBadge} typeText={"featured"}/>
                    <Showcase products={trendingProducts} title={"trending product"} Card={ProductItem} typeText={"trending"}/>
                    <Showcase products={highDiscountProducts} title={"Product with huge discount"} Card={ProductWithBadge} typeText={"discounted"}/>
                    <Showcase products={newArrivalProducts} title={"new on nepShop"} Card={ProductCard} typeText={"new"}/>
                    </>
                )
            }
        </ScrollView>

    </View>
    <Footer activeRoute={"Home"}/>
    </>
  )
}

export default Home;

const styles = StyleSheet.create({
    subHeader:{
        paddingTop:verticalScale(15),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    searchIcon:{
        backgroundColor:colors.color2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    showCaseCont:{
        marginBottom:verticalScale(45),
        paddingHorizontal:scale(5)
    }
});