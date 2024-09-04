import React, { useState, useContext } from 'react';
import { Button, TextField, IconButton, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataContext } from '../ContextProvider';

export default function TripManger(props) {
  const { initialTripData, initialPlaces, initialRestaurants } = props;
  const dataContext = useContext(DataContext);
  const [tripData, setTripData] = useState(initialTripData);
  const [places, setPlaces] = useState(initialPlaces);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [selectedPlaces, setSelectedPlaces] = useState(tripData.places?.map(place => place.placeName) || ['']);
  const [selectedRestaurants, setSelectedRestaurants] = useState(tripData.rests?.map(rest => rest.restName) || ['']);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const handleAddPlace = () => setSelectedPlaces([...selectedPlaces, '']);
  const handleRemovePlace = index => setSelectedPlaces(selectedPlaces.filter((_, i) => i !== index));
  const handlePlaceChange = (index, value) => setSelectedPlaces(selectedPlaces.map((place, i) => (i === index ? value : place)));

  const handleAddRestaurant = () => setSelectedRestaurants([...selectedRestaurants, '']);
  const handleRemoveRestaurant = index => setSelectedRestaurants(selectedRestaurants.filter((_, i) => i !== index));
  const handleRestaurantChange = (index, value) => setSelectedRestaurants(selectedRestaurants.map((restaurant, i) => (i === index ? value : restaurant)));

  const handleUpdate = async () => {
    const updateData = {
      tripId: tripData.tripId,
      tripTitle: tripData.tripTitle,
      area: tripData.area,
      tripDescription: tripData.tripDescription,
      tripDate: tripData.tripDate,
      placesInTrip: selectedPlaces.filter(Boolean).map((placeName, index) => ({
        placeId: places.find(place => place.placeName === placeName)?.placeId,
        placePlaceInTrip: index,
      })),
      restInTrip: selectedRestaurants.filter(Boolean).map((restName, index) => ({
        restaurantId: restaurants.find(rest => rest.restName === restName)?.restaurantId,
        restPlaceInTrip: index,
      })),
    };
  
    try {
      const response = await fetch(dataContext.apiUrl +`/Group/updateGroupTrip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
  
      if (response.ok) {
        setOpenSuccessDialog(true);
      } else {
        console.error('Error updating trip:', response.statusText);
        alert('שגיאה בעדכון הטיול.');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('שגיאה בעדכון הטיול.');
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', direction: 'rtl' }}>
      <div style={{ marginTop: 30 }}>
        <h3 style={{ color: "black", fontSize: 20,textAlign: 'right' }}>תנו כותרת לטיול:</h3>
        <TextField
          required
          placeholder='* כותרת הטיול... '
          variant="outlined"
          style={{ width: "70%" }}
          inputProps={{ maxLength: 40 }}
          value={tripData?.tripTitle || ''}
          onChange={(e) => setTripData({ ...tripData, tripTitle: e.target.value })}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <h3 style={{ color: "black", fontSize:20,textAlign: 'right'}}>מתי יהיה הטיול?</h3>
      
          <TextField
            id="date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: '9999-12-31' }}
            value={tripData?.tripDate || ''}
            onChange={(e) => setTripData({ ...tripData, tripDate: e.target.value })}
            style={{width:"20%",color:"black"}}
          />
      </div>

      <div style={{ marginTop: 30 }}>
        <h3 style={{ color: "black", fontSize: 20 ,textAlign: 'right'}}>באיזה חלק בארץ?</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {['N', 'C', 'S'].map((region) => (
            <Button
              key={region}
              style={{
                margin: "0 15px",
                backgroundColor: tripData?.area === region ? "#7c99ab" : "white",
                border: "1px solid #7c99ab",
                borderRadius: 10,
                padding: "8px 40px",
                color: tripData?.area === region ? "white" : "black"
              }}
              onClick={() => setTripData({ ...tripData, area: region })}
            >
              {region === 'N' ? 'צפון' : region === 'C' ? 'מרכז' : 'דרום'}
            </Button>
          ))}
        </div>
<br />
        <div style={{ marginTop: 30 }}>
          <h3 style={{ color: "black", fontSize: 20,textAlign: 'right' }}>שתפו בתיאור/רשימת ציוד/תקציב?</h3>
          <TextField
            required
            placeholder='* תיאור כללי... '
            variant="outlined"
            multiline
            maxRows={4}
            style={{ width: "70%" }}
            value={tripData?.tripDescription || ''}
            onChange={(e) => setTripData({ ...tripData, tripDescription: e.target.value })}
          />
        </div>
        <div style={{ marginTop: 30 }}>
            <h3 style={{ color: "black", fontSize: 20, textAlign: "right" }}>מה המקום הראשון?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {selectedPlaces.map((place, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '500px', marginBottom: 10 }}>
                  <div style={{ flexGrow: 1, marginRight: 10 }}>
                    <Autocomplete
                      options={places.map((place) => place.placeName)}
                      value={place}
                      onChange={(event, newValue) => handlePlaceChange(index, newValue)}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" fullWidth />
                      )}
                    />
                  </div>
                  <IconButton onClick={() => handleRemovePlace(index)} disabled={selectedPlaces.length === 0}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              
              <Button onClick={handleAddPlace}   startIcon={<AddIcon style={{ border: '2px solid ', borderRadius: '50%' ,marginLeft:10 }} />} 
                     style={{ marginTop: 10  ,fontSize: 15, width: '220px', paddingRight: '10px'}}> הוסף מקום נוסף  &nbsp;&nbsp;&nbsp;                 </Button>
            </div>
          </div>


              <div style={{ marginTop: 30 }}>
              <h3 style={{ color: "black", fontSize: 20, textAlign: "right" }}>באיזה מסעדה תעצרו לאכול?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {selectedRestaurants.map((restaurant, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '500px', marginBottom: 10 }}>
                    <div style={{ flexGrow: 1, marginRight: 10 }}>
                      <Autocomplete
                        options={restaurants.map((rest) => rest.restName)}
                        value={restaurant}
                        onChange={(event, newValue) => handleRestaurantChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" fullWidth />
                        )}
                      />
                    </div>
                    <IconButton onClick={() => handleRemoveRestaurant(index)} disabled={selectedRestaurants.length === 0}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <Button onClick={handleAddRestaurant}  startIcon={<AddIcon style={{ border: '2px solid ', borderRadius: '50%',marginLeft:10 }} />} 
                 style={{ marginTop: 10 ,fontSize: 15,width: '220px', paddingRight: '10px'}}>
                  הוסף מסעדה נוספת
                </Button>
              </div>
            </div>

      </div>
    <br/>
      <div style={{ textAlign: "left", marginTop: 30 }}>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#7c99ab',
            color: 'white',
            borderRadius: 10,
            padding: '8px 40px',
            fontSize: '1rem',
            textTransform: 'none'
          }}
          onClick={handleUpdate}
        >
          עדכון
        </Button>
      </div>
   

      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}  sx={{ '& .MuiDialog-paper': { minWidth: '500px' } }} // שינוי זה מגדיל את רוחב הדיאלוג
 dir="rtl">
        <DialogTitle>הצלחה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            הטיול עודכן בהצלחה!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}