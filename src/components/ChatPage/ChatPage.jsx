import React, { useContext, useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import loginImg from '../../assets/login.png';
import { StoreContext } from '../../context/StoreContext';
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import { connectSocket, deleteForEveryone, deleteForMeFromReceiver, deleteForMeFromSender, sendChatOffStatus, sendMessage, updateMessage } from '../../services/webSocketService';
import { getMessages } from '../../services/messageService';
import ChatProfile from '../ChatProfile/ChatProfile';
import { formatTimestamp } from '../../services/userService';

const ChatPage = () => {
  const {user,width,setWidth,chatProfile,viewChatProfile,setViewContactProfile,setViewChatProfile,setChatProfile,contacts,setContacts,chatPageActive,setChatPageActive,setSelectedMessage,chatPageActiveUser,options,setOptions,selectedMessage,setContactProfile} = useContext(StoreContext);
  const senderId = user.id;
  const receiverId = useRef(chatPageActiveUser.id);
  const [messages,setMessages] = useState([]);
  const updateStatus = useRef(false);
  const [text,setText] = useState("");
  const [del,setDel] = useState(false);

  useEffect(()=>{
    if(!chatPageActive){
      setChatPageActiveUser({});
    }
  },[chatPageActive]);
  useEffect(()=>{
    receiverId.current = chatPageActiveUser.id;
  },[chatPageActiveUser]);
  useEffect(()=>{
            setContacts(prev =>
            prev.map(contact =>
                contact.id === chatPageActiveUser.id
                    ? {
                        ...contact,
                        messages: contact.messages.map(message => message.receiverId=== user.id ? {...message,seen:"seen"}:message)
                        ,currentChat: false
                    }
                    : contact
            )
  )},[]);
  useEffect(()=>{
    if(chatPageActiveUser.id)
    setMessages(chatPageActiveUser.messages);
  },[chatPageActiveUser]);
  const loadMessages = async () => {
    try {
      if(receiverId){
      const response = await getMessages(receiverId);
      setMessages(response);}
    } catch (error) {
      console.log(error);
    }
  };
 
  const onChangeHandler = (event) => {
    setText(event.target.value);
  }
  const handleRightClick = (e) => {
    e.preventDefault();
    setShowMenu();
  }
  const handleSend = () => {
        if(updateStatus.current){
          const message = {
              id: selectedMessage.id,
              senderId: senderId,
              receiverId: receiverId.current,
              senderMsg: text,
              seen: selectedMessage.seen,
              timestamp:selectedMessage.timestamp,
          };
          message.edited = true;
          updateMessage(message);
          updateStatus.current = false;
          setOptions(false);
          setSelectedMessage({});
          return;
        }
        var seen;
        if(chatPageActiveUser.online){
          if(chatPageActiveUser.currentChat){
            seen = "seen";
          }
          else{
            seen = "online";
          }
        }
        else{
          seen = "offline";
        }
        const message = {
            senderId: senderId,
            receiverId: receiverId.current,
            senderMsg: text,
            seen: seen
        };
        sendMessage(message);
        setText("");
    };
    const handleChatPageClose = () => {
      sendChatOffStatus({senderId:chatPageActiveUser.id,receiverId:user.id});
      setContacts(prev =>
            prev.map(contact =>
                contact.id === chatPageActiveUser.id
                    ? {
                        ...contact,
                        currentChat: false
                    }
                    : contact
            )
      );
      setOptions("");
      setTimeout(() => {
          setChatPageActive(false);
      }, 100);
    }
    const handleUpdate = () => {
      setText(selectedMessage.senderMsg);
      updateStatus.current = true;
    }
    const handleDeleteForEveryone = () => {
      deleteForEveryone(selectedMessage.id);
      setDel(false);
      setOptions("");
      setSelectedMessage({});
    }
    const handleDeleteForMe = () => {
      if(options === "send"){
        deleteForMeFromSender(selectedMessage.id);
      }
      else if(options === "received"){
        deleteForMeFromReceiver(selectedMessage.id);
      }
      setDel(false);
      setOptions("");
      setSelectedMessage({});
    }
  return (
    <div className='chat-page d-flex flex-column'>
      { del &&
        <div className='delete-modal-overlay'>
          <div className='delete-modal'>
            <small className='text-secondary'>Delete message?</small>
            <div className='d-flex flex-column gap-2 ms-auto' style={{fontSize:"13px",color:"rgb(6, 205, 99)"}}>
              <small className='del' onClick={handleDeleteForMe}>Delete for me</small>
              {options === "send" && <small className='del' onClick={handleDeleteForEveryone}>Delete for everyone</small>}
              <small className='del' onClick={()=>{setDel(false)}}>cancel</small>
            </div>
          </div>
        </div>
      }
      <div className={Object.keys(chatProfile).length !== 0 && width < 791 ? "overlay":"d-none"}>
              <div className='chatImgProfile d-flex flex-column'>
                <i className='bi bi-x-lg fs-4 p-2 ms-auto xc' style={{WebkitTextStroke:"0.5px currentColor",color:"rgb(2, 233, 156)"}} onClick={() => setChatProfile({})}></i>
                <img src={chatProfile.url} alt={chatProfile.name} className='chatImg'/>
                <button className='view-contact-profile' onClick={() => setViewChatProfile(true)}>View Profile</button>
              </div>
      </div>
      {viewChatProfile && width <791 && <ChatProfile />}
      <div className='chat-page-header d-flex px-2 align-items-center gap-2'>
        <div>
            <img src={chatPageActiveUser.url} alt={chatPageActiveUser.name} className='chat-profile-pic rounded-circle' onClick={() => {setContactProfile({});setViewContactProfile(false);setChatProfile(chatPageActiveUser)}}/>
        </div>
        <div>
            <h6 className='fw-bold p-0 m-0'>{chatPageActiveUser.name}</h6>
            <small className='online-status' style={{color:"rgb(8, 240, 163)"}}>{chatPageActiveUser.online?"Online":(<small className='text-dark'>last seen: {formatTimestamp(chatPageActiveUser.lastSeen)}</small>)}</small>
        </div>
        {options === "send" && 
        <div className='d-flex ms-auto gap-3'>
          <i className='bi bi-pencil fs-4' style={{color:"rgb(8, 240, 163)",WebkitTextStroke:"0.3px currentColor"}} onClick={handleUpdate}></i>
          <i className='bi bi-trash fs-3 text-danger' style={{WebkitTextStroke:"0.3px currentColor"}} onClick={()=>setDel(true)}></i>
        </div> 
        }
        {options ==="received" && 
        <div className='d-flex ms-auto gap-3'>
          <i className='bi bi-trash fs-3 text-danger' style={{WebkitTextStroke:"0.3px currentColor"}} onClick={()=>setDel(true)}></i>
        </div>
        }
        {options === "" && <i className='bi bi-arrow-left fs-3 ms-auto' style={{color:"rgb(8, 240, 163)",WebkitTextStroke:"0.3px currentColor"}} onClick={handleChatPageClose}></i>}
      </div>
      <MessagesContainer messages={messages}/>
      <div className='input-section d-flex align-items-center justify-content-center'>
        <div className='d-flex justify-content-center align-items-center gap-3 rounded-pill msg-bar' style={{width:"95%"}}>
            <textarea className='input-bar' value={text} onChange={onChangeHandler}/>
            <i className='bi bi-send-fill fs-4 msg-send-icon ms-autotext-white rounded-circle text-white' onClick={handleSend}></i>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
