import axios from "axios";
import api from "../config/config";

const API_URL = 'https://chatter-back-end-api.onrender.com';

export const getUserData = async () => {
    var token;
    if(localStorage.getItem("token"))
    {
        token = localStorage.getItem("token");
    }
    else{
        token = sessionStorage.getItem("token");
    }
    try {
        const response = await axios.get(API_URL+'/api/user',{
            headers:{
                Authorization: 'Bearer '+token
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Error while retrieving user");
    }
};

export const updateUser = async(userInfo) => {
    try {
        const response = await api.put('/update',userInfo);
        return response;
    } catch (error) {
        throw new Error("Error while updating the user"+error);
    }
}

export const searchUser = async(input) => {
    try {
        const response = await api.get('/getUser',{params:{input}});
        return response;
    } catch (error) {
        throw new Error("User not found");
    }
}

//addContact
export const addContact = async(uid) => {
    try {
        const response = await api.post('/addContact',{"uid":uid});
        return response;
    } catch (error) {
        console.log("Error while adding contact. "+error);
    }
}

//verifyUid
export const verifyUID = async(uid) => {
    try{
        const response = await api.get("/verifyUid",{
            params:{uid}
        });
        console.log(response)
        return response.data;
    }
    catch(error){
        throw new Error(error);
    }
}

export const getUserById = async (id)=> {
    try {
        const response = await api.get("/getById",{
            params:{id}
        });
        return response.data;
    } catch (error) {
        throw new Error("User not found");
    }
}

export const removeContact = async (contactId) => {
    try {
        const response = await api.put("/removeContact",null,{
            params:{contactId}
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteAllMessages = async (contactId) => {
    try {
        const response = await api.put("/deleteAllMessages",null,{
            params:{contactId}
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteContactAndMessages = async (contactId) => {
    try {
        const response = await api.put("/deleteContactAndMessages",null,{
            params:{contactId}
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export const getContactsData = async ()=> {
    try {
        const response = await api.get("/loggedInUserContacts");
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const blockContact = async (contactId) => {
    try{
        const response = await api.put("/blockContact",null,{
            params:{contactId}
        });
        return response;
    } catch(error){
        throw new Error(error);
    }
}

export const getBlockedContactsData = async () => {
    try {
        const response = await api.get("/getBlockedContactsData");
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export const unblockContact = async (contactId) => {
    try{
        const response = await api.put("/unblockContact",null,{
            params:{contactId}
        });
        return response;
    } catch(error){
        throw new Error(error);
    }
}
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  // Format time (e.g., 10:30 AM)
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Current date -> only time
  if (isSameDay) {
    return time;
  }

  // Yesterday -> Yesterday, time
  if (isYesterday) {
    return `Yesterday, ${time}`;
  }

  // Same year -> DD MMM
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  }

  // Different year -> DD MMM YYYY
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}