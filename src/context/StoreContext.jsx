import { createContext, useEffect, useRef, useState } from "react";
import { getBlockedContactsData, getContactsData, getUserData, unblockContact } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { connectSocket, sendChatOffStatus, sendChatStatus, stompDisconnect } from "../services/webSocketService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const [token,setToken] = useState('');
    const [user,setUser] = useState({});
    const [loading,setLoading] = useState(true);
    const [chatPageActive,setChatPageActive] = useState(false);
    const [chatPageActiveUser,setChatPageActiveUser] = useState({});
    const [contacts,setContacts] = useState([]);
    const [options,setOptions] = useState('');
    const [selectedMessage,setSelectedMessage] = useState({});
    const [contactProfile,setContactProfile] = useState({});
    const [viewContactProfile,setViewContactProfile] = useState(false);
    const [chatProfile,setChatProfile] = useState({});
    const [viewChatProfile,setViewChatProfile] = useState(false);
    const [blockedContactsData,setBlockedContactsData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
      useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
        }, []);

    const logout = () => {
        setToken(null);
        setUser({});
        setChatPageActive(false);
        setChatPageActiveUser({});
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        stompDisconnect();
    };

    const loadUserData = async () => {
        try{
            const userData = await getUserData();
            setUser(userData);
        }
        finally{
            setLoading(false);
        }
    };

    const unBlockContact = async (contactId) => {
        try {
            const response = await unblockContact(contactId);
            if(response.status === 200){
                setUser(prev => ({
                    ...prev,
                    contacts: [...prev.contacts,response.data],
                    blockedContacts: prev.blockedContacts.filter(contact => contact !== response.data.id)
                }))
            }
        } catch (error) {
            console.log(error);
        }
    }
    const contextValue = {
        token,
        setToken,
        width,
        setWidth,
        user,
        setUser,
        loadUserData,
        logout,
        loading,
        chatPageActive,
        setChatPageActive,
        chatPageActiveUser,
        setChatPageActiveUser,
        contacts,
        setContacts,
        options,
        setOptions,
        selectedMessage,
        setSelectedMessage,
        contactProfile,
        setContactProfile,
        viewContactProfile,
        setViewContactProfile,
        chatProfile,
        setChatProfile,
        viewChatProfile,
        setViewChatProfile,
        blockedContactsData,
        setBlockedContactsData,
        unBlockContact
    };
    const isTokenExpired = (jwt)=>{
        try{
        const decoded = jwtDecode(jwt);
        return decoded.exp*1000 < Date.now();
        }
        catch(error){
        return true;
        }
    }

    useEffect(() => {
        setChatPageActiveUser(prev => {

            if (!prev?.id) {
                return prev;
            }

            const updatedContact =
                contacts.find(
                    contact => contact.id === prev.id
                );

            return updatedContact || prev;
        });

    }, [contacts]);
    useEffect(()=>{
        const loggedInUserContactsData = async () => {
            try {
                const response = await getContactsData();
                setContacts(response);
            } catch (error) {
                console.log(error);
            }
        }
        const loggedInUserBlockedContactsData = async () => {
            try {
                const response = await getBlockedContactsData();
                setBlockedContactsData(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        if(user.id){
            setContactProfile({});
            loggedInUserContactsData();
            loggedInUserBlockedContactsData();
        }
    },[user]);
    useEffect(() => {

    if (!user?.id) {
        return;
    }
    connectSocket(
        user.id,

        (message) => {
            if(message.senderId === chatPageActiveUser?.id && message.seen !=="seen"){
                message.seen = "seen";
                sendChatStatus({senderId:chatPageActiveUser.id,receiverId:user.id});
                setContacts(prev =>
                prev.map(contact =>
                    contact.id === message.senderId
                        ? {
                            ...contact,
                            messages: [
                                ...(contact.messages || []),
                                message
                            ],
                            currentChat: true
                        }
                        : contact
                )
            );
            return;
            }
                    setContacts(prev =>
            prev.map(contact =>
                contact.id === message.senderId
                    ? {
                        ...contact,
                        messages: [
                            ...(contact.messages || []),
                            message
                        ]
                    }
                    : contact
            )
        );
        },
        (contact) => {
            contact.currentChat=true;
            setContacts(prev => [...prev,contact]);
        },
        (receiverId) => {
                    setContacts(prev =>
            prev.map(contact =>
                contact.id === receiverId
                    ? {
                        ...contact,
                        messages: contact.messages.map(message => message.receiverId=== receiverId ? {...message,seen:"seen"}:message)
                        ,currentChat: true
                    }
                    : contact
            )
        );
        },
        (receiverId) => {
                    setContacts(prev =>
            prev.map(contact =>
                contact.id === receiverId
                    ? {
                        ...contact,
                        messages: contact.messages.map(message => message.receiverId=== receiverId ? {...message,seen:"seen"}:message)
                        ,currentChat: false
                    }
                    : contact
            )
        );
        },

        (status) => {
        setContacts(prev =>
        prev.map(contact => {
                if (contact.id !== status.id) {
                    return contact;
                }

                return {
                    ...contact,
                    online: status.online,
                    currentChat:false,
                    messages: contact.messages?.map(message =>
                        message.receiverId === status.id
                            ? {
                                ...message,
                                seen: message.seen==="offline"?"online":message.seen
                            }
                            : message
                    )
                };
            })
        );
        },

        (entity) => {
                    setContacts(prev =>
            prev.map(contact =>
                contact.id === entity.senderId
                    ? {
                        ...contact,
                        messages: contact.messages.map(message => message.id === entity.id ? entity:message)
                    }
                    : contact
            )
        );
        },
        (message)=>{
            setContacts(prev =>
            prev.map(contact =>
                contact.id === message.receiverId
                    ? {
                        ...contact,
                        messages: [
                            ...(contact.messages || []),
                            message
                        ]
                    }
                    : contact
            )
        );
        },
        (entity) => {
                    setContacts(prev =>
            prev.map(contact =>
                contact.id === entity.receiverId
                    ? {
                        ...contact,
                        messages: contact.messages.map(message => message.id === entity.id ? entity:message)
                    }
                    : contact
            )
        );
        },
        (entity) => {
         setContacts(prev => prev.map(
            contact => contact.id === entity.receiverId ?
            {
                ...contact,
                messages:contact.messages.filter(message => message.id !== entity.id)
            }:
            contact
         ))   
        },
        (entity) => {
         setContacts(prev => prev.map(
            contact => contact.id === entity.senderId ?
            {
                ...contact,
                messages:contact.messages.filter(message => message.id !== entity.id)
            }:
            contact
         ))   
        },
        (updatedContact) => {
            setContacts(prev => prev.map(contact => contact.id === updatedContact.id ? {...contact,name:updatedContact.name,url:updatedContact.url,language:updatedContact.language,code:updatedContact.language,uid:updatedContact.uid}:contact));
        } 
    );

    return () => {
        stompDisconnect();
    };

}, [user.id]);
    useEffect(()=>{
        const jwtToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const loadUserData = async () => {
            try{
                const userData = await getUserData();
                setUser(userData);
            }
            finally{
                setLoading(false);
            }
        }
        if(jwtToken)
        loadUserData();
    },[token]);
    useEffect(()=>{
        const jwtToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if(isTokenExpired(jwtToken)){
            logout();
            return;
        }
        if(jwtToken){
            setToken(jwtToken);
        }
    },[]);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};