import React, { useContext } from 'react'
import "./NewContact.css";
import { addContact, formatTimestamp } from '../../services/userService';
import { StoreContext } from '../../context/StoreContext';
const NewContact = (props) => {
    const {unBlockContact} = useContext(StoreContext);
    const addContactToUser = async () => {
        try{
            const response = await addContact(props.newContact.uid);
            if(response.status === 200)
            {
                props.removeContact(props.newContact.uid);
                props.setViewNewProfile(false);
                props.setNewProfile({});
            }
        }
        catch(error){
            console.log(error);
        }
    }
    const handleBlockContact = async () => {
        await unBlockContact(props.newContact.id);
        props.setViewNewProfile(false);
        props.setNewProfile({});
    }
  return (
    <div className={"nc-overlay"}>
          <div className='d-flex flex-column gap-2 align-items-center'>
            <i className='bi bi-arrow-left ms-auto me-2 mt-2 fs-3 rc' style={{color:"rgb(8, 240, 163)",WebkitTextStroke:"0.3px currentColor"}} onClick={() => props.setViewNewProfile(false)}></i>
            <div className='d-flex flex-column gap-1 align-items-center' style={{width:'100%'}}>
                    <img src={props.newContact.url} alt={props.newContact.name} className='new-contact-img rounded-circle'/>
                    <h5 className='fw-bold'>{props.newContact.name}</h5>
                    <small>{props.newContact.uid}</small>
            </div>
            <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
                <div className='d-flex gap-3 nc-box' style={{width:'90%'}}>
                    <i className='bi bi-person fs-4 nc-icon rounded-circle px-2 pt-1 mt-1'></i>
                    <div>
                        <small className='text-secondary'>Name</small>
                        <h6>{props.newContact.name}</h6>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
                <div className='d-flex gap-3 nc-box' style={{width:'90%'}}>
                    <i className='bi bi-at fs-4 nc-icon rounded-circle px-2 pt-1 mt-1'></i>
                    <div>
                        <small className='text-secondary'>Uid</small>
                        <h6>{props.newContact.uid}</h6>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
                <div className='d-flex gap-3 nc-box' style={{width:'90%'}}>
                    <i className='bi bi-globe fs-4 nc-icon rounded-circle px-2 pt-1 mt-1'></i>
                    <div>
                        <small className='text-secondary'>Language</small>
                        <h6>{props.newContact.language}</h6>
                    </div>
                </div>
            </div>
            {!props.blocked && !props.exists && <button className='btn btn-success' style={{width: "90%"}} onClick={addContactToUser}>Add Contact</button>}
            {props.blocked && <button className='btn btn-dark' style={{width: "90%"}} onClick={handleBlockContact}>UnBlock Contact</button>}
            {props.exists && <span className='text-success d-flex justify-content-center align-items-center py-2'  style={{width: "90%"}}>Already in contact <i className='bi bi-check fs-3'></i></span>}
          </div>
    </div>
  )
}

export default NewContact
