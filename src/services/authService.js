import axios from "axios";

const API_URL = 'https://chatter-back-end-api.onrender.com';

export const registerFunction = async (data)=>{
    try {
        const response = await axios.post(API_URL+'/api/register',data);
        return response;
    } catch (error) {
        throw new Error("Error while registration,Please try again!");
    }
}

export const loginFunction = async (data)=>{
    try {
        const response = await axios.post(API_URL+'/api/login',data);
        return response;
    } catch (error) {
        throw new Error("Error while Login,Please try again!");
    }
}