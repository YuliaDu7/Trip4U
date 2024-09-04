import React, { useContext, useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../ContextProvider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function MyGroup() {
  const [groups, setGroups] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const dataContext = useContext(DataContext);
  const user = dataContext.loggedUser.userName;
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = () => {
    fetch(dataContext.apiUrl +`/Group/GetAllUserGroups?userName=${user}`)
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleLeaveGroup = () => {
    if (selectedGroupId === null) return;

    fetch(dataContext.apiUrl +`/Group/LeaveGroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupId: selectedGroupId,
        userName: user
      }),
    })
    .then(response => {
      if (response.ok) {
        setOpenLeaveDialog(false);
        fetchGroups(); // עדכון רשימת הקבוצות
      } else {
        console.error('Failed to leave group');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDeleteGroup = () => {
    if (selectedGroupId === null) return;

    fetch(dataContext.apiUrl +`/Group/DeleteGroup?groupId=${selectedGroupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId: selectedGroupId }),
    })
    .then(response => {
      if (response.ok) {
        setOpenDeleteDialog(false);
        fetchGroups(); // עדכון רששימת הקבוצות
      } else {
        console.error('Failed to delete group');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const openDeleteGroupDialog = (groupId) => {
    setSelectedGroupId(groupId);
    setOpenDeleteDialog(true);
  };

  const openLeaveGroupDialog = (groupId) => {
    setSelectedGroupId(groupId);
    setOpenLeaveDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setOpenLeaveDialog(false);
  };

  return (
    <div 
      dir="rtl" 
      style={{ 
        minHeight: '100vh', 
        fontFamily: 'inherit', 
        color: "black", 
        backgroundColor: '#e1dfd6', 
        padding: '20px'
      }}
    >
      <div 
        style={{ 
          position: 'relative',  
          color: "black", 
          padding: '30px', 
          backgroundColor: "white", 
          borderRadius: '10px', 
          marginBottom: '20px', 
          textAlign: 'center'
        }}
      >
        <p onClick={() => navigate(-1)}  style={{  marginTop: "20px", cursor: "pointer", textAlign: "right", position: "relative", marginRight: 50,color: "black"}}> 
          <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} />
          <b>בחזרה לעמוד הקודם </b>
        </p>
        
        <h1 style={{marginBottom:"50px"}}>הקבוצות שלי</h1>
      </div>
      <Button onClick={() => navigate("/createGroup")} 
        style={{ backgroundColor: "#7c99ab", display: 'flex', color: "white" }}>
        <AddCircleOutlineIcon style={{ marginLeft: '10px' }} />
        <b>יצירת קבוצה חדשה</b>
      </Button>
      <br />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
        {groups.map((group, index) => (
          <div 
            key={index}
            style={{ 
              flex: '1 1 calc(33% - 20px)', 
              boxSizing: 'border-box', 
              color: "black", 
              backgroundColor: "white", 
              borderRadius: '10px', 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minHeight: '250px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img src=".\pictures\group.png" style={{width: '80%', height: 'auto', maxHeight: '100px', borderRadius: '10px'}} alt="group" />
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ color:"#7c99ab", margin: 0 }}>{group.groupName}</h2>
              <span>מספר משתתפים: {group.numOfUsers}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              <Button onClick={() => navigate(`/group`, { state: { groupId: group.groupId } })}
                style={{ backgroundColor:"#7c99ab", borderRadius: 20, marginRight: '10px', color: 'white' }}>
                לדף הקבוצה
              </Button>
              <Button 
                style={{ borderRadius: 20, color: 'white', backgroundColor:"#927070", marginLeft: '10px',marginRight:7 }}
                onClick={() => openLeaveGroupDialog(group.groupId)}
              >
                יציאה מהקבוצה
              </Button>
              {group.isManger && (
                <DeleteIcon 
                  style={{ color: 'black', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => openDeleteGroupDialog(group.groupId)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Deleting Group */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        dir='rtl'
      >
        <DialogTitle id="alert-dialog-title">מחיקת קבוצה</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            האם אתה בטוח שאתה רוצה למחוק את הקבוצה? פעולה זו אינה ניתנת לביטול.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: 'white', backgroundColor: "#f44336", border: `1px solid #f44336`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
            onClick={handleDeleteGroup}
          >
            כן
          </Button>
          <Button
            style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
            onClick={handleCloseDialog}
          >
            לא
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leaving Group */}
      <Dialog
        open={openLeaveDialog}
        onClose={handleCloseDialog}
        dir='rtl'
      >
        <DialogTitle id="alert-dialog-title">יציאה מהקבוצה</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            האם אתה בטוח שאתה רוצה לצאת מהקבוצה? פעולה זו תסיר אותך מהקבוצה.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: 'white', backgroundColor: "#f44336", border: `1px solid #f44336`, borderRadius: '10px', padding: '5px 20px', margin: '5px', }}
            onClick={handleLeaveGroup}
          >
            כן
          </Button>
          <Button
            style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
            onClick={handleCloseDialog}
          >
            לא
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
