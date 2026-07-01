import React, { useContext } from 'react';
import './Contact.css';
import sample from '../../assets/login.png';
import { addContact, unblockContact } from '../../services/userService';
import { StoreContext } from '../../context/StoreContext';
const Contact = (props) => {
  const {unBlockContact} = useContext(StoreContext);
  const addContactToUser = async () => {
    try{
      const response = await addContact(props.res.uid);
      if(response.status === 200)
      {
        props.removeContact(props.res.uid);
      }
    }
    catch(error){
      console.log(error);
    }
  }
  const handleUnBlockContact = async () => {
    await unBlockContact(props.res.id);
    props.removeContact(props.res.uid);
  }
  return (
    <div className='contact d-flex align-items-center gap-2 py-3'>
      <img src={props.res.url} alt={props.res.name} className='contact-img rounded-circle' onClick={() => props.imgClick(props.res)}/>
      <div>
        <h6>{props.res.name}</h6>
        <small className='text-secondary uid'><b>UID:</b> {props.res.uid}</small>
      </div>
      {!props.exists && !props.blocked && <div className='icon-div ms-auto text-white d-flex align-items-center justify-content-center rounded-circle'>
        <i className='bi bi-plus plus-icon fs-3' onClick={addContactToUser}></i>
      </div>}
      {props.exists &&
        <div className='d-flex align-items-center ms-auto'>
          <small className='text-success' style={{fontSize:"7px"}}>already in contact</small>
          <i className='bi bi-check check-icon fs-3'></i>
        </div>
      }
      {
        props.blocked && 
        <button className='ms-auto unblock-btn p-2 d-flex gap-2 align-items-center rounded' onClick={handleUnBlockContact}>Unblock <i className='bi bi-unlock' style={{WebkitTextStroke:"0.5px currentColor"}}></i></button>
      }
    </div>
  );
};

export default Contact;
