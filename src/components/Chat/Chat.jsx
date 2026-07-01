import React, { useContext, useEffect, useState } from 'react';
import './Chat.css';
import sample from '../../assets/login.png';
import { StoreContext } from '../../context/StoreContext';

const Chat = (props) => {
  const {user,setChatPageActive,setChatPageActiveUser,contacts,setContactProfile} = useContext(StoreContext);
  var message = {};
  var count = 0;
  const emptyMsg = <div className='text-secondary'>
    <i className='bi bi-slash-circle me-1' style={{WebkitTextStroke:"0.5px currentColor"}}></i> This message was deleted.
  </div>;

  props?.chat?.messages.map(msg => {
    if(msg.seen !== "seen" && msg.receiverId === user.id){
      if(count === 0){
        message = msg;
      }
      count++;
    }
  });
  if(count === 0){
    message = props?.chat?.messages[props?.chat?.messages.length - 1];
  }
  const truncateText = (text) => {
  return text?.length > 30
    ? text?.slice(0, 30) + "..."
    : text;
}
   const getDateLabel = (timestamp) => {
      const time = new Date(timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
      const messageDate =
          new Date(timestamp);

      const today =
          new Date();

      const yesterday =
          new Date();

      yesterday.setDate(
          today.getDate() - 1
      );
      if (
          messageDate.toDateString() ===
          today.toDateString()
      ) {
          return time;
      }

      if (
          messageDate.toDateString() ===
          yesterday.toDateString()
      ) {
          return "Yesterday";
      }
      if(messageDate.getFullYear === today.getFullYear){
        return messageDate.toLocaleDateString("en-IN",{
          day:"numeric",
          month:"long"
        })
      }
      return messageDate.toLocaleDateString(
          "en-IN",
          {
              day: "numeric",
              month: "long",
              year: "numeric"
          }
      );
  };
  return (
    <div className='chat d-flex gap-3 py-2 chat'>
      <div className='py-3'>
        <img src={props.chat.url} alt={props.chat.name} className='chat-img rounded-circle' onClick={()=>{setContactProfile(props.chat)}}/>
      </div>
      <div className='chat-details py-3' onClick={()=>{setChatPageActiveUser(props.chat);setChatPageActive(true)}}>
        <div className='d-flex justify-content-between'>
          <h6 className='fw-bold'>{props.chat.name}</h6>
          <small className='text-secondary last-seen'>{message&&getDateLabel(message?.timestamp)}</small>
        </div>
        <div className='d-flex justify-content-between flex-wrap'>
          {props.chat.messages.length !== 0 ? <small className='text-secondary unread-msg'>{message?.receiverId === user.id?(message?.receiverMsg?truncateText(message.receiverMsg):emptyMsg):truncateText(message?.senderMsg)}</small>:<small className='text-secondary unread-msg'>No messages until now</small>}
          {count > 0 && <span className='text-white rounded-circle unread-msg-count'>{count}</span>}
        </div>
      </div>
    </div>
  );
};

export default Chat;
