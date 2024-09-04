import React, { useState, useEffect, useContext, useRef } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { DataContext } from '../ContextProvider';

function PrivateChat({ user2 }) {
  const dataContext = useContext(DataContext);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const loggedUser = dataContext.loggedUser.userName;

  const messageStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%',
  };

  const userMessageStyle = {
    ...messageStyle,
    backgroundColor: '#f8f9f5',
    direction: "ltr",
    marginLeft: 'auto',
    textAlign: 'left',
    flexDirection: 'column',
    alignItems: 'flex-end',
    fontSize: '1rem',
  };

  const otherMessageStyle = {
    ...messageStyle,
    backgroundColor: '#fff',
    border: '1px solid #dde0da',
    marginRight: 'auto',
    textAlign: 'left',
    flexDirection: 'column',
    alignItems: 'flex-start',
    direction: "rtl",
    fontSize: '1rem',
  };

  const messageTextStyle = {
    margin: 0,
    padding: '0px 10px',
    fontSize: '1rem',
  };

  const messageSenderStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '0px 10px',
    margin: 0
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOrCreatePrivateChatId = async () => {
    try {
      const q = query(
        collection(db, "privateChats"),
        where("participants", "array-contains", loggedUser)
      );
      const querySnapshot = await getDocs(q);

      let foundChatId = null;

      querySnapshot.forEach((doc) => {
        const participants = doc.data().participants;
        if (participants.includes(user2)) {
          foundChatId = doc.id;
        }
      });

      if (!foundChatId) {
        const newChatRef = await addDoc(collection(db, "privateChats"), {
          participants: [loggedUser, user2],
          createdAt: serverTimestamp(),
        });
        foundChatId = newChatRef.id;
      }

      setChatId(foundChatId);
    } catch (error) {
      console.error("Error finding or creating chat:", error);
    }
  };

  const markMessagesAsRead = async () => {
    if (chatId) {
      const q = query(
        collection(db, "privateChats", chatId, "messages"),
        where("isRead", "==", false),
        where("sender", "!=", loggedUser)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, "privateChats", chatId, "messages", docSnapshot.id);
        await updateDoc(docRef, { isRead: true });
      });

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("chatId", "==", chatId),
        where("userId", "==", loggedUser),
        where("isRead", "==", false)
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);

      notificationsSnapshot.forEach(async (notificationDoc) => {
        const notificationRef = doc(db, "notifications", notificationDoc.id);
        await updateDoc(notificationRef, { isRead: true });
      });
    }
  };

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "privateChats", chatId, "messages"),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      scrollToBottom(); // גלילה אוטומטית לתחתית לאחר טעינת ההודעות
    });

    markMessagesAsRead();

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    getOrCreatePrivateChatId();
  }, [loggedUser, user2]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!chatId) {
      console.error("Chat ID is not defined. Cannot send message.");
      return;
    }

    try {
      const newMessageRef = await addDoc(collection(db, "privateChats", chatId, "messages"), {
        text: newMessage,
        sender: loggedUser,
        createdAt: serverTimestamp(),
        isRead: false
      });

      await addDoc(collection(db, "notifications"), {
        userId: user2,
        chatId: chatId,
        messageId: newMessageRef.id,
        text: `הודעה חדשה מ-${loggedUser}`,
        createdAt: serverTimestamp(),
        isRead: false
      });

      setNewMessage('');
      scrollToBottom(); // גלילה אוטומטית לתחתית לאחר שליחת ההודעה
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', color: 'black', marginTop: '-50px' }}>
      <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ height: "300px", overflowY: "scroll", marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "10px", scrollbarColor: "#7c99ab #f1f1f1", scrollbarWidth: "thin" }}>
          {messages && messages.map(msg => (
            <div key={msg.id} style={msg.sender === loggedUser ? userMessageStyle : otherMessageStyle}>
              <div >
                <p style={messageSenderStyle}>{msg.sender}</p>
                <p style={messageTextStyle}>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* האלמנט הזה נמצא בתחתית הרשימה */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={sendMessage} style={{ padding: "10px 20px", backgroundColor: '#7c99ab', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>שלח</button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="הקלד/י הודעה..."
            style={{ flex: 1, backgroundColor: "white", padding: "10px", marginLeft: "10px", borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', direction: "rtl", color: 'black' }}
          />
        </div>
      </div>
    </div>
  );
}

export default PrivateChat;
