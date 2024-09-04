import React, { useContext, useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../ContextProvider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Group() {
  const [groupDetails, setGroupDetails] = useState(null);
  const [userImages, setUserImages] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = location.state || {};
  const dataContext = useContext(DataContext);

  useEffect(() => {
    fetchData();
  }, [groupId]);
 
  const fetchData = () => {
    if (groupId) {
      fetch(dataContext.apiUrl +`/Group/GroupDetails?groupId=${groupId}`)
        .then((response) => response.json())
        .then((data) => {
          setGroupDetails(data);
          fetchUserImages(data[0].users);
        })
        .catch((error) => console.error('Error fetching group details:', error));
    }
  };

  const fetchUserImages = (users) => {
    let imagesTemp = {};

    users.forEach(user => {
      dataContext.GetImage(`/GetImage/GetUserPic?primaryKey=${user}`)
        .then((imageObjectURL) => {
          imagesTemp[user] = imageObjectURL;
          setUserImages(prevState => ({ ...prevState, ...imagesTemp }));
        })
        .catch(error => console.log(`Error fetching image for user ${user}:`, error));
    });
  };

  if (!groupDetails) {
    return <div>Loading...</div>;
  }

  const openDeleteTripDialog = (tripId) => {
    setSelectedTripId(tripId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteTrip = () => {
    if (selectedTripId === null) return;

    fetch(dataContext.apiUrl +`/Group/DeleteTrip?tripId=${selectedTripId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setOpenDeleteDialog(false);
        fetchData();
      } else {
        console.error('Failed to delete trip');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  function newTrip (){
    fetch(dataContext.apiUrl +`/Group/AddGroupTrip?groupId=${groupId}`)
    .then((response) => response.json())
    .then((data) => navigate(`/TripGroup/${groupId}`, { state: { tripId: data } }))
    .catch((error) => console.error('Error fetching group details:', error));
  }

  return (
    <div 
      dir="rtl" 
      style={{ minHeight: '100vh', fontFamily: 'inherit', color: "black", backgroundColor: 'rgb(239, 248, 255)', padding: '20px'}}
    >
      <div 
        style={{ position: 'relative', color: "black", padding: '30px', backgroundColor: "white", borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}
      >
        <p onClick={() => navigate(-1)}  style={{  marginTop: "20px", cursor: "pointer", textAlign: "right", position: "relative", marginRight: 50,color: "black"}}> 
          <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} />
          <b>בחזרה לעמוד הקודם </b>
        </p>
        <h2>קבוצה: {groupDetails[0].groupName}</h2>
        <p>מנהל הקבוצה: {groupDetails[0].manager}</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          {groupDetails[0].users.map((user, index) => (
            <div key={index} style={{ margin: '0 10px', textAlign: 'center' }}>
              <img
                src={userImages[user] || "./pictures/defaultUserPic.png"} 
                alt={user}
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "./pictures/defaultPicture.png";
                }}
              />
              <p style={{ margin: '5px 0 0', fontSize: '14px' }}>{user}</p>
            </div>
          ))}
        </div>
      </div>
      
      {dataContext.loggedUser.userName === groupDetails[0].manager ? (
        <Button onClick={newTrip} style={{ backgroundColor: "#7c99ab", display: 'flex', color: "white" }}>
          <AddCircleOutlineIcon style={{ marginLeft: '10px' }} />
          <b>יצירת טיול חדש</b>
        </Button>
      ) : null}

      <br />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
        {groupDetails[0].trips.map((trip, index) => (
          <div key={index}
            style={{ flex: '1 1 calc(33% - 20px)', boxSizing: 'border-box', color: "black", backgroundColor: "white", borderRadius: '10px', 
            padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '300px'}}
          >
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img src=".\pictures\trip.png" style={{width: '80%', height: 'auto', maxHeight: '150px', borderRadius: '10px'}} alt="Trip Image" />
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ color:"#7c99ab",margin: 0 }}>{trip.tripTitle}</h2>
              <span>{trip.tripDate ? formatDate(trip.tripDate) : "תאריך לא ידוע"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              <Button onClick={() => navigate(`/TripGroup/${groupId}`, { state: { tripId: trip.tripId } })}
                style={{ backgroundColor:"#dbd3c2",borderRadius:20, color: 'black', marginRight: '10px' }}>
                לדף הטיול
              </Button>
              {dataContext.loggedUser.userName === groupDetails[0].manager && (
                <DeleteIcon 
                  style={{ color: 'black', cursor: 'pointer',marginRight:10 }} 
                  onClick={() => openDeleteTripDialog(trip.tripId)} 
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Trip Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog} dir='rtl'>
        <DialogTitle id="alert-dialog-title">מחיקת טיול</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            האם אתה בטוח שאתה רוצה למחוק את הטיול? פעולה זו אינה ניתנת לביטול.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            style={{ color: 'white', backgroundColor: "#f44336", border: `1px solid #f44336`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }} 
            onClick={handleDeleteTrip}>
            כן
          </Button>
          <Button 
            style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }} 
            onClick={handleCloseDialog}>
            לא
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// פונקציה לעיצוב התאריך בפורמט dd/mm/yyyy
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', options);
};
