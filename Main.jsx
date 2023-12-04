import React, { useEffect } from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from './screens/Home';
import Productdetails from './screens/Productdetails';
import Toast from "react-native-toast-message";
import Cart from './screens/Cart';
import ConfirmOrder from './screens/ConfirmOrder';
import Payment from './screens/Payment';
import Login from './screens/Login';
import ForgetPassword from './screens/ForgetPassword';
import Verify from './screens/Verify';
import Signup from './screens/Signup';
import Profile from './screens/Profile';
import UpdateProfile from './screens/UpdateProfile';
import UpdatePassword from './screens/UpdatePassword';
import Orders from './screens/Orders';
import CameraComponent from './screens/CameraComponent';

import AdminPanel from './screens/Admins/AdminPanel';
import Category from './screens/Admins/Category';
import AdminOrders from './screens/Admins/AdminOrders';
import UpdateProduct from './screens/Admins/UpdateProduct';
import AddProduct from './screens/Admins/AddProduct';
import ManagesImages from './screens/Admins/ManagesImages';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/action/userAction';
import SearchedProduct from './screens/SearchedProduct';
import OrderDetails from './screens/OrderDetails';
import AdminProductList from './screens/Admins/AdminProductList';
import ReviewScreen from './screens/Admins/ReviewScreen';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

const Main = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch])
    
  return (
    <>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff" 
        />
    <NavigationContainer>
        <Stack.Navigator 
            initialRouteName='Home'
            screenOptions={{
                headerShown:false
            }}
        >
            <Stack.Group>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Productdetails' component={Productdetails} />
                <Stack.Screen name='Cart' component={Cart} />
                <Stack.Screen name='Confirmorder' component={ConfirmOrder} />
                <Stack.Screen name='Payment' component={Payment} />
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Forgetpassword' component={ForgetPassword} />
                <Stack.Screen name='Verify' component={Verify} />
                <Stack.Screen name='Signup' component={Signup} />
                <Stack.Screen name='Profile' component={Profile} />
                <Stack.Screen name='Updateprofile' component={UpdateProfile} />
                <Stack.Screen name='Updatepassword' component={UpdatePassword} />
                <Stack.Screen name='Orders' component={Orders} />
                <Stack.Screen name='Camera' component={CameraComponent} />
                <Stack.Screen name='Searchedproduct' component={SearchedProduct} />
                <Stack.Screen name='Orderdetails' component={OrderDetails} />

                {/* <Stack.Screen name='Alert' component={CustomAlert} /> */}

                {/* Admin Routes */}
                <Stack.Screen name='Adminpanel' component={AdminPanel} />
                <Stack.Screen name='Adminproductlist' component={AdminProductList} />
                <Stack.Screen name='Category' component={Category} />
                <Stack.Screen name='Adminorders' component={AdminOrders} />
                <Stack.Screen name='Updateproduct' component={UpdateProduct} />
                <Stack.Screen name='Addproduct' component={AddProduct} />
                <Stack.Screen name='Managesimages' component={ManagesImages} />
                <Stack.Screen name='Reviewscreen' component={ReviewScreen} />
            </Stack.Group>
        </Stack.Navigator>
        <Toast position='top' />
    </NavigationContainer>
    </>
  )
}

export default Main;
