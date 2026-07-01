import React, { useContext, useState } from 'react';
import './Add.css';
import Contact from '../Contact/Contact.jsx';
import { searchUser } from '../../services/userService.js';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext.jsx';
import NewContact from '../NewContact/NewContact.jsx';

const Add = () => {
  const {user,loadUserData} = useContext(StoreContext);
  const [results,setResults] = useState([]);
  const [searchInput,setSearchInput] = useState("");
  const [newProfile,setNewProfile] = useState({});
  const [viewNewProfile,setViewNewProfile] = useState(false);
  const onChangeHandler = (event) => {
    setSearchInput(event.target.value);
  }

  const search = async () => {
    try {
      const response = await searchUser(searchInput);
      if(response.data.length === 0){
        toast.error("User not found.");
        return;
      }
      setResults(response.data);
    } catch (error) {
      toast.error("User not found.");
    }
  }
  const removeContact = (uid) => {
    setResults((prev) => prev.filter(contact => contact.uid != uid));
    loadUserData();
  }
  return (
    <div className='add pt-3'>
      <div className={Object.keys(newProfile).length !== 0 ? "overlay":"d-none"}>
            <div className='chatImgProfile d-flex flex-column'>
              <i className='bi bi-x-lg fs-4 p-2 ms-auto xc' style={{WebkitTextStroke:"0.5px currentColor",color:"rgb(2, 233, 156)"}} onClick={() => setNewProfile({})}></i>
              <img src={newProfile.url} alt={newProfile.name} className='chatImg'/>
              <button className='view-contact-profile' onClick={() => setViewNewProfile(true)}>View Profile</button>
            </div>
      </div>
      {viewNewProfile && <NewContact newContact={newProfile} removeContact={removeContact} exists={(user.contacts?.includes(newProfile.id))} blocked={(user.blockedContacts.includes(newProfile.id))} setNewProfile={setNewProfile} setViewNewProfile={setViewNewProfile} viewNewProfile={viewNewProfile}/>}
      <div className='search-bar p-1 mx-2 rounded-pill d-flex'>
        <i className='bi bi-search fs-5 search-icon px-1'></i>
        <input type="text" className='contact-search' value={searchInput} placeholder='search by uid or name' onChange={onChangeHandler}/>
        <i className='bi bi-arrow-right fs-5 submit-icon ms-auto me-1' onClick={search}></i>
      </div>
      <div className='d-flex flex-column'>
        {
          results.map((item,id) =>(<Contact res={item} key={id} removeContact={removeContact} exists={(user.contacts?.includes(item.id))} blocked={(user.blockedContacts?.includes(item.id))} imgClick={setNewProfile}/>))
        }
      </div>
    </div>
  );
};

export default Add;
