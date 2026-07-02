import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import sample from '../../assets/login.png';
import { sortedLanguages } from '../../assets/language';
import { StoreContext } from '../../context/StoreContext';
import { updateUser, verifyUID } from '../../services/userService';
import axios from 'axios';
import Loader from '../loader/Loader';
import { toast } from 'react-toastify';
import BlockedContact from '../BlockedContact/BlockedContact';
import BlockedContactProfile from '../BlockedContactProfile/BlockedContactProfile';

const Profile = () => {
  const {user,setUser,logout,token,loadUserData,blockedContactsData} = useContext(StoreContext);
  const [nameActive,setNameActive] = useState(false);
  const [uidActive,setUidActive] = useState(false);
  const [languageActive,setLanguageActive] = useState(false);
  const [loader,setLoader] = useState(false);
  const [blockedContacts,setBlockedContacts] = useState(false);
  const [viewImg,setViewImg] = useState(false);
  const [blockedContact,setBlockedContact] = useState({});
  const [viewBlockedContactProfile,setViewBlockedContactProfile] = useState(false);
  const update = async () => {
      try{
        const response = await updateUser(user);
        setUser(response.data);
      }
      catch(error){
        console.log(error);
      }
  }
  const updateUid = async () => {
      try{
        const response = await verifyUID(user.uid);
        if(!response){
          toast.warning("Uid already exists,please use another");
          loadUserData();
          return;
        }
        update();
      }
      catch(error){
        loadUserData();
        console.log(error);
      }
  }
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser((prev)=>({...prev,[name]:value}));
  }
  const onChangeLanguageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const code = sortedLanguages.find(
            lang => lang.name === value
        ).code;
    setUser((prev)=>({...prev,[name]:value,code:code}));
  }
  const fileUpload = () => {
    document.getElementById('imageInput').click();
  }
  const handleFileChange = async (e)=> {
          setLoader(true);
          const file = e.target.files[0];
          if(!file){
            setLoader(false);
            return;
          }
          const formData = new FormData();
          formData.append("file",file);
          async function update() {
            try{
              const response = await axios.put("https://chatter-back-end-api.onrender.com/api/updateImage",formData,{
                  headers:{
                      "Content-Type":"multipart/form-data",
                      "Authorization": `Bearer ${token}`
                  },
              });
              setUser(prev => ({...prev,url:response.data}));
              if(response)
              {
                setLoader(false);
              }
            }catch(error){
              setLoader(false);
              console.log(error);
            }
          }
          update();
      }
  return (
    <div className='d-flex flex-column gap-2 align-items-center' style={{position:"relative",zIndex:"0"}}>
        {viewImg && <div className={viewImg ? "p-overlay":"d-none"} >
              <div className='chatImgProfile d-flex flex-column' style={{backgroundColor:"none"}}>
                <i className='bi bi-x-lg fs-4 p-2 ms-auto xc' style={{WebkitTextStroke:"0.5px currentColor",color:"rgb(2, 233, 156)"}} onClick={() => setViewImg(false)}></i>
                <img src={user.url} alt={user.name} className='chatImg'/>
              </div>
        </div>}
        {viewBlockedContactProfile && <BlockedContactProfile bContact={blockedContact} setBlockedContact={setBlockedContact} setViewBlockedContactProfile={setViewBlockedContactProfile}/>}
        {<div className={Object.keys(blockedContact).length !== 0 ? "p-overlay":"d-none"}>
              <div className='chatImgProfile d-flex flex-column'>
                <i className='bi bi-x-lg fs-4 p-2 ms-auto xc' style={{WebkitTextStroke:"0.5px currentColor",color:"rgb(2, 233, 156)"}} onClick={() => setBlockedProfile({})}></i>
                <img src={blockedContact.url} alt={blockedContact.name} className='chatImg'/>
                <button className='view-contact-profile' onClick={() => setViewBlockedContactProfile(true)}>View Profile</button>
              </div>
        </div>}
      <h4 className='bg-success text-white py-2 px-2 text-center fs-3' style={{width:'100%'}}>Profile</h4>
      <div className='d-flex flex-column gap-1 align-items-center' style={{width:'100%'}}>
        <div className='ni'>
          {loader && <Loader />}
          {!loader && <img src={user.url} alt={user.name} onClick={() => setViewImg(true)} className='profile-img rounded-circle'/>}
          <i className='bi bi-camera-fill camera-icon rounded-circle px-2 py-1 fs-5' onClick={fileUpload}></i>
          <input type="file" className='d-none' id='imageInput' onChange={handleFileChange}/>
        </div>
        <h5 className='fw-bold'>{user.name}</h5>
        <small className='text-secondary'>{user.uid}</small>
      </div>
      <div className='d-flex flex-column gap-1 align-items-center pt-1' style={{width:'100%'}}>
        <div className='d-flex gap-3 p-box' style={{width:'90%'}}>
          <i className='bi bi-person fs-4 p-icon rounded-circle px-2  mt-1'></i>
          <div>
            <small className='text-secondary'>Name</small>
            {!nameActive && <h6>{user.name}</h6>}
            {nameActive && <div className='d-flex align-items-center in-box'>
              <input type="text" className='p-input' name='name' value={user.name} onChange={onChangeHandler}/>
              <i className='bi bi-check-circle text-success fs-5' onClick={()=>{update();setNameActive(!nameActive)}}></i>
            </div>}
          </div>
          {!nameActive && <i className='bi bi-pencil text-success fs-5 ms-auto mt-3' onClick={()=>setNameActive(!nameActive)}></i>}
        </div>
        <div className='d-flex gap-3 p-box' style={{width:'90%'}}>
          <i className='bi bi-at fs-4 p-icon rounded-circle px-2 pt-1 mt-1'></i>
          <div>
            <small className='text-secondary'>Uid</small>
            {!uidActive && <h6>{user.uid}</h6>}
            {uidActive && <div className='d-flex align-items-center in-box'>
              <input type="text" className='p-input' value={user.uid} name='uid' onChange={onChangeHandler}/>
              <i className='bi bi-check-circle text-success fs-5' onClick={()=>{updateUid();setUidActive(!uidActive)}}></i>
            </div>}
          </div>
          {!uidActive && <i className='bi bi-pencil text-success fs-5 ms-auto mt-3' onClick={()=>setUidActive(!uidActive)}></i>}
        </div>
        <div className='d-flex gap-3 p-box' style={{width:'90%'}}>
          <i className='bi bi-globe fs-4 p-icon rounded-circle px-2 pt-1 mt-1'></i>
          <div style={{width:'100%'}}>
            <small className='text-secondary'>Language</small>
            {!languageActive && <h6>{user.language}</h6>}
            {languageActive && <div className='d-flex align-items-center in-box' style={{width:'100%'}}>
              <select name="language" id="language" className='p-select' value={user.language} onChange={onChangeLanguageHandler}>
                {
                  sortedLanguages.map(item =><option key={item.code} value={item.name}>{item.name}</option>)
                }
              </select>
              <i className='bi bi-check-circle text-success fs-5' onClick={()=>{update();setLanguageActive(!languageActive)}}></i>
            </div>}
          </div>
          {!languageActive && <i className='bi bi-pencil text-success fs-5 ms-auto mt-3' onClick={()=>setLanguageActive(!languageActive)}></i>}
        </div>
        <div className='d-flex gap-3 p-box' style={{width:'90%'}}>
          <i className='bi bi-box-arrow-right fs-4 logout-icon rounded-circle px-2 pt-1 mt-1'></i>
          <div className='d-flex gap-1 flex-column'>
            <small className='text-danger'>Logout</small>
            <small className='text-secondary lo'>Sign out from your account</small>
          </div>
          <i className='bi bi-arrow-right text-danger fs-4 ms-auto mt-3' onClick={()=>logout()}></i>
        </div>
        {blockedContactsData.length > 0 && <div className='d-flex gap-3 p-box' style={{width:'90%'}}>
          <i className='bi bi-person-slash fs-4 logout-icon rounded-circle px-2 pt-1 mt-1'></i>
          <div className='d-flex gap-1 flex-column'>
            <small className='text-danger'>Blocked contacts</small>
            <small className='text-secondary lo'>Blocked contacts list</small>
          </div>
          <i className='bi bi-chevron-down text-secondary fs-5 ms-auto mt-3' style={{WebkitTextStroke:"0.5px currentColor"}} onClick={() => setBlockedContacts(!blockedContacts)}></i>
        </div>}
        {blockedContacts && blockedContactsData.length > 0 && blockedContactsData?.map((contact,id) => <BlockedContact key={id} contact = {contact} setBlockedContact={setBlockedContact}/>)}
      </div>
    </div>
  );
};

export default Profile;
