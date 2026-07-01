import React, { useContext, useEffect, useRef, useState } from 'react';
import './Home.css';
import Messages from '../../components/Messages/Messages.jsx';
import Chats from '../../components/Chats/Chats.jsx'
import Add from '../../components/Add/Add.jsx';
import ContactUs from '../../components/ContactUs/ContactUs.jsx';
import Profile from '../../components/Profile/Profile.jsx';
import { StoreContext } from '../../context/StoreContext.jsx';
import { sortedLanguages } from '../../assets/language.js';
import { updateUser } from '../../services/userService.js';
import api from '../../config/config.js';
import { LuNavigation } from 'react-icons/lu';
import ChatPage from '../../components/ChatPage/ChatPage.jsx';
import ContactProfile from '../../components/ContactProfile/ContactProfile.jsx';
import ChatProfile from '../../components/ChatProfile/ChatProfile.jsx';
import TypingLoader from '../../components/TypingLoader/TypingLoader.jsx';
const Home = () => {
  const [activePage,setActivePage] = useState('chats');
  const {user,setUser,width,setWidth,loading,chatPageActive,setChatPageActive,contactProfile,setContactProfile,viewContactProfile,setViewContactProfile,chatProfile,setChatProfile,viewChatProfile,setViewChatProfile} = useContext(StoreContext);
  const [language,setLanguage] = useState("");
  const languageRef = useRef("");
  const codeRef = useRef("");
  if(loading){
    return (
      <TypingLoader />
    );
  }
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const code = sortedLanguages.find(
        lang => lang.name === value
    ).code;
    languageRef.current = value;
    codeRef.current = code;
    setLanguage(value);
  }
  const submitLanguage = async () => {
    try{
      const response = await updateUser({name:user.name,uid:user.uid,language:languageRef.current,code:codeRef.current,url:user.url});
      setUser(response.data);
      setLanguage(" ");
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <div className='d-flex justify-content-center main'>
      { !user.language && (
        <div className="language-modal-overlay">
            <div className="language-modal">
                <h4>Select Your Language</h4>
                <p>Please choose a language to continue using Chatter.</p>

                <select
                    value={language}
                    name='language'
                    onChange={onChangeHandler}
                >
                    <option value="">Select Language</option>
                    {sortedLanguages.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                            {lang.name}
                        </option>
                    ))}
                </select>

                <button
                    disabled={!language}
                    className='lang py-2 rounded-pill'
                    onClick={submitLanguage}
                >
                    Continue
                </button>
            </div>
        </div>
    )}
      {(width > 790 || !chatPageActive) && <div className='main-div'>
        <div className={Object.keys(contactProfile).length !== 0 ? "overlay":"d-none"}>
              <div className='chatImgProfile d-flex flex-column'>
                <i className='bi bi-x-lg fs-4 p-2 ms-auto xc' style={{WebkitTextStroke:"0.5px currentColor",color:"rgb(2, 233, 156)"}} onClick={() => setContactProfile({})}></i>
                <img src={contactProfile.url} alt={contactProfile.name} className='chatImg'/>
                <button className='view-contact-profile' onClick={() => setViewContactProfile(true)}>View Profile</button>
              </div>
        </div>
        {viewContactProfile && <ContactProfile />}
        <div className={Object.keys(chatProfile).length !== 0 && width > 790 ? "overlay":"d-none"}>
              <div className='chatImgProfile d-flex flex-column'>
                <i className='bi bi-x-lg fs-4 p-2 ms-auto xc' style={{WebkitTextStroke:"0.5px currentColor",color:"rgb(2, 233, 156)"}} onClick={() => setChatProfile({})}></i>
                <img src={chatProfile.url} alt={chatProfile.name} className='chatImg'/>
                <button className='view-contact-profile' onClick={() => setViewChatProfile(true)}>View Profile</button>
              </div>
        </div>
        {viewChatProfile && <ChatProfile />}
        <div className='header d-flex gap-2 align-items-center justify-content-center'>
              <i className='bi bi-chat chat-icon'></i>
              <h2 className='fh2 pt-1'>Chatter</h2>
        </div>
        <div className='middle'>
          {activePage === 'chats' && <Chats />}
          {activePage === 'add' && <Add />}
          {activePage === 'contactUs' && <ContactUs />}
          {activePage === 'profile' && <Profile />}
        </div>
        <div className='menu-bar d-fixed bottom-0 option-div d-flex justify-content-between px-2 text-secondary'>
          <div className={`d-flex flex-column align-items-center justify-content-center ${activePage === 'chats'?'active-options':'options'}`} onClick={()=>setActivePage('chats')}>
            <i className={`bi bi-chat-text-fill option-icon fs-4 ${activePage==='chats'?'active-option-icon':'option-icon'}`}></i>
            <small className='option'>chats</small>
          </div>
          <div className={`d-flex flex-column align-items-center justify-content-center ${activePage === 'add'?'active-options':'options'}`} onClick={()=>setActivePage('add')}>
            <i className='bi bi-plus-circle option-icon fs-4'></i>
            <small className='option'>add</small>
          </div>
          <div className={`d-flex flex-column align-items-center justify-content-center ${activePage === 'contactUs'?'active-options':'options'}`} onClick={()=>setActivePage('contactUs')}>
            <i className='bi bi-envelope-fill option-icon fs-4'></i>
            <small className='option'>contact us</small>
          </div>
          <div className={`d-flex flex-column align-items-center justify-content-center ${activePage === 'profile'?'active-options':'options'}`} onClick={()=>setActivePage('profile')}>
            <i className='bi bi-person-fill option-icon fs-4'></i>
            <small className='option'>profile</small>
          </div>
          
        </div>
      </div>}
      <div className='chat-box'>
        {chatPageActive ? <ChatPage /> : <Messages />}
      </div>
      {(width < 791 && chatPageActive) && <ChatPage />}
    </div>
  );
};

export default Home;
