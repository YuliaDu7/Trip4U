import React, { useState, useEffect, useContext } from 'react';
import { db } from '../Firebase/firebase';
import { collection, query, where, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { DataContext } from '../ContextProvider';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

function ChatsList() {
  const [chats, setChats] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const dataContext = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (dataContext.loggedUser.userName) {
      const q = query(
        collection(db, 'privateChats'),
        where('participants', 'array-contains', dataContext.loggedUser.userName)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatList = await Promise.all(snapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          const messagesQuery = query(
            collection(db, 'privateChats', doc.id, 'messages'),
            where('isRead', '==', false),
            where('sender', '!=', dataContext.loggedUser.userName)
          );

          const messagesSnapshot = await getDocs(messagesQuery);
          const hasUnread = !messagesSnapshot.empty;

          const otherUser = chatData.participants.filter((p) => p !== dataContext.loggedUser.userName)[0];
          if (!avatars[otherUser]) {
            dataContext
              .GetImage(`/GetImage/GetUserPic?primaryKey=${otherUser}`)
              .then((imageObjectURL) => {
                setAvatars((prevAvatars) => ({ ...prevAvatars, [otherUser]: imageObjectURL }));
              })
              .catch((error) => console.log(`Error fetching avatar for ${otherUser}:`, error));
          }

          return { id: doc.id, participants: chatData.participants, hasUnread };
        }));

        setChats(chatList);
      });

      return () => unsubscribe();
    }
  }, [dataContext.loggedUser.userName]);

  const handleChatClick = (chatId) => {
    navigate(`/SendMassege/${chatId}`);
  };

  const handleDeleteClick = (chatId) => {
    setSelectedChatId(chatId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedChatId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedChatId) {
      try {
        await deleteDoc(doc(db, 'privateChats', selectedChatId));
        setChats(chats.filter((chat) => chat.id !== selectedChatId));
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
      handleClose();
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', height: '100vh', color: 'black', direction: 'rtl' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>הצ'אטים שלי</h2>
        <List>
          {chats.length === 0 ? (
            <ListItem>
              <ListItemText primary="אין צ'אטים זמינים." style={{ textAlign: 'center' }} />
            </ListItem>
          ) : (
            chats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleChatClick(chat.participants.filter((p) => p !== dataContext.loggedUser.userName)[0])}>
                    <Avatar
                      src={avatars[chat.participants.filter((p) => p !== dataContext.loggedUser.userName)[0]] || 'pictures/defaultPicture.png'}
                      alt="User Avatar"
                      style={{ marginLeft: '10px' }}
                    />
                    <ListItemText
                      primary={`${chat.participants.filter((p) => p !== dataContext.loggedUser.userName).join(', ')}`}
                      style={{ textAlign: 'right', marginRight: '10px' }}
                    />
                    <Badge color="error" variant="dot" invisible={!chat.hasUnread}></Badge>
                  </ListItemButton>
                  <Tooltip title="מחק צ'אט" arrow>
                  <IconButton onClick={() => handleDeleteClick(chat.id)}>
                  <DeleteIcon />

                  </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>

        <Dialog
          open={open}
          onClose={handleClose}
          dir="rtl"
          PaperProps={{
            style: {
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '10px',
              minWidth: '300px',
            },
          }}
        >
          <IconButton
            style={{ position: 'absolute', top: '10px', right: '10px' }}
            onClick={handleClose}
          >
            <ClearIcon />
          </IconButton>
          <DialogTitle
            style={{
              paddingBottom: '15px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
            id="alert-dialog-title"
          >
            האם אתם בטוחים שאתם רוצים למחוק את הצ'אט?
          </DialogTitle>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              style={{
                color: 'white',
                backgroundColor: '#7C99AB',
                border: '1px solid #7C99AB',
                borderRadius: '10px',
                padding: '5px 20px',
                margin: '5px',
              }}
              onClick={handleClose}
            >
              ביטול
            </Button>
            <Button
              style={{
                color: 'white',
                backgroundColor: '#7C99AB',
                border: '1px solid #7C99AB',
                borderRadius: '10px',
                padding: '5px 20px',
                margin: '5px',
              }}
              onClick={handleDeleteConfirm}
              autoFocus
            >
              כן, אני רוצה
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ChatsList;
