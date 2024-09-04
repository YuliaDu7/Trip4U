import React, { useState, useEffect, useContext } from 'react';
import { Box, FormControl, Select, MenuItem, Avatar, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom'; 
import { DataContext } from '../ContextProvider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateGroup() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [groupName, setGroupName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const dataContext = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileImages(users);
  }, [users]);

  useEffect(() => {
    fetch(dataContext.apiUrl + `/Group/GetFollowUserNames?userName=${dataContext.loggedUser.userName}`)
      .then(response => response.json())
      .then(data => {
        setUsers(data); 
        fetchProfileImages(data); 
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  function fetchProfileImages(users) {
    let userImagesTemp = {};

    users.forEach(user => {
      dataContext.GetImage(`/GetImage/GetUserPic?primaryKey=${user}`)
        .then((imageObjectURL) => {
          userImagesTemp[user] = imageObjectURL;
          setUserImages(prevState => ({ ...prevState, ...userImagesTemp }));
        })
        .catch(error => console.log(`Error fetching image for user ${user}:`, error));
    });
  }

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedUsers(typeof value === 'string' ? value.split(',') : value);
    setOpen(false); 
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleCreateGroup = () => {
    if (groupName.trim() === '' || selectedUsers.length === 0) {
      setError("שדה חובה");
      return;
    }

    const groupData = {
      userNames: [...selectedUsers, dataContext.loggedUser.userName],
      groupName: groupName,
      manager: dataContext.loggedUser.userName 
    };

    fetch(dataContext.apiUrl +`/Group/AddGroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(groupData),
    })
      .then(response => {
        if (response.ok) {
          setGroupName(''); 
          setSelectedUsers([]);
          setOpenDialog(true); 
        } else {
          alert('Failed to create group.');
        }
      })
      .catch(error => console.error('Error creating group:', error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/myGroup'); 
  };

  return (
    <div dir="rtl" style={{ color: "#7c99ab", fontFamily: "Arial, sans-serif", height: 1000 }}>
     <p onClick={() => navigate(-1)}  style={{  marginTop: "20px", cursor: "pointer", textAlign: "right", position: "relative", marginRight: 50,color: "black"}}> 
  <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} />
  <b>בחזרה לעמוד הקודם </b>
</p>
      <h1 style={{ fontFamily: "inherit", fontSize: "50px", textAlign: "center" }}>יצירת קבוצה חדשה</h1>
      <TextField
        required
        error={Boolean(error)}
        helperText={error}
        inputProps={{ maxLength: 40 }}
        placeholder='איך יקראו לקבוצה? - שדה חובה*'
        variant="outlined"
        value={groupName}
        onChange={handleGroupNameChange}
        style={{ width: "50%" }}
      />

      <h2 style={{ marginTop: 80 }}>הוסף משתמשים:</h2>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <FormControl style={{ width: "50%" }}>
          <Select
            multiple
            value={selectedUsers}
            onChange={handleSelectChange}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderValue={(selected) => selected.join(', ')}
          >
            {users.map(user => (
              <MenuItem key={user} value={user} style={{ direction: "rtl" }}>
                <Avatar 
                  src={userImages[user]} 
                  alt={user} 
                  sx={{ width: 30, height: 30, marginLeft: 1 }}
                />
                {user}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        {selectedUsers.map(name => (
          <div key={name} style={{ display: 'inline-block', margin: '10px', position: 'relative' }}>
            <Avatar src={userImages[name]} alt={name} sx={{ width: 80, height: 80 }}>
              {name.charAt(0)}
            </Avatar>
            <div>{name}</div>
            <IconButton
              onClick={() => setSelectedUsers(selectedUsers.filter(userName => userName !== name))}
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              <CancelIcon style={{ position: 'absolute', left: -11, bottom: -5, color: "#7c99ab" }} />
            </IconButton>
          </div>
        ))}
      </div>

      <img
        src='./pictures/createGroup.png'
        alt='Share save pic'
        style={{ width: "25%", marginRight: '74%' }}
      />
      <Button
        style={{
          marginRight: '75%',
          backgroundColor: "#927070",
          color: "white",
          width: 250,
          padding: 20,
          borderRadius: 10,
          fontSize: 17,
          marginTop: "-46px"
        }}
        variant="contained"
        onClick={handleCreateGroup}
      >
        יצירת קבוצה
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        dir='rtl'
      >
        <DialogTitle id="alert-dialog-title">קבוצה נוצרה בהצלחה</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              ניתן לראות את הקבוצה בקבוצות שלך, תהנו!

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
            onClick={handleCloseDialog}
            autoFocus
          >
            לדף הקבוצות
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
