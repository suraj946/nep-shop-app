import {createReducer} from "@reduxjs/toolkit";

export const productReducer = createReducer({
    featuredProducts:[],
    newArrivalProducts:[],
    trendingProducts:[],
    highDiscountProducts:[],
    product:{},
    categories:[]
}, (builder)=>{
    builder
    .addCase("getHomeProductsRequest", (state)=>{
        state.loading = true;
    })
    .addCase("getProductDetailsRequest", (state)=>{
        state.loading = true;
    })
    .addCase("getHomeProductsSuccess", (state, action)=>{
        state.loading = false;
        state.featuredProducts = action.payload.featuredProducts;
        state.newArrivalProducts = action.payload.newArrivalProducts;
        state.trendingProducts = action.payload.highRatingProducts;
        state.highDiscountProducts = action.payload.highDiscountProducts;
    })
    .addCase("getProductDetailsSuccess", (state, action)=>{
        state.loading = false;
        state.product = action.payload;
    })
    .addCase("getHomeProductsFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("getProductDetailsFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("getCategoriesRequest", (state)=>{
        state.loading = true;
    })
    .addCase("getCategoriesSuccess", (state, action)=>{
        state.loading = false;
        state.categories = action.payload;
    })
    .addCase("getCategoriesFail", (state)=>{
        state.loading = fasle;
        state.error = action.payload;
    });

    builder
    .addCase("clearError", (state)=>{
        state.error = null;
    })
    .addCase("clearMessage", (state)=>{
        state.message = null;
    })
});

export const adminProductReducer = createReducer({}, (builder)=>{
    builder
    .addCase("getAdminDetailsRequest", (state)=>{
        state.loading = true;
    })
    .addCase("getAdminDetailsSuccess", (state, {payload})=>{
        state.loading = false,
        state.products = payload.products.products;
        state.totalProductsCount = payload.products.totalProductsCount;

        state.inStock = payload.updates.inStock;
        state.outOfStock = payload.updates.outOfStock;
        state.lessThanFive = payload.updates.lessThanFive;
        state.newOrder = payload.updates.newOrder;
    })
    .addCase("updateProductSearch", (state, {payload}) => {
        state.products = payload.products;
        state.totalProductsCount = payload.totalProductsCount;
    })
    .addCase("getAdminDetailsFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("updateStateProducts", (state, action)=>{
        state.products = state.products.filter(i => i._id !== action.payload.id);
    })
    .addCase("clearError", (state) => {
        state.error = null;
    })
})