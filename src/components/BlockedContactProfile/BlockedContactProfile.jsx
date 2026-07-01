import React, { useContext } from 'react'
import "./BlockedContactProfile.css";
import { addContact, formatTimestamp } from '../../services/userService';
import { StoreContext } from '../../context/StoreContext';
const BlockedContactProfile = (props) => {
    const {unBlockContact} = useContext(StoreContext);
    const handleBlockContact = async () => {
        await unBlockContact(props.bContact.id);
        props.setBlockedContact({});
        props.setViewBlockedContactProfile(false);
    }
  return (
    <div className={"nc-overlay"}>
          <div className='d-flex flex-column gap-2 align-items-center'>
            <i className='bi bi-arrow-left ms-auto me-2 mt-2 fs-3 rc' style={{color:"rgb(8, 240, 163)",WebkitTextStroke:"0.3px currentColor"}} onClick={() => props.setViewBlockedContactProfile(false)}></i>
            <div className='d-flex flex-column gap-1 align-items-center' style={{width:'100%'}}>
                    <img src={props.bContact.url} alt={props.bContact.name} className='new-contact-img rounded-circle'/>
                    <h5 className='fw-bold'>{props.bContact.name}</h5>
                    <small>{props.bContact.uid}</small>
            </div>
            <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
                <div className='d-flex gap-3 nc-box' style={{width:'90%'}}>
                    <i className='bi bi-person fs-4 nc-icon rounded-circle px-2 pt-1 mt-1'></i>
                    <div>
                        <small className='text-secondary'>Name</small>
                        <h6>{props.bContact.name}</h6>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
                <div className='d-flex gap-3 nc-box' style={{width:'90%'}}>
                    <i className='bi bi-at fs-4 nc-icon rounded-circle px-2 pt-1 mt-1'></i>
                    <div>
                        <small className='text-secondary'>Uid</small>
                        <h6>{props.bContact.uid}</h6>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
                <div className='d-flex gap-3 nc-box' style={{width:'90%'}}>
                    <i className='bi bi-globe fs-4 nc-icon rounded-circle px-2 pt-1 mt-1'></i>
                    <div>
                        <small className='text-secondary'>Language</small>
                        <h6>{props.bContact.language}</h6>
                    </div>
                </div>
            </div>
            <button className='btn btn-dark' style={{width: "90%"}} onClick={handleBlockContact}>UnBlock Contact</button>
          </div>
    </div>
  )
}

export default BlockedContactProfile;
