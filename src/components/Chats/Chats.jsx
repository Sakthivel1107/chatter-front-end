import React, { useContext, useState } from 'react';
import './Chats.css';
import Chat from '../Chat/Chat';
import { StoreContext } from '../../context/StoreContext';
const Chats = () => {
  const {user,contacts} = useContext(StoreContext);
  const [searchText,setSearchText] = useState("");
  const sortedContacts = [...contacts].sort((a, b) => {
      const aTime = a.messages[a.messages.length - 1]?.timestamp || 0;
      const bTime = b.messages[b.messages.length - 1]?.timestamp || 0;

      return bTime - aTime; // Newest first
  });
  const filteredContacts = sortedContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <div className='chats pt-3'>
      <div className='search-bar p-1 mx-2 rounded-pill'>
        <i className='bi bi-search fs-5 search-icon px-1'></i>
        <input type="text" className='chat-search' placeholder='search chats by name' value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
      </div>
      {!searchText&&<div>
        {sortedContacts?.map((contact,id) => (<Chat chat={contact} key={id}/>))}
      </div>}
      {searchText && <div>
        {
        filteredContacts.map((contact,id) => (
        <Chat chat={contact} key={id}/>
        ))
        }
      </div>
      }
    </div>
  );
};

export default Chats;
