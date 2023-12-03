import { useSelector } from "react-redux";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useEffect } from "react";
import axios from "axios";
import {server} from "../redux/store";
import { useState, useRef } from "react";

export const useMessageErrUser = (navigation, dispatch, path="Profile", data={}) => {
  const {loading, message, error} = useSelector(state => state.user);
  useEffect(() => {
      if(error){
        Toast.show({type:"error", text1:error});
        dispatch({type:"clearError"});
      }
      if(message){
        navigation.reset({
          index:0,
          routes:[{name:"Home"},{name:path, params:{...data}}]
        });
        Toast.show({type:"success", text1:path === "Payment" ? "Login success procceed to place order now" : message});
        dispatch({type:"clearMessage"});
      }
  }, [error, message, dispatch]);
  return loading;
}

export const useMessageErrOther = (dispatch, navigation, path, func) => {
  const {loading, message, error} = useSelector(state => state.other);
  useEffect(() => {
      if(error){
        Toast.show({type:"error", text1:error});
        dispatch({type:"clearError"});
      }
      if(message){
        Toast.show({type:"success", text1:message});
        dispatch({type:"clearMessage"});
        // if getting any navigation issue with otherActions look here as well 
        // navigation && navigation.navigate(path);
        navigation && navigation.reset({
          index:0,
          routes:[{name:"Home"},{name:path}]
        });
        func && dispatch(func());
      }
  }, [error, message, dispatch]);
  return loading;
}

export const useMessageErrProduct = (dispatch, navigation, path) => {
  const {loading, message, error} = useSelector(state => state.product);
  useEffect(() => {
      if(error){
        Toast.show({type:"error", text1:error});
        dispatch({type:"clearError"});
      }
      if(message){
        navigation && navigation.navigate(path);
        Toast.show({type:"success", text1:message});
        dispatch({type:"clearMessage"});
      }
  }, [error, message, dispatch]);
  return loading;
}

export const useGetOrders = (setOrders, status = "", isAdmin=false) => {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    axios.get(`${server}/order/${isAdmin ? "admin" : "my"}?status=${status === "All" ? "" : status}`, {signal:abortControllerRef.current?.signal})
    .then((res)=>{
      setOrders(res.data.orders);
      setLoading(false);
    })
    .catch((err)=>{
      if(err.name !== "CanceledError"){
        Toast.show({type:"error", text1:err.response.data.message});
      }
      setLoading(false);
    })

    return () => abortControllerRef.current?.abort();
  }, [status]);
  return loading;
}

export const useErrorMessage = (error, message, setError, setMessage) => {
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
}

export const useEffectOnChange = (func, deps = []) => {
  const initialRender = useRef(true);
  useEffect(()=>{
    if(initialRender.current){
      initialRender.current = false;
      return;
    }
    const cleanupFunc = func();

    return () => {
      if(typeof cleanupFunc === "function"){
        cleanupFunc();
      }
    } 
  }, deps);
}