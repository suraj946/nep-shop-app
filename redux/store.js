import {configureStore} from "@reduxjs/toolkit";
import { userReducer } from "./reducer/userReducer";
import { otherReducer } from "./reducer/otherReducer";
import { adminProductReducer, productReducer } from "./reducer/productReducer";
import { cartReducer } from "./reducer/cartReducer";

export const store = configureStore({
    reducer:{
        user:userReducer,
        other:otherReducer,
        product:productReducer,
        cart:cartReducer,
        adminProduct:adminProductReducer
    }
});


export const server = "https://nep-shop.vercel.app/api/v1";
// export const server = "http://192.168.1.72:5000/api/v1";
// export const server = "http://192.168.1.122:5000/api/v1";// college
