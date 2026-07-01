import React, { useContext } from 'react';
import './BlockedContact.css';
import { unblockContact } from '../../services/userService';
import { StoreContext } from '../../context/StoreContext';

const BlockedContact = (props) => {
  const {unBlockContact} = useContext(StoreContext);
  return (
    <div className='blocked-contact d-flex align-items-center gap-2 py-3'>
      <img src={props.contact.url} alt={props.contact.name} className='blocked-contact-img rounded-circle' onClick={() => props.setBlockedContact(props.contact)}/>
      <div>
        <h6>{props.contact.name}</h6>
        <small className='text-secondary blocked-contact-uid'><b>UID:</b> {props.contact.uid}</small>
      </div>
      <button className='ms-auto unblock-btn p-2 d-flex gap-2 align-items-center rounded' onClick={() => unBlockContact(props.contact.id)}>Unblock <i className='bi bi-unlock' style={{WebkitTextStroke:"0.5px currentColor"}}></i></button>
    </div>
  );
};

export default BlockedContact;
