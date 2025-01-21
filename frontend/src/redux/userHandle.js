import axios from 'axios';
import {
    authError,
    authFailed,
    authRequest,
    authSuccess,
    customersListSuccess,
    getCustomersListFailed,
    getDeleteSuccess,
    getError,
    getFailed,
    getProductDetailsFailed,
    getProductsFailed,
    getRequest,
    getSearchFailed,
    getSellerProductsFailed,
    getSpecificProductsFailed,
    productDetailsSuccess,
    productSuccess,
    sellerProductSuccess,
    setFilteredProducts,
    specificProductSuccess,
    stuffAdded,
    stuffUpdated,
    updateCurrentUser,
    updateFailed,
} from './userSlice';

// Define the base URL for your backend server
const REACT_APP_BASE_URL = "https://localhost:5000";

// Auth User action
export const authUser = (fields, role, mode) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${role}${mode}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        }
        else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

// Add Stuff action
export const addStuff = (address, fields) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${address}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

// Update Stuff action
export const updateStuff = (fields, id, address) => async (dispatch) => {
    try {
        const result = await axios.put(`${REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(updateFailed(result.data.message));
        }
        else {
            dispatch(stuffUpdated());
        }

    } catch (error) {
        dispatch(getError(error));
    }
};

// Delete Stuff action
export const deleteStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Update Customer action
export const updateCustomer = (fields, id) => async (dispatch) => {
    dispatch(updateCurrentUser(fields));

    const newFields = { ...fields };
    delete newFields.token;

    try {
        await axios.put(`${REACT_APP_BASE_URL}/CustomerUpdate/${id}`, newFields, {
            headers: { 'Content-Type': 'application/json' },
        });

        dispatch(stuffUpdated());

    } catch (error) {
        dispatch(getError(error));
    }
};

// Get Products by Seller action
export const getProductsbySeller = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/getSellerProducts/${id}`);
        if (result.data.message) {
            dispatch(getSellerProductsFailed(result.data.message));
        }
        else {
            dispatch(sellerProductSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Get Products action
export const getProducts = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/getProducts`);
        if (result.data.message) {
            dispatch(getProductsFailed(result.data.message));
        }
        else {
            dispatch(productSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Get Product Details action
export const getProductDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/getProductDetail/${id}`);
        if (result.data.message) {
            dispatch(getProductDetailsFailed(result.data.message));
        }
        else {
            dispatch(productDetailsSuccess(result.data));
        }

    } catch (error) {
        dispatch(getError(error));
    }
};

// Get Customers action
export const getCustomers = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getCustomersListFailed(result.data.message));
        }
        else {
            dispatch(customersListSuccess(result.data));
        }

    } catch (error) {
        dispatch(getError(error));
    }
};

// Get Specific Products action
export const getSpecificProducts = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getSpecificProductsFailed(result.data.message));
        }
        else {
            dispatch(specificProductSuccess(result.data));
        }

    } catch (error) {
        dispatch(getError(error));
    }
};

// Get Searched Products action
export const getSearchedProducts = (address, key) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${key}`);
        if (result.data.message) {
            dispatch(getSearchFailed(result.data.message));
        }
        else {
            dispatch(setFilteredProducts(result.data));
        }

    } catch (error) {
        dispatch(getError(error));
    }
};
