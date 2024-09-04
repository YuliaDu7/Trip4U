import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { ShareContext } from './ContextShare';
import { DataContext } from '../ContextProvider';

export default function AddPlace(props) {
  const shareContext = useContext(ShareContext);
  const dataContext = useContext(DataContext);

  //states
  const [warningsSelect, setWarningsSelect] = useState('לא נבחרה אזהרה');
  const [warningsIDArray, setWarningIDsArray] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    placeCost: "",
    childCost: "",
    recommendedTime: ""
  });

  const [newPlace, setNewPlace] = useState({
    placeName: null,
    placeDescription: null,
    placeCost: 0,
    childCost: 0,
    recommendedTime: null,
    PlaceMap: null,
    warningId: [],
  });
  const [showNewPlace, setshowNewPlace] = useState(false);

  const [selectedOptionFromAC, setSelectedOptionFromAC] = useState(() => {
    let initialPlace = shareContext.placesForFinalTrip.find(place => place.placePlaceInTrip === props.order);
    return initialPlace ? props.dataPlaces.find(place => place.placeId === initialPlace.placeId) : '';

  });

  const [objectFromSession, setObjectFromSession] = useState("");


  //בודק שנבחר מקום מהרשימה
  const [acSelectedbool, setAcSelectedbool] = useState(false);
  //האם כבר נבחר מקום וחזרנו אחורה
  const [isPlaceChosen, setIsPlaceChosen] = useState(false);

  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [address, setAddress] = useState('');

  //פונקציה לפתיחת מקום חדש
  const ShowNewPlace = () => {
    //אם נבחר מקום שם
    if (selectedOptionFromAC) {
      //מחיקת המקום של ההשלמה האוטומטית
      props.removePlaceFromFinalTrip(selectedOptionFromAC.placeId);
      setIsPlaceChosen(false);
      let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
      selectionOptions = selectionOptions.filter(option => option.order !== props.order);
      sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));

      setSelectedOptionFromAC("");
      setObjectFromSession({});
    }
    //הצגת או הסתרת מקום חדש
    setshowNewPlace((prev) => !prev);
    //ביטול אפשרות לחפש מקום חדש
    if (!autocompleteDisabled) {
      setAutocompleteDisabled(true);
    } else {
      setAutocompleteDisabled(false);
    }
  };

  //בדיקת קיום מקום בשם הנתון
  const checkIfNameExists = (name) => {
    return props.dataPlaces.find((place) => place.placeName.trim() === name.trim());
  };

  useEffect(() => {
    let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
    const savedPlace = selectionOptions.find(option => option.order === props.order);
    if (savedPlace) {
      setSelectedOptionFromAC(savedPlace.place);
      setIsPlaceChosen(true);
      setAutocompleteDisabled(true);
      setObjectFromSession(savedPlace.place);
    } else {
      setSelectedOptionFromAC("");
      setIsPlaceChosen(false);
      setAutocompleteDisabled(false);
      setObjectFromSession("");
    }
  }, [shareContext.components, props.dataPlaces]);

  useEffect(() => {
    let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
    const savedPlace = selectionOptions.find(option => option.order === props.order);
    if (savedPlace) {
      setSelectedOptionFromAC(savedPlace.place);
      setIsPlaceChosen(true);
      setAutocompleteDisabled(true);
      setObjectFromSession(savedPlace.place);
    }
  }, []);

  useEffect(() => {
    if (selectedOptionFromAC && !shareContext.initialLoad && acSelectedbool) {
      props.funcPlacesForFinalTrip({ placeId: selectedOptionFromAC.placeId, placePlaceInTrip: props.order });
      setAcSelectedbool(false);
    }
  }, [selectedOptionFromAC, shareContext.initialLoad, acSelectedbool]);


  //פונקציה לשמירת מקום חדש בדאטא בייס
  const SavePlaceToDB = () => {
    let counter = 0;

    if (errors.description !== "" || errors.name !== "") {
      counter++;
      return;
    }
    //לא מילאו את השדות
    let tempErrors = { name: "", description: "", placeCost: "", childCost: "", recommendedTime: "" };
    if (newPlace.placeName == null || newPlace.placeName === "") {
      tempErrors.name = "שדה חובה";
      counter++;
    }
    if (newPlace.placeDescription == null || newPlace.placeDescription === "") {
      tempErrors.description = "שדה חובה";
      counter++;
    }

    if (newPlace.placeCost !==0 && isNaN(newPlace.placeCost)) {
      tempErrors.placeCost = "יש להזין מספר שלם בלבד";
      counter++;
    }
    if (newPlace.childCost !== 0 && isNaN(newPlace.childCost)) {
      tempErrors.childCost = "יש להזין מספר שלם בלבד";
      counter++;
    }

    if (newPlace.recommendedTime && !/^\d{2}:\d{2}$/.test(newPlace.recommendedTime)) {
      tempErrors.recommendedTime = "יש להזין שעה בפורמט XX:XX";
      counter++;
    }

    setErrors(tempErrors);
    if (counter === 0) {

      const cutPlaceName = newPlace.placeName.substring(0, 40);
      const cutNewPlace = { ...newPlace, placeName: cutPlaceName };

      fetch(dataContext.apiUrl + '/TripData/AddNewPlace', {
        method: 'POST',
        body: JSON.stringify(cutNewPlace),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
      })
        .then((response) => response.json())
        .then((data) => {
          props.funcPlacesForFinalTrip({ placeId: data, placePlaceInTrip: props.order });
          setSaveMessage('שמירה בוצעה במערכת');

          setIsPlaceChosen(true);
          setAutocompleteDisabled(true);
          setObjectFromSession(newPlace.placeName);

          let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
          selectionOptions.push({ place: newPlace.placeName, order: props.order });
          sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));
        })
        .catch((error) => {
          setSaveMessage('אירעה שגיאה. המקום לא נשמר.');
          console.log(error);
        });
    }
  };


  //פונקציה לטיפול בבחירת כתובת
  const handleSelect = async (value) => {
    setAddress(value);
    if (checkIfNameExists(value)) {
      setErrors({ ...errors, name: "מקום זה כבר קיים ברשימת המקומות" });
    }
    else {
      setErrors({ ...errors, name: "" })

      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      const googleMapsLink = `https://www.google.com/maps/place/@${latLng.lat},${latLng.lng},17z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0?entry=ttu`;

      setNewPlace({ ...newPlace, placeName: value, PlaceMap: googleMapsLink });
    }
  };


  return (
    <div style={{ border: "1px solid rgba(105, 126, 66, 0.5)", padding: '20px', margin: '10px 20% 0', borderRadius: '15px', color: "black" }}>
      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        <IconButton
          onClick={() => props.DeleteComponent("place", props.order)}
          style={{ marginRight: '84%', color: "red" }}
          aria-label="add to shopping cart"
        >
          <ClearIcon />
        </IconButton>
        <div style={{ marginRight: '84%' }}> מספר הצגה בטיול: {" " + props.order} </div>
        {isPlaceChosen ? (
          <div style={{ textAlign: 'center', width: '100%', margin: '20px 0' }}>
            <p style={{ color: '#697e42', fontSize: 20, }}>
              מקום זה נבחר
              <br />
              שם המקום: {objectFromSession}
            </p>
            <p style={{ fontSize: "15px" }} >ניתן למחוק ו/או להוסיף מקום חדש</p>
          </div>

        ) : (
          <>
            <Grid item xs={12}>
              <div style={{ width: "100%" }}>
                <h2> באיזה מקום ביקרתם?</h2>
                <Autocomplete
                  disablePortal
                  options={props.dataPlaces}
                  sx={{ width: 400, margin: '0 auto' }}
                  getOptionLabel={(option) => option.placeName || ''}
                  renderInput={(params) => <TextField {...params} label="חפש מקום..." />}
                  onChange={(e, selectedOption) => {
                    setSelectedOptionFromAC(selectedOption);
                    setAcSelectedbool(true)

                    if (selectedOption) {

                      let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
                      selectionOptions = selectionOptions.filter(option => option.order !== props.order);
                      // הוספת הבחירה החדשה לסשן סטורג
                      selectionOptions.push({ place: selectedOption.placeName, order: props.order });
                      sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));
                      setSelectedOptionFromAC(selectedOption);
                      setAcSelectedbool(true);
                      setObjectFromSession(selectedOption.placeName);
                    }

                  }}
                  value={selectedOptionFromAC || null}
                  disabled={autocompleteDisabled}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div>
                <br></br>

                <IconButton onClick={ShowNewPlace} color="primary" aria-label="add to shopping cart">
                  {autocompleteDisabled ? (
                    <>
                      <ClearIcon style={{ color: "#697e42" }} />
                      <span style={{ marginRight: '10px', color: 'black', fontSize: 20 }}>ביטול הוספת מקום</span>
                    </>
                  ) : (
                    <>
                      <AddIcon style={{ color: "#697e42" }} />
                      <span style={{ marginRight: '10px', color: 'black', fontSize: 20 }}>או הכניסו מקום חדש</span>
                    </>
                  )}
                </IconButton>

                <br />
              </div>
            </Grid>
            <br />
            <br />

            <div style={{ display: showNewPlace ? 'block' : 'none' }}>
              {/* הכנסת מקום חדש */}
              <Grid item xs={12}>
                <div>
                  <img
                    src='./pictures/placePic1.png'
                    alt='place picture'
                    style={{ width: '15%', marginRight: '75%', marginBottom: '-5px' }}
                  />
                  <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                    searchOptions={{
                      language: 'he', // מחזיר תוצאות בעברית
                      componentRestrictions: { country: 'il' } // מגביל את התוצאות לישראל בלבד
                    }}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <TextField
                          required
                          {...getInputProps({
                            label: "שם המקום",
                            variant: "outlined",
                            fullWidth: true,
                            error: errors.name !== "",
                            helperText: errors.name,
                          })}
                          style={{ width: "100%", marginBottom: '15px' }}
                        />
                        <div>
                          {loading ? <div>...טוען</div> : null}
                          {suggestions.map((suggestion) => {
                            const style = {
                              backgroundColor: suggestion.active ? "#fafafa" : "#ffffff"
                            };
                            return (
                              <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId || suggestion.description}>
                                {suggestion.description}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
              </Grid>

              {/* תיאור מקום חדש */}
              <Grid item xs={12}>
                <div>
                  <TextField
                    required
                    label=" תארו את המקום "
                    variant="outlined"
                    multiline
                    inputProps={{
                      maxLength: 200,
                    }}
                    error={errors.description !== ""}
                    helperText={errors.description}
                    maxRows={4}
                    style={{ width: "100%", marginBottom: '15px' }}
                    onChange={(e) => {
                      setNewPlace({ ...newPlace, placeDescription: e.target.value });
                      setErrors({ ...errors, description: "" });
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={12}>
                <Box style={{ margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px', marginBottom: 1 }}>
                  <TextField
                    label=" עלות כניסה למבוגר "
                    variant="outlined"
                    style={{ width: "49%", marginBottom: '15px', marginLeft: '10px' }}
                    onChange={(e) => { 
                      let value = e.target.value == "" ? 0 : e.target.value;
                      setNewPlace({ ...newPlace, placeCost: parseInt(value) }) 
                    }}
                    error={errors.placeCost !== ""}
                    helperText={errors.placeCost}
                  />
                  <TextField
                    label=" עלות כניסה לילד "
                    variant="outlined"
                    style={{ width: "49%", marginBottom: '15px' }}
                    onChange={(e) => { 
                      let value = e.target.value == "" ? 0 : e.target.value;
                      setNewPlace({ ...newPlace, childCost: parseInt(value) }) }}
                    error={errors.childCost !== ""}
                    helperText={errors.childCost}
                  />
                  <TextField
                    label=" קישור למקום למפה "
                    variant="outlined"
                    value={newPlace.PlaceMap || ""}
                    style={{ width: "49%", marginBottom: '15px', marginLeft: '10px' }}
                    disabled
                  />
                  <TextField
                    label="שעה מומלצת"
                    variant="outlined"
                    inputProps={{
                      maxLength: 5,
                    }}
                    style={{ width: "49%", marginBottom: '15px' }}
                    placeholder=" שעה לדוגמה: 10:00 "
                    onChange={(e) => { setNewPlace({ ...newPlace, recommendedTime: e.target.value }) }}
                    error={errors.recommendedTime !== ""}
                    helperText={errors.recommendedTime}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', marginRight: '30%', alignItems: 'center', justifyContent: 'flex-start' }}>
                הוסיפו אזהרה למקום במידה ויש
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={warningsSelect}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={(e) => {
                      setWarningsSelect(e.target.value);
                      let temp = props.warnings.find(item => item.warnDescription === e.target.value);
                      setWarningIDsArray([temp.warningId]);
                      setNewPlace({ ...newPlace, warningId: warningsIDArray });
                    }}
                  >
                    <MenuItem value="לא נבחרה אזהרה">
                      <em>לא נבחרה אזהרה</em>
                    </MenuItem>
                    {props.warnings.map((item) => (
                      <MenuItem
                        key={item.warningId}
                        value={item.warnDescription}
                      >
                        {item.warnDescription}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  style={{
                    backgroundColor: "#927070",
                    color: "white",
                    width: "20%",
                    margin: 20,
                    borderRadius: 10,
                    fontSize: 17
                  }}
                  onClick={SavePlaceToDB}
                >
                  שמירת בחירה
                </Button>
                <br />
                <p style={{ color: saveMessage === "שמירה בוצעה במערכת" ? 'green' : 'red' }}>{saveMessage}</p>          </Grid>
            </div>
          </>
        )}
      </Grid>
    </div>
  );
}
