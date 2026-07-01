import React, { useContext, useState } from 'react';
import "./ChatProfile.css"
import { StoreContext } from '../../context/StoreContext';
import { blockContact, deleteAllMessages, deleteContactAndMessages, formatTimestamp, removeContact } from '../../services/userService';
import { sendChatOffStatus } from '../../services/webSocketService';

const ChatProfile = () => {
    const {user,setUser,setContacts,chatProfile,setChatProfile,viewChatProfile,setViewChatProfile,chatPageActiveUser,setChatPageActive} = useContext(StoreContext);
    const [deleteOption,setDeleteOption] = useState(false);
    const [blockOption,setBlockOption] = useState(false);

    const handleDeleteContact = async () => {
        try{
            const response = await removeContact(chatProfile.id);
            if(response.status === 200){
                sendChatOffStatus({senderId:chatPageActiveUser.id,receiverId:user.id});
                setUser(prev => ({...prev,contacts:prev.contacts.filter(contact => contact !== chatProfile.id)}));
                setChatPageActive(false);
                setViewChatProfile(false);
                setChatProfile({});
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const handleDeleteAllMessages = async () => {
        try{
            const response = await deleteAllMessages(chatProfile.id);
            if(response.status === 200){
                setContacts(prev => prev.map(contact => contact.id === chatProfile.id ? {...contact,messages:[]}:contact));
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const handleDeleteContactAndMessages = async () => {
        try {
            const response = await deleteContactAndMessages(chatProfile.id);
            if(response.status === 200){
                sendChatOffStatus({senderId:chatPageActiveUser.id,receiverId:user.id});
                setUser(prev => ({...prev,contacts:prev.contacts.filter(contact => contact !== chatProfile.id)}));
                setChatPageActive(false);
                setViewChatProfile(false);
                setChatProfile({});
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleBlockContact = async () => {
        const response = await blockContact(chatProfile.id);
        try {
            setUser(prev => ({...prev,contacts:prev.contacts.filter(contact => contact !== contactProfile.id),blockedContacts:[prev.blockedContacts,contactProfile.id]}));
            setChatPageActive(false);
            setViewChatProfile(false);
            setChatProfile({});
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className={viewChatProfile?"ch-overlay":"d-none"}>
      <div className='d-flex flex-column gap-2 align-items-center'>
        <i className='bi bi-arrow-left ms-auto me-2 mt-2 fs-3 rc' style={{color:"rgb(8, 240, 163)",WebkitTextStroke:"0.3px currentColor"}} onClick={() => setViewChatProfile(false)}></i>
        <div className='d-flex flex-column gap-1 align-items-center' style={{width:'100%'}}>
                <img src={chatProfile.url} alt={chatProfile.name} className='chat-profile-img rounded-circle'/>
                <h5 className='fw-bold'>{chatProfile.name}</h5>
                <small className='online-status' style={{color:"rgb(8, 240, 163)"}}>{chatProfile.online?"Online":(<small className='text-dark'>last seen: {formatTimestamp(chatProfile.lastSeen)}</small>)}</small>
        </div>
        <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
            <div className='d-flex gap-3 ch-box' style={{width:'90%'}}>
                <i className='bi bi-person fs-4 ch-icon rounded-circle px-2 pt-1 mt-1'></i>
                <div>
                    <small className='text-secondary'>Name</small>
                    <h6>{chatProfile.name}</h6>
                </div>
            </div>
        </div>
        <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
            <div className='d-flex gap-3 ch-box' style={{width:'90%'}}>
                <i className='bi bi-at fs-4 ch-icon rounded-circle px-2 pt-1 mt-1'></i>
                <div>
                    <small className='text-secondary'>Uid</small>
                    <h6>{chatProfile.uid}</h6>
                </div>
            </div>
        </div>
        <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
            <div className='d-flex gap-3 ch-box' style={{width:'90%'}}>
                <i className='bi bi-globe fs-4 ch-icon rounded-circle px-2 pt-1 mt-1'></i>
                <div>
                    <small className='text-secondary'>Language</small>
                    <h6>{chatProfile.language}</h6>
                </div>
            </div>
        </div>
        <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
            <div className='d-flex gap-3 ch-box' style={{width:'90%'}}>
                <i className='bi bi-trash fs-4 dh-icon rounded-circle px-2 pt-1 mt-1'></i>
                <div>
                    <small className='text-danger fs-6'>Delete Contact</small>
                    <small className='d-block text-secondary' style={{fontSize:"10px"}}>Delete this contact and all the messages in this chat</small>
                </div>
                <i className='bi bi-chevron-right fs-5 mt-3 text-secondary' style={{WebkitTextStroke: "0.5px currentColor"}} onClick={() => {setDeleteOption(true);setBlockOption(false)}}></i>
            </div>
        </div>
        <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
            <div className='d-flex gap-3 ch-box' style={{width:'90%'}}>
                <i className='bi bi-person-slash fs-4 dh-icon rounded-circle px-2 pt-1 mt-1'></i>
                <div>
                    <small className='text-danger fs-6'>Block Contact</small>
                    <small className='d-block text-secondary' style={{fontSize:"10px"}}>You won't receive messages from this contact</small>
                </div>
                <i className='bi bi-chevron-right fs-5 mt-3 text-secondary' style={{WebkitTextStroke: "0.5px currentColor"}} onClick={() => {setBlockOption(true);setDeleteOption(false)}}></i>
            </div>
        </div>
      </div>
      {deleteOption && <div className='delete-option p-3 py-4 d-flex flex-column gap-4'>
        <small className='text-secondary'>Delete contact?</small>
        <div className='d-flex flex-column ms-auto gap-1' style={{color:"red"}}>
            <small className='do' onClick={handleDeleteContact}>Delete contact</small>
            <small className='do' onClick={handleDeleteAllMessages}>Delete all messages</small>
            <small className='do' onClick={handleDeleteContactAndMessages}>Delete contact and messages</small>
            <small className='do' onClick={() => setDeleteOption(false)}>cancel</small>
        </div>
      </div>}

      {blockOption && <div className='block-option p-3 py-4 d-flex flex-column gap-4'>
        <small className='text-secondary'>Block contact?</small>
        <div className='d-flex flex-column ms-auto gap-1' style={{color:"red"}}>
            <small className='bo' onClick={handleBlockContact}>Block contact</small>
            <small className='bo' onClick={() => setBlockOption(false)}>cancel</small>
        </div>
      </div>}
    </div>
  );
};

export default ChatProfile;
