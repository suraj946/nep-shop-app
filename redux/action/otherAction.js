import axios from "axios";
import { server } from "../store";

export const changePassword = (oldPassword, newPassword) => async(dispatch)=>{
    try {
        dispatch({type:"changePasswordRequest"});
        const {data} = await axios.put(`${server}/user/changepassword`, {oldPassword, newPassword}, {
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials:true
        });
        dispatch({type:"changePasswordSuccess", payload:data.message});       
    } catch (error) {
        dispatch({type:"changePasswordFail", payload:error.response.data.message});
    }
}

export const updateProfile = (dataToUpdate, cb) => async(dispatch)=>{
    try {
        dispatch({type:"changePasswordRequest"});
        const {data} = await axios.put(`${server}/user/updateprofile`, dataToUpdate, {
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials:true
        });
        cb(dataToUpdate);
        dispatch({type:"changePasswordSuccess", payload:data.message});       
    } catch (error) {
        dispatch({type:"changePasswordFail", payload:error.response.data.message});
    }
}

export const updateProfilePic = (formData, cb) => async(dispatch) => {
    try {
        dispatch({type:"updatePicRequest"});
        const {data} = await axios.put(`${server}/user/updatepic`, formData, {
            headers:{
                "Content-Type":"multipart/form-data"
            },
            withCredentials: true,
        });
        cb(data.avatarInfo);
        dispatch({type:"updatePicSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"updatePicFail", payload:error.response.data.message});
    }
}

export const placeOrder = (formData) => async(dispatch) => {
    try {
        dispatch({type:"placeOrderRequest"});
        const {data} = await axios.post(`${server}/order/new`, formData, {
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials: true,
        });
        dispatch({type:"placeOrderSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"placeOrderFail", payload:error.response.data.message});
    }
}