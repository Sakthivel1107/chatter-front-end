import React, { forwardRef, useContext, useRef } from 'react';
import './ReceivedMessage.css';
import { IoCheckmarkDone } from "react-icons/io5";
import { StoreContext } from '../../context/StoreContext';

const ReceivedMessage = forwardRef((props,ref) => {
  const {setOptions,selectedMessage,setSelectedMessage} = useContext(StoreContext);
  const timerRef = useRef();
  const time = new Date(props.message?.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const handleRightClick = (e) => {
    e.preventDefault();
    if(Object.keys(selectedMessage).length === 0){
        setSelectedMessage(props.message);
        setOptions("received");
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
            setOptions("received");
          }
      }, 1000); 
  };


const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
};  
  if(props.message.receiverMsg === null){
    return;
  }
  return (
    <div ref={ref} className={`received-msg p-3 me-auto ${selectedMessage?.id === props.message.id ? 'border':''}`} style={{transition:"all 0.2s"}}onContextMenu={handleRightClick} onClick={handleOnClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {props.message?.receiverMsg === "" ? <p className='d-inline text-secondary'><i className='bi bi-slash-circle me-1' style={{WebkitTextStroke:"0.5px currentColor"}}></i>This message was deleted</p>:<p className='d-inline'>{props.message?.receiverMsg}</p>}
        <div className='received-msg-meta ms-3'>
            {props.message.edited && <small className='me-1' style={{fontSize:"9px"}}>edited</small>}
            <small style={{fontSize:"10px"}}>{time}</small>
        </div>
    </div>
  );
});

export default ReceivedMessage;
