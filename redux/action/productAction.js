import {server} from "../store";
import axios from "axios";

export const getAdminDetails = () => async(dispatch) => {
    try {
        dispatch({type:"getAdminDetailsRequest"});
        const [{data:products}, {data:updates}] = await Promise.all([
            axios.get(`${server}/product/admin`, {withCredentials:true}),
            axios.get(`${server}/product/getupdates`, {withCredentials:true}),
        ]);
        dispatch({type:"getAdminDetailsSuccess", payload:{products, updates}});
    } catch (error) {
        dispatch({type:"getAdminDetailsFail", payload:error.response.data.message});
    }
}

export const getSingleProductDetails = (id) => async(dispatch) => {
    try {
        dispatch({type:"getProductDetailsRequest"});
        const {data} = await axios.get(`${server}/product/single/${id}`);
        dispatch({type:"getProductDetailsSuccess", payload:data.product});
    } catch (error) {
        dispatch({type:"getProductDetailsFail", payload:error.response.data.message});
    }
}

export const getAllCategories = () => async(dispatch) => {
    try {
        dispatch({type:"getCategoriesRequest"});
        const {data} = await axios.get(`${server}/product/categories`, {withCredentials:true});
        dispatch({type:"getCategoriesSuccess", payload:data.categories});
    } catch (error) {
        dispatch({type:"getCategoriesFail", payload:error.response.data.message});
    }
}
