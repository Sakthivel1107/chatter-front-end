import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import './SendMessage.css';
import { IoCheckmarkDone } from "react-icons/io5";
import { MdDone, MdDoneAll } from "react-icons/md";
import { StoreContext } from '../../context/StoreContext';
import { sendMessage } from '../../services/webSocketService';

const SendMessage = forwardRef((props,ref) => {
  const {setOptions,selectedMessage,setSelectedMessage} = useContext(StoreContext);
  const timerRef = useRef();
  const time = new Date(props.message?.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const handleRightClick = (e) => {
    e.preventDefault();
    if(Object.keys(selectedMessage).length === 0){
        setSelectedMessage(props.message);
        setOptions("send");
      }
  }
  const handleOnClick = () => {
    if(selectedMessage.id === props.message.id)
    {
      setOptions("");
      setSelectedMessage({});
    }
  }

  const handleTouchStart = () => {
      timerRef.current = setTimeout(() => {
          if(Object.keys(selectedMessage).length === 0){
            setSelectedMessage(props.message);
            setOptions("send");
          }
      }, 1000); 
  };


const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
}; 
  return (
      props.message?.senderMsg &&
      <div ref={ref} className={`send-msg p-3 ms-auto ${selectedMessage?.id === props.message.id ? 'border':''}`} style={{transition:"all 0.2s"}}onContextMenu={handleRightClick} onClick={handleOnClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <p className='d-inline'>{props.message?.senderMsg}</p>
        <div className='msg-meta ms-3'>
            {props.message.edited && <small className='me-1' style={{fontSize:"9px"}}>edited</small>}
            <small style={{fontSize:"10px"}}>{time}</small>
            {props.message.seen==="online" && <IoCheckmarkDone />}
            {props.message.seen==="offline" && <MdDone />}
            {props.message.seen==="seen" && <IoCheckmarkDone className='text-primary' />}
        </div>
    </div>
  )
});

export default SendMessage;
