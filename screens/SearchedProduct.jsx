import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { colors, defaultStyle, formHeading } from '../styles/styles';
import Header from '../components/Header';
import SearchByCategory from '../components/SearchByCategory';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Searchbar } from 'react-native-paper';
import Loader from '../components/Loader';
import axios from 'axios';
import { server } from '../redux/store';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ProductItem from '../components/ProductItem';

const SearchedProduct = ({navigation, route}) => {
    const limit = 10;
    const [category, setCategory] = useState(route.params.category);
    const [keyword, setKeyword] = useState(route.params.keyword);
    const {categories} = useSelector(state => state.product);
    const [dataCache, setDataCache] = useState({});
    const [data, setData] = useState([]);
    const [maxPage, setMaxPage] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const initialRender = useRef(true);
    
    const fetchData = async () => {
      if (dataCache[page]) {
        setData(dataCache[page]);
      } else {
        try {
          setLoading(true);
          const {data} = await axios.get(`${server}/product/all?keyword=${keyword}&category=${category}&page=${page}`, {withCredentials:true});
          setData(data.products);
          setDataCache({...dataCache, [page]:data.products});
          setLoading(false);
        } catch (err) {
          setError(err.response.data.message);
          setLoading(false);
        }
      }
    };
    
    useEffect(() => {
      let timeOut = setTimeout(() => {
        (async()=>{
          try {
            setLoading(true);
            setPage(1);
            setDataCache({1:[]});
            const {data} = await axios.get(`${server}/product/all?keyword=${keyword}&category=${category}&page=1`, {withCredentials:true});
            setData(data.products);
            setDataCache({1:data.products});
            setMaxPage(Math.ceil(data.totalProducts/limit));
            setLoading(false);
          } catch (err) {
            setError(err.response.data.message);
            setLoading(false);
          }
        })();
      }, 500);
      return ()=>clearTimeout(timeOut);
    }, [keyword, category]);

    useEffect(() => {
      if(initialRender.current){
        initialRender.current.false;
        return;
      }
      fetchData();
    }, [page]);

    useEffect(() => {
      if(error){
        Toast.show({type:"error", text1:error});
        setError(null);
      }
    }, [error]);
    
    const handleNextPage = () => {
      setPage((prevPage) => prevPage + 1);
    };
    
    const handlePrevPage = () => {
      setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
    };    

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
    <View style={{...defaultStyle, paddingBottom:0}}>
      <Header back={true} />
      <Searchbar placeholder='Search...' onChangeText={(e)=>setKeyword(e)} value={keyword} style={{marginTop:verticalScale(55)}} />
      <SearchByCategory style={{marginTop:verticalScale(0)}} categories={categories} category={category} setCategory={setCategory} />
      <View style={{marginTop:verticalScale(-5)}}>
        <Text style={formHeading}>Results</Text>
      </View>

      {
        loading ? <Loader /> :
        data.length > 0 ?(
          <View style={{flex:1, paddingTop:5}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data} 
              renderItem={({item, index})=>(
                  <ProductItem
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    stock={item.stock}
                    image={item.images[0].url}
                    i={index}
                    navigation={navigation}
                    addToCart={addToCart}
                    averageRating={item.averageRating}
                  />
              )}
              keyExtractor={(item, index)=>index.toString()}
              numColumns={2}
              columnWrapperStyle={{alignSelf:"center"}}
            />
            <View style={styles.paginationControlCont}>
              <PageControlBtn isDisable={page === 1} iconName={"arrow-left"} handler={handlePrevPage} />
              {/* <View style={styles.numberBtnCont}>
                //TODO create the show pages features
              </View> */}
              <PageControlBtn isDisable={page === maxPage} iconName={"arrow-right"} handler={handleNextPage} />
            </View>
          </View>
        ) : 
        (
          <View style={styles.notFoundCont}>
            <Text style={{fontSize:moderateScale(32), color:colors.color3_light}}>No Product Found!!</Text>
          </View>
        )
      }
    </View>
  )
}

const PageControlBtn = ({iconName = "", isDisable = false, handler}) => (
  <TouchableOpacity activeOpacity={0.8} onPress={isDisable ? null : handler}>
    <Avatar.Icon icon={iconName} 
      style={{backgroundColor:isDisable ? colors.btnDisable : colors.color1, borderRadius:5}}
      color={colors.color2} 
      size={moderateScale(35)}
    />
  </TouchableOpacity>
)

export default SearchedProduct;

const styles = StyleSheet.create({
  paginationControlCont:{
    height:verticalScale(35),
    backgroundColor:colors.color6,
    padding:moderateScale(18),
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  numberBtnCont:{
    display:"flex",
    flexDirection:"row"
  },
  notFoundCont:{
    width:"100%",
    display:"flex",
    alignItems:"center",
    marginTop:verticalScale(100)
  },
});