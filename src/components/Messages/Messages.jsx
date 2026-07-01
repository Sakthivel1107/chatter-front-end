import React from 'react';
import './Messages.css';
import lapandmob_icon from '../../assets/lapandmob_icon.png';
const Messages = () => {
  return (
    <div className='messages'>
      <img src={lapandmob_icon} alt="lapandmob_icon" className='lm-icon' />
      <h3 className='fw-bold'>Welcome to Chatter</h3>
      <p className='desc'>Send and receive messages in your own language without keeping your phone online.</p>
    </div>
  )
}

export default Messages;
