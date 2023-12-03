import {createReducer} from "@reduxjs/toolkit";

export const cartReducer = createReducer({
    cartItems:[]
}, (builder) => {
    builder
    .addCase("addToCart", (state, action)=>{
        const item = action.payload;
        const isExistIndex = state.cartItems.findIndex(i => i.product === item.product);
        if(isExistIndex !== -1){
            state.cartItems[isExistIndex].quantity = item.quantity;
        }else state.cartItems.push(item);
    })
    .addCase("updateQuantity", (state, action)=>{
        const productIndex = state.cartItems.findIndex(i => i.product === action.payload.product);
        if(productIndex !== -1){
            state.cartItems[productIndex].quantity = action.payload.quantity;
        }
    })
    .addCase("removeFromCart", (state, action) => {
        const id = action.payload;
        state.cartItems = state.cartItems.filter(i => i.product !== id);
    })
    .addCase("clearCart", (state) => {
        state.cartItems = [];
    });
});
