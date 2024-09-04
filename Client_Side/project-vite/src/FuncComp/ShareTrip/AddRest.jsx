import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Autocomplete from '@mui/material/Autocomplete';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { ShareContext } from './ContextShare';
import { DataContext } from '../ContextProvider';

export default function AddRest(props) {

  const shareContext = useContext(ShareContext);
  const dataContext = useContext(DataContext);

  const [showNewRest, setShowNewRest] = useState(false);
  const [selectedOptionFromAC, setSelectedOptionFromAC] = useState(() => {
    let initialRest = shareContext.restsForFinalTrip.find(rest => rest.restPlaceInTrip === props.order);
    return initialRest ? props.dataRests.find(rest => rest.restId === initialRest.restId) : '';
  });

  //בודק שנבחרה מסעדה מהרשימה
  const [acSelectedbool, setAcSelectedbool] = useState(false);

  const [isRestChosen, setIsRestChosen] = useState(false);
  const [objectFromSession, setObjectFromSession] = useState("");


  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [newRest, setNewRest] = useState({
    restName: null,
    restDescription: null,
    restURL: null,
    restMap: null,
    restRating: null,
    isKosher: null,
    avgCost: null,
  });
  const [kosherValue, setKosherValue] = useState("לא ידועה כשרות");
  const [rateValue, setRateValue] = useState(3);
  const [saveMessage, setSaveMessage] = useState('');
  const [errors, setErrors] = useState({ name: "", description: "", avgCost: "", });
  const [address, setAddress] = useState('');

  const kosherArray = [
    { id: 1, text: "המסעדה כשרה" },
    { id: 0, text: "המסעדה לא כשרה" },
    { id: 2, text: "לא ידועה כשרות" },
  ];

  const checkIfNameExists = (name) => {
    return props.dataRests.find((rest) => rest.restName.trim() === name.trim());
  }

  useEffect(() => {
    let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
    const savedRest = selectionOptions.find(option => option.order === props.order);
    if (savedRest) {
      setSelectedOptionFromAC(savedRest.restName);
      setIsRestChosen(true);
      setAutocompleteDisabled(true);
      setObjectFromSession(savedRest.restName);
    } else {
      setSelectedOptionFromAC("");
      setIsRestChosen(false);
      setAutocompleteDisabled(false);
      setObjectFromSession("");
    }
  }, [shareContext.components, props.dataRests]);

  useEffect(() => {
    let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
    const savedRest = selectionOptions.find(option => option.order === props.order);
    if (savedRest) {
      setSelectedOptionFromAC(savedRest.restName);
      setIsRestChosen(true);
      setAutocompleteDisabled(true);
      setObjectFromSession(savedRest.restName);
    }
  }, []);


  useEffect(() => {
    if (selectedOptionFromAC && acSelectedbool) {

      props.funcRestsForFinalTrip({
        restaurantId: selectedOptionFromAC?.restaurantId,
        restPlaceInTrip: props.order
      });
      setAcSelectedbool(false);
    }
  }, [selectedOptionFromAC, acSelectedbool]);

  const SaveRestToDB = () => {
    let counter = 0;
    if (errors.description !== "" || errors.name !== "") {
      counter++;
      return;
    }

    let tempErrors = { name: "", description: "", avgCost: "" };
    if (newRest.restName == null || newRest.restName === "") {
      tempErrors.name = "שדה חובה";
      counter++;
    }
   
    if (newRest.restDescription == null || newRest.restDescription === "") {
      tempErrors.description = "שדה חובה";
      counter++;
    }

    if (newRest.avgCost !== "" && isNaN(newRest.avgCost)) {
      tempErrors.avgCost = "יש להזין מספר בלבד";
      counter++;
    }
   

    setErrors(tempErrors);

    if (counter == 0) {
      let cutRestName = newRest.restName.substring(0, 40);
      let cutNewRest = { ...newRest, restName: cutRestName };

      fetch(dataContext.apiUrl + `/TripData/AddNewRest`, {
        method: 'POST',
        body: JSON.stringify(cutNewRest),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
      })
        .then((response) => response.json())
        .then((data) => {
          setSaveMessage('שמירה בוצעה במערכת');
          props.funcRestsForFinalTrip({ restaurantId: data, restPlaceInTrip: props.order });

          setIsRestChosen(true);
          setAutocompleteDisabled(true);
          setObjectFromSession(newRest.restName);

          let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
          selectionOptions.push({ restName: newRest.restName, order: props.order });
          sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));
        })
        .catch((error) => {
          setSaveMessage('אירעה שגיאה. המקום לא נשמר.');
          console.log(error);
        });
    }
  }

  const ShowNewRest = () => {
    if (selectedOptionFromAC) {
      props.removeRestaurantFromFinalTrip(selectedOptionFromAC.restaurantId);

      let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
      selectionOptions = selectionOptions.filter(rest => rest.order !== props.order);
      sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));

      setSelectedOptionFromAC("");
      setObjectFromSession("");
    }
    setShowNewRest((prev) => !prev);
    setAutocompleteDisabled(!autocompleteDisabled);
  };
const handleSelect = async (value) => {
    setAddress(value);
    if (checkIfNameExists(value)) {
        setErrors({ ...errors, name: "מסעדה זו כבר קיימת ברשימת המסעדות" });
    } else {
        setErrors({ ...errors, name: "" });
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        const googleMapsLink = `https://www.google.com/maps/place/@${latLng.lat},${latLng.lng},17z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0?entry=ttu`;

        const placeId = results[0].place_id;
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId, fields: ['website'] }, (place, status) => {
          
      const websiteURL = place.website===undefined?   `https://www.google.com/search?q=${value}`:place.website;
                setNewRest({ ...newRest, restName: value, restMap: googleMapsLink, restURL: websiteURL });
            
        });
    }
};

  //אם נבחר 2 - זה ריק
  // אם נבחר 1 זה כשר
  // אם נבחר 0 זה לא כשר
  const changeKosher = (selectedValue) => {
    if (selectedValue !== 2) {
      setNewRest({ ...newRest, isKosher: selectedValue })
    }
    else {
      setNewRest({ ...newRest, isKosher: null })

    }

  }



  return (
    <div style={{ backgroundColor: "rgba(105, 126, 66, 0.05)", padding: '20px', margin: '10px 20% 0', borderRadius: '15px', color: "black" }}>
      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        <IconButton onClick={() => props.DeleteComponent("restaurant", props.order)} style={{ marginRight: '84%', color: "red" }} aria-label="add to shopping cart">
          <ClearIcon />
        </IconButton>
        <div style={{ marginRight: '84%' }}> מספר הצגה בטיול: {" " + props.order} </div>
        {isRestChosen ? (
          <div style={{ textAlign: 'center', width: '100%', margin: '20px 0' }}>
            <p style={{ color: '#697e42', fontSize: 20, }}>
              מסעדה זו נבחרה
              <br />
              שם המסעדה: {objectFromSession}
            </p>
            <p style={{ fontSize: "15px" }} >ניתן למחוק ו/או להוסיף מסעדה חדשה</p>
          </div>

        ) : (
          <>

            <Grid item xs={12}>
              <div style={{ width: "100%" }}>
                <h2>באיזו מסעדה ביקרתם?</h2>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={props.dataRests}
                  sx={{ width: 400, margin: '0 auto' }}
                  getOptionLabel={(option) => option.restName || null}
                  isOptionEqualToValue={(option, value) => option.restId === value.restId}
                  renderInput={(params) => <TextField {...params} label="חפש מסעדה..." />}
                  onChange={(e, selectedOption) => {
                    setSelectedOptionFromAC(selectedOption);
                    setAcSelectedbool(true);

                    if (selectedOption) {

                      let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
                      selectionOptions = selectionOptions.filter(option => option.order !== props.order);
                      // הוספת הבחירה החדשה לסשן סטורג
                      selectionOptions.push({ restName: selectedOption.restName, order: props.order });
                      sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));
                      setSelectedOptionFromAC({
                        ...selectedOption,
                        restName: selectedOption.restName.trim()
                      });
                      setAcSelectedbool(true);
                      setObjectFromSession(selectedOption.restName);
                    }
                  }}
                  value={selectedOptionFromAC || null}
                  disabled={autocompleteDisabled}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div>
                <br />
                <br />
                <IconButton onClick={ShowNewRest} color="primary" aria-label="add to shopping cart">
                  {autocompleteDisabled ? (
                    <>
                      <ClearIcon style={{ color: "#697e42" }} />
                      <span style={{ marginRight: '10px', color: 'black', fontSize: 20 }}>ביטול הוספת מסעדה</span>
                    </>
                  ) : (
                    <>
                      <AddIcon style={{ color: "#697e42" }} />
                      <span style={{ marginRight: '10px', color: 'black', fontSize: 20 }}>או הכניסו מסעדה חדשה</span>
                    </>
                  )}
                </IconButton>
                <br />
              </div>
            </Grid>

            <br />
            <br />

            <div style={{ display: showNewRest ? 'block' : 'none' }}>
              {/* הכנסת מסעדה חדשה */}
              <Grid item xs={12}>
                <div>
                  <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                    searchOptions={{
                      types: ['restaurant'], language: 'he', componentRestrictions: { country: 'il' } // מגביל את התוצאות לישראל בלבד
                    }}              >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <TextField
                        required
                          {...getInputProps({
                            label: "שם המסעדה",
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

              {/* תיאור מסעדה חדשה */}
              <Grid item xs={12}>
                <div>
                  <TextField
                    required
                    label=" תארו את המסעדה... "
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
                      setNewRest({ ...newRest, restDescription: e.target.value });
                      setErrors({ ...errors, description: "" });
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={12}>
                <Box style={{ margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px', marginBottom: 1 }}>
                  <TextField
                    label="  קישור לאתר המסעדה  "
                    variant="outlined"
                    value={newRest.restURL || ""}
                    style={{ width: "49%", marginBottom: '15px', marginLeft: '10px' }}
                    onChange={(e) => { setNewRest({ ...newRest, restURL: e.target.value }) }}
                  />
                  <TextField
                    label="  קישור למסעדה במפה  "
                    variant="outlined"
                    value={newRest.restMap || ""}
                    style={{ width: "49%", marginBottom: '15px' }}
                    disabled
                  />
                  <TextField
                    label=" עלות ממוצעת לאדם    "
                    variant="outlined"
                    style={{ width: "49%", marginLeft: '10px', marginBottom: '10px' }}
                    onChange={(e) => { 
                      let value = e.target.value == "" ? 0 : e.target.value;
                      setNewRest({ ...newRest, avgCost: parseInt(value) }) 
                    }}
                    error={errors.avgCost !== ""}
                    helperText={errors.avgCost}
                  />
                  <Box style={{ width: "48%", border: '1px solid #ccc', alignSelf: 'flex-start' }}>
                    {/* הוספת דירוג */}
                    מה הדירוג שלכם למסעדה?
                    <div dir='rtl'>
                      
                      <Rating
                        name="simple-controlled"
                        value={rateValue}
                        onChange={(e) => {
                          setRateValue(parseInt(e.target.value));
                          setNewRest({ ...newRest, restRating: parseInt(e.target.value) });
                        }}
                      />
                    </div>
                  </Box>
                </Box>
              </Grid>

              <br></br>
              {/* combo box כשרות - */}
              <Grid item xs={12} sx={{ display: 'flex', marginRight: '30%', alignItems: 'center', justifyContent: 'flex-start' }}>
                <span style={{ alignItems: 'center' }}>האם המסעדה כשרה?</span>
                <FormControl sx={{ m: 1, minWidth: 120, marginBottom: '15px', color: "black" }}>
                  <Select
                    value={kosherValue}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={(e) => {
                      let tempFind = kosherArray.find((item) => item.text == e.target.value);
                      changeKosher(tempFind.id);
                      setKosherValue(e.target.value);
                    }}
                  >
                    {/* הוספת קומבו בוקס לפי הסטייט של האזהרות */}
                    {kosherArray.map((item) => (
                      <MenuItem value={item.text} key={item.id} id={item.id}>
                        {item.text}
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
                  onClick={SaveRestToDB}
                >
                  שמירת בחירה
                </Button>
                <br></br>
                <p style={{ color: saveMessage === "שמירה בוצעה במערכת" ? 'green' : 'red' }}>{saveMessage}</p>
              </Grid>
            </div>
          </>
        )}
      </Grid>
    </div>
  );
}
