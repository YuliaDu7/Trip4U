import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { messaging } from './firebase';
import { onMessage } from 'firebase/messaging';

function GroupChat(props) {
  const [messages, setMessages] = useState([]);

  const messageStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%',
  };

  const userMessageStyle = {
    ...messageStyle,
    backgroundColor: '#f8f9f5',
    marginLeft: 'auto',
    textAlign: 'right',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const otherMessageStyle = {
    ...messageStyle,
    backgroundColor: '#ffffff',
    border: '1px solid #dde0da',
    marginRight: 'auto',
    textAlign: 'left',
    flexDirection: 'column',
    alignItems: 'flex-end',
  };

  const messageTextStyle = {
    margin: 0,
    padding: '0px 10px',
  };

  const messageSenderStyle = {
    fontSize: '0.9em',
    fontWeight: 'bold',
    padding: '0px 10px',
    margin: 0
  };



  
  useEffect(() => {
    const q = query(
      collection(db, 'chats', props.chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [props.chatId]);

  useEffect(() => {
    const chatContainer = document.querySelector('.chat');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const handleMessage = (payload) => {
      console.log('Message received. ', payload);
    
    };

    const unsubscribe = onMessage(messaging, handleMessage);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ color: "black" ,padding:10,direction:"rtl"}}>
      {messages && messages.map(msg => (
        <div key={msg.id} style={msg.sender === props.loggedUser ? userMessageStyle : otherMessageStyle}>
          <div >
            <p style={messageSenderStyle}>{msg.sender}</p>
            <p style={messageTextStyle}>{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupChat;
