import React, { useContext, useEffect, useRef } from 'react';
import './MessagesContainer.css';
import SendMessage from '../SendMessage/SendMessage';
import ReceivedMessage from '../ReceivedMessage/ReceivedMessage';
import { StoreContext } from '../../context/StoreContext';
import { sendChatStatus } from '../../services/webSocketService';

const MessagesContainer = (props) => {
  const {user,chatPageActiveUser} = useContext(StoreContext);
  const receiverId = chatPageActiveUser.id;
  const lastMessageRef = useRef(null);
  const containerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const isAtBottomRef = useRef(true);
  useEffect(() => {
    sendChatStatus({senderId:chatPageActiveUser.id,receiverId:user.id});
  }, []);
  useEffect(() => {
        isInitialLoad.current = true;
  }, [chatPageActiveUser.id]);
  useEffect(() => {
        // First time opening the chat
        if (isInitialLoad.current) {
            lastMessageRef.current?.scrollIntoView({
                behavior: "auto"
            });

            isInitialLoad.current = false;
            return;
        }

        // New messages: only scroll if user was already at the bottom
        if (isAtBottomRef.current) {
            lastMessageRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, [props.messages]);

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    isAtBottomRef.current =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
        100; // 100px threshold
  };

  const getDateLabel = (timestamp) => {

      const messageDate =
          new Date(timestamp);

      const today =
          new Date();

      const yesterday =
          new Date();

      yesterday.setDate(
          today.getDate() - 1
      );
      if (
          messageDate.toDateString() ===
          today.toDateString()
      ) {
          return "Today";
      }

      if (
          messageDate.toDateString() ===
          yesterday.toDateString()
      ) {
          return "Yesterday";
      }
      if(messageDate.getFullYear() === today.getFullYear()){
        return messageDate.toLocaleDateString("en-IN",{
          day:"numeric",
          month:"long"
        })
      }
      return messageDate.toLocaleDateString(
          "en-IN",
          {
              day: "numeric",
              month: "long",
              year: "numeric"
          }
      );
  };
  return (
      <div className='chat-messages d-flex flex-column gap-4 p-3' onScroll={handleScroll}>
      
       {props.messages.length !== 0 &&
        props.messages?.map((item, index) => {
        const currentDate =
            getDateLabel(item.timestamp);

        const previousDate =
            index > 0
                ? getDateLabel(
                    props.messages[index - 1]
                        .timestamp
                )
                : null;

        return (
            <React.Fragment key={index}>

                {
                    currentDate !== previousDate &&
                    (
                        <div className="date-separator">
                            {currentDate}
                        </div>
                    )
                }

                {
                    item.senderId === user.id
                        ? <SendMessage message={item} ref={
                    index === props.messages.length - 1
                        ? lastMessageRef
                        : null
                }/>
                        : <ReceivedMessage message={item} ref={
                    index === props.messages.length - 1
                        ? lastMessageRef
                        : null
                }/>
                }

            </React.Fragment>
        );
    })
}

      </div>
  );
};

export default MessagesContainer;
