import React, { useState, useContext } from 'react';
import { Autocomplete, TextField, Button, Box, Grid, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LocationOn, Event, Restaurant, Place } from '@mui/icons-material';
import { db } from '../Firebase/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { DataContext } from '../ContextProvider';
import InfoIcon from '@mui/icons-material/Info';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
export default function TripUser(props) {
  const { initialTripData, initialPlaces, initialRestaurants } = props;

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const dataContext = useContext(DataContext);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSuggestPlace = async () => {
    if (selectedPlace) {
      try {
        // בדיקת האם המקום כבר הוצע
        const placeQuery = query(
          collection(db, 'suggestedPlaces'),
          where('placeName', '==', selectedPlace),
          where('tripId', '==', initialTripData.tripId)
        );
        const placeSnapshot = await getDocs(placeQuery);

        if (placeSnapshot.empty) {
          // אם המקום לא הוצע, נוסיף אותו
          await addDoc(collection(db, 'suggestedPlaces'), {
            placeName: selectedPlace,
            suggestedBy: dataContext.loggedUser.userName,
            tripId: initialTripData.tripId,
            votes: 0
          });
          setSelectedPlace(null);
        } else {
          // אם המקום כבר הוצע, נציג הודעה בדיאלוג
          setDialogMessage('מקום זה כבר הוצע עבור הטיול הנוכחי.');
          setOpenDialog(true);
        }
      } catch (error) {
        console.error('Error suggesting place:', error);
      }
    }
  };

  const handleSuggestRestaurant = async () => {
    if (selectedRestaurant) {
      try {
        // בדיקת האם המסעדה כבר הוצעה
        const restaurantQuery = query(
          collection(db, 'suggestedRestaurants'),
          where('restaurantName', '==', selectedRestaurant),
          where('tripId', '==', initialTripData.tripId)
        );
        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (restaurantSnapshot.empty) {
          // אם המסעדה לא הוצעה, נוסיף אותה
          await addDoc(collection(db, 'suggestedRestaurants'), {
            restaurantName: selectedRestaurant,
            suggestedBy: dataContext.loggedUser.userName,
            tripId: initialTripData.tripId,
            votes: 0
          });
          setSelectedRestaurant(null);
        } else {
          // אם המסעדה כבר הוצעה, נציג הודעה בדיאלוג
          setDialogMessage('מסעדה זו כבר הוצעה עבור הטיול הנוכחי.');
          setOpenDialog(true);
        }
      } catch (error) {
        console.error('Error suggesting restaurant:', error);
      }
    }
  };

  return (
    <Box style={{ padding: '30px', marginTop: '20px', backgroundColor: 'white', borderRadius: '15px' }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Avatar style={{ backgroundColor: '#7C99AB', width:35, height: 35 }}>
            <Event style={{ fontSize: 20, color: 'white' }} />
          </Avatar>
        </Grid>
        <Grid item>
          <Box style={{ fontSize: 20, color: 'black' }}>{formatDate(initialTripData.tripDate)}</Box>
        </Grid>
        <Grid item>
          <LocationOn style={{ fontSize: 30, color: '#7C99AB', marginRight: 8 }} />
        </Grid>
        <Grid item>
          <Box style={{ fontSize: 20, color: 'black' }}>
            {initialTripData.area === 'N' ? ' צפון' : initialTripData.area === 'C' ? ' מרכז' :initialTripData.area === 'S'? ' דרום': " לא הוגדר אזור"}
          </Box>
        </Grid>
      
      </Grid>
      <Box style={{ marginTop: '25px', marginBottom: '15px', direction: 'rtl' }}>
  <Box style={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  
 
    <h2 style={{ textAlign: 'right', width: '100%' }}>  <InfoIcon style={{ fontSize: 30, color: '#7C99AB', marginLeft: 20,marginBottom:-7 }} />פרטי הטיול </h2>
    <p style={{ textAlign: 'right', width: '100%' }}>{initialTripData.tripDescription}</p>
  </Box>
        <Box style={{ color: 'black', display: 'flex', alignItems:"center"}}>
        <LocationOn style={{ fontSize: 30, color: '#7C99AB', }} /> <h2 style={{ textAlign: 'right', width: '100%', marginRight:12, }}>מקומות שנבחרו לטיול </h2> 
        </Box>
        {initialTripData.places?.map((place, index) => (
          <Box key={index} style={{ fontSize: 18, color: 'black', marginTop: 10 }}>
                <p style={{ textAlign: 'right', width: '100%' }}>  <FiberManualRecordIcon style={{ fontSize: 10, color: '#7C99AB', marginLeft: 10, }} /><strong>{place.placeName} </strong>

             
              <br />
              {place.placeDescription}
           </p>
           
          </Box>
        ))}
        
        <h3 style={{ marginTop: 10, textAlign: 'right', paddingRight: 20, color:"#927070" }}> הצע מקום:</h3>

        <Box style={{ marginTop: '15px', width: '60%', overflow: 'hidden' }}>
          <Box style={{ float: 'right', width: '60%' }}>
            <Autocomplete
              options={initialPlaces.map((place) => place.placeName)}
              value={selectedPlace}
              size="small"
              onChange={(event, newValue) => setSelectedPlace(newValue)}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" placeholder="בחרו מקום..." style={{direction:"rtl", width: "100%" }} />
              )}
            />
          </Box>
          <Box style={{ float: 'right', marginRight: '10px' }}>
            <Button onClick={handleSuggestPlace} variant="contained" style={{ backgroundColor: '#927070', color: 'white',borderRadius:10 ,}}>
              הצע מקום
            </Button>
          </Box>
        </Box>
      </Box>
     
      <Box style={{ marginTop: '25px' }}>
        <Box style={{  color: 'black', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <Restaurant style={{ fontSize: 30, color: '#7C99AB', }} /> <h2 style={{ textAlign: 'right', width: '100%', marginRight:12, }}>מסעדות בטיול : </h2>         
        </Box>
        {initialTripData.rests?.map((restaurant, index) => (
          <Box key={index} style={{ fontSize: 18, color: 'black', marginTop: 10 }}>
                            <p style={{ textAlign: 'right', width: '100%' }}>  <FiberManualRecordIcon style={{ fontSize: 10, color: '#7C99AB', marginLeft: 10, }} /> <strong>{restaurant.restName}</strong> 
  
                            <br />
              {restaurant.restDescription}
           </p>
          </Box>
        ))}
      </Box>
      <br />
      <h3 style={{ marginTop: 10, textAlign: 'right', paddingRight: 20, color:"#927070" }}> הצע מסעדה:</h3>

      <Box style={{ marginTop: '15px', width: '60%', overflow: 'hidden' }}>
        <Box style={{ float: 'right', width: '60%' }}>
          <Autocomplete
            options={initialRestaurants.map((rest) => rest.restName)}
            value={selectedRestaurant}
            size="small"
            onChange={(event, newValue) => setSelectedRestaurant(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="בחרו מסעדה..." style={{ width: "100%" }} />
            )}
          />
        </Box>
        <Box style={{ float: 'right', marginRight: '10px' }}>
          <Button onClick={handleSuggestRestaurant} variant="contained" style={{ backgroundColor: '#927070', color: 'white',borderRadius:10 ,}}>
            הצע מסעדה
          </Button>
        </Box>
      </Box>

      {/* דיאלוג הודעה */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        dir='rtl'
      >
        <DialogTitle id="alert-dialog-title">שימו לב</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
            onClick={handleCloseDialog}
            autoFocus
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
// פונקציה לעיצוב התאריך בפורמט dd/mm/yyyy
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', options);
};
