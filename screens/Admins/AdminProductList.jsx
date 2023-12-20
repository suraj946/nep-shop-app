import { Alert, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { colors, defaultStyle } from '../../styles/styles';
import Header from '../../components/Header';
import { verticalScale } from 'react-native-size-matters';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../redux/store';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Avatar, Button, DataTable, Menu, Searchbar, Switch } from 'react-native-paper';
import BottomModalMenu from '../../components/BottomModalMenu';
import SearchByCategory from '../../components/SearchByCategory';
import SearchByStock from '../../components/SearchByStock';
import { useEffectOnChange } from '../../utils/hook';
import Loader from '../../components/Loader';

const AdminProductList = ({route}) => {
    const navigation = useNavigation();
    const {products, totalProductsCount} = useSelector(state => state.adminProduct);
    const {categories} = useSelector(state => state.product);
    const dispatch = useDispatch();

    const maxLoadedPage = useRef(1);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchId, setSearchId] = useState("");
    const [category, setCategory] = useState("");
    const [stockState, setStockState] = useState(route.params?.stockState || "");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const from = (page - 1) * limit;
    const to = Math.min((page) * limit, products.length);

    const actionHandler = useCallback((item)=>{
        setSelectedProduct({...item});
        setVisible(true);
    }, []);

    const handleFilterModal = () => {
        setFilterModalOpen(true);
    }

    const deleteProductHandler = useCallback((id)=>{
        Alert.alert("Confirm", "Delete this product ?", [
            {text:"Cancel", onPress:()=>null},
            {text:"Yes", onPress:async()=>{
                try {
                    setUpdateLoading(true);
                    const {data} = await axios.delete(`${server}/product/single/${id}`,{withCredentials:true});
                    if(data.success){
                        setUpdateLoading(false);
                        setVisible(false);
                        Toast.show({type:"success", text1:data.message});
                        dispatch({type:"updateStateProducts", payload:{id}});
                    }
                } catch (error) {
                    setUpdateLoading(false);
                    Toast.show({
                        type:"error",
                        text1:error.response.data.message
                    });
                }
            }}
        ])
    }, []);

    const navigationHandler = (screenName, params) => {
        setVisible(false);
        navigation.navigate(screenName, params);
    }

    const updateFeature = useCallback((id) => {
        Alert.alert("Confirm", "Update this product ?", [
            {text:"Cancel", onPress:()=>null},
            {text:"Yes", onPress:async()=>{
                try {
                    setUpdateLoading(true);
                    const {data} = await axios.put(`${server}/product/togglefeature/${id}`,{withCredentials:true});
                    if(data.success){
                        setUpdateLoading(false);
                        setSelectedProduct({...selectedProduct, ["isFeatured"] : data.featured});
                        Toast.show({type:"success", text1:data.message});
                    }
                } catch (error) {
                    setUpdateLoading(false);
                    Toast.show({
                        type:"error",
                        text1:error.response.data.message
                    });
                }
            }}
        ])
    }, []);

    const searchProduct = async() => {
        let response = {products:[], totalProductsCount:0, page:1};
        let url = `${server}/product/admin?page=${page}&category=${category}&keyword=${searchQuery}&stock=${stockState}`;
        if(isSwitchOn){
            url = `${server}/product/admin?id=${searchId}`;
        }
        try {
            setSearchLoading(true);
            const {data} = await axios.get(url, {withCredentials:true});
            if(data.success) {
                response = data;
            }
            setSearchLoading(false);
        } catch (error) {
            setSearchLoading(false);
            Toast.show({type:"error", text1:error.response.data.message});
        }
        return response;
    }

    useEffectOnChange(() => {
        let timeOut = setTimeout(async() => {
            setPage(1);
            maxLoadedPage.current = 1;
            const data = await searchProduct();
            dispatch({type:"updateProductSearch", payload:data})
        }, 500);
        return () => {
            clearTimeout(timeOut);
        }
    }, [searchQuery]);

    useEffectOnChange(() => {
        //to prevent api call for already loaded data
        if(maxLoadedPage.current > page-1){
            return;
        }
        (async()=>{
            let data = await searchProduct();
            data.products = [...products,...data.products];
            dispatch({type:"updateProductSearch", payload:data});
            maxLoadedPage.current = data.page;
        })();
    }, [page]);

    const handleApplyFilter = async() => {
        setFilterModalOpen(false);
        const response = await searchProduct();
        setPage(1);
        maxLoadedPage.current = 1;
        dispatch({type:"updateProductSearch", payload:response});
    }

    const handleSwitchToggle = () => {
        setIsSwitchOn(!isSwitchOn);
    }

    const handleSearchById = async() => {
        if(searchId.trim() === ""){
            return Toast.show({type:"error", text1:"Product ID is required!!!"});
        }
        const response = await searchProduct();
        setPage(1);
        maxLoadedPage.current = 1;
        dispatch({type:"updateProductSearch", payload:response});
    }

    useEffect(() => {
      if(route.params?.stockState){
        handleApplyFilter();
      }
    }, []);
    

  return (
    <View style={defaultStyle}>
        <Header back={true} />
        <View style={{marginTop:verticalScale(25)}}/>   

        <View style={styles.searchView}>
            {
                isSwitchOn ? (
                    <View style={{width:"65%", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                        <Searchbar 
                            placeholder='Search by product ID'
                            style={{...styles.searchBox, width:"80%"}}
                            value={searchId}
                            onChangeText={(e) => setSearchId(e)}
                        />
                        <Button disabled={searchLoading} textColor={colors.color3} onPress={handleSearchById}>Search</Button>
                    </View>
                ) : (
                    <Searchbar 
                        placeholder='Search by product name'
                        onChangeText={(e)=>setSearchQuery(e)} 
                        value={searchQuery} 
                        style={styles.searchBox} 
                    />
                )
            }

            <View style={{width:"15%", justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontSize:moderateScale(10),}}>Search by ID</Text>
                <Switch
                    color={colors.color1}
                    value={isSwitchOn}
                    onValueChange={handleSwitchToggle}
                />
            </View>

            <TouchableOpacity disabled={isSwitchOn} onPress={handleFilterModal} style={{width:"20%"}} activeOpacity={0.8}>
                <Avatar.Icon 
                    color={colors.color3} 
                    size={moderateScale(50)} 
                    icon={"tune"} 
                    style={{...styles.filterIcon, backgroundColor:isSwitchOn ? colors.btnDisable : colors.color2}}/>
            </TouchableOpacity>
        </View>

        {searchLoading ? <Loader /> : 
            (products.length > 0)? 
                (<DataTable style={{marginTop:moderateScale(5)}}>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Price</DataTable.Title>
                        <DataTable.Title>Stock</DataTable.Title>
                        <DataTable.Title>Category</DataTable.Title>
                        <DataTable.Title>Action</DataTable.Title>
                    </DataTable.Header>

                    {products && products.slice(from, to).map((item) => (
                        <DataTable.Row key={item._id}>
                            <DataTable.Cell>{item.name}</DataTable.Cell>
                            <DataTable.Cell>{item.price}</DataTable.Cell>
                            <DataTable.Cell>{item.stock}</DataTable.Cell>
                            <DataTable.Cell>{item.category?.name}</DataTable.Cell>
                            <DataTable.Cell>
                                <TouchableOpacity 
                                    activeOpacity={0.6}
                                    onPress={() => actionHandler(item)}
                                >
                                    <Avatar.Icon color='#000' icon={"dots-vertical"} size={35} style={styles.verticalDots} />
                                </TouchableOpacity>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page-1}
                        numberOfPages={Math.ceil(totalProductsCount / limit)}
                        onPageChange={(page) => setPage(page+1)}
                        label={`On page ${page} of ${Math.ceil(totalProductsCount / limit)}`}
                        numberOfItemsPerPage={limit}
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>)
                : (
                    <View style={{alignItems:"center", marginTop:verticalScale(150)}}>
                        <Text style={{fontSize:moderateScale(35), color:colors.color3_light}}>Nothing to show</Text>
                    </View>
                )
        }

        <BottomModalMenu visible={visible} setVisible={setVisible} title={selectedProduct.name} >
            <View style={styles.menuCont}>
                {updateLoading && <ActivityIndicator size={"large"} color={colors.color1}/>}
                <MenuItem 
                    title='Edit' 
                    icon='pencil' 
                    disable={updateLoading} 
                    clickHandler={() => navigationHandler("Updateproduct", {id:selectedProduct._id})} 
                />

                <MenuItem 
                    title='Delete' 
                    icon='delete'
                    disable={updateLoading} 
                    clickHandler={() => deleteProductHandler(selectedProduct._id)} 
                />

                <MenuItem 
                    title={selectedProduct.isFeatured ? "Mark as Unfeatured" : "Mark as Featured"} 
                    icon='update' 
                    disable={updateLoading} 
                    clickHandler={() => updateFeature(selectedProduct._id)} 
                />

                <MenuItem 
                    title='See Reviews'
                    icon='comment-processing'
                    disable={updateLoading}
                    clickHandler={() => navigationHandler("Reviewscreen", {id:selectedProduct._id})}
                />
            </View>
        </BottomModalMenu>

        <BottomModalMenu visible={filterModalOpen} setVisible={setFilterModalOpen} title='Apply Filters'>
            <View style={{padding:moderateScale(5)}}>
                <Text style={styles.filterHeading}>Search by category</Text>
                <SearchByCategory 
                    categories={categories} 
                    category={category} 
                    setCategory={setCategory} 
                    style={{marginTop:0}}
                />
                <Text style={styles.filterHeading}>Search by stock</Text>
                <SearchByStock
                    state={stockState}
                    setState={setStockState}
                />

                <Button onPress={handleApplyFilter} textColor={colors.color3} style={styles.btnOutline}>Apply</Button>

            </View>
        </BottomModalMenu>
    </View>
  )
}

export default AdminProductList;

const MenuItem = ({
    title="", 
    icon="", 
    clickHandler=() => {}, 
    disable=false
}) => {
    return(
        <Menu.Item 
            style={{
                width:"100%",
                borderRadius:5,
                borderWidth:1,
                borderColor:colors.color3,
                marginVertical:verticalScale(5)
            }} 
            titleStyle={{fontSize:moderateScale(20)}}
            leadingIcon={icon} 
            title={title} 
            rippleColor={colors.color1} 
            onPress={clickHandler}
            disabled={disable}
        />
    )
}

const styles = StyleSheet.create({
    tableHeading:{
        backgroundColor:colors.color1,
        height:verticalScale(35),
        flexDirection:"row",
        alignItems:"center",
        padding:moderateScale(8),
        borderRadius:10,
        justifyContent:"space-between",
        marginBottom:verticalScale(8)
    },
    searchView:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    searchBox:{
        width:"65%",
        marginBottom:verticalScale(5), 
        backgroundColor:colors.color5,
    },
    filterIcon:{
        alignSelf:"center",
        elevation:10
    },
    headingText:{
        color:colors.color2,
        fontWeight:"900"
    },
    verticalDots:{
        backgroundColor:colors.color2,
    },
    menuCont:{
        marginTop:verticalScale(10),
        width:"100%",
        alignItems:"center",
        paddingBottom:verticalScale(10)
    },
    filterHeading:{
        fontSize:moderateScale(18), 
        alignSelf:"center"
    },
    btnOutline:{
        borderColor:colors.color1, 
        borderWidth:1,  
        width:"40%", 
        alignSelf:"center", 
        margin:moderateScale(5)
    }
});
