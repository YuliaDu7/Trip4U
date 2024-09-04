import React, { useState, useEffect, useContext } from 'react'
import { Box, Button, Stepper, Step, StepLabel, Paper, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from "@mui/material";
import { ShareContext } from './ContextShare';

import FormPart1 from './FormPart1';
import FormPart2 from './FormPart2';
import FormPart3 from './FormPart3';
import { DataContext } from '../ContextProvider';
import { useNavigate } from 'react-router-dom';

export default function ShareTrip() {

  const navigate = useNavigate();
  const shareContext = useContext(ShareContext);
  const dataContext = useContext(DataContext)

  /*   הודעות שגיאה */
  const [alert, setAlert] = useState({ visibility: 'hidden', message: '' });
  const [alertWhenSaving, setAlertWhenSaving] = useState({
    visibility: 'hidden', message: ''
  });
  const [errors, setError] = useState({
    description: "",
    title: "",
    date: "",
    area: "",
  });


  const [tripId, SetTripId] = useState("");

  const [serverData, setServerData] = useState({
    dataPlaces: [],
    dataRests: [],
    dataWarnings: []
  });


  
  const [areaSelect, setAreaSelect] = useState('');
  
  const [seasonSelect, setSeasonSelect] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  const [images, setImages] = useState({ main: "", img1: "", img2: "" })

  
  const changeAreaSelect = (areaLetter) => {

    if (areaSelect === areaLetter) {
      setAreaSelect('');
      shareContext.setTrip({ ...shareContext.trip, area: '' });
    } else {
      setAreaSelect(areaLetter);
      shareContext.setTrip({ ...shareContext.trip, area: areaLetter });
    }
  }

  
  const changeSeasonSelect = (seasonLetter) => {

    if (seasonSelect === seasonLetter) {
      setSeasonSelect('');
      shareContext.setTrip({ ...shareContext.trip, season: '' });
    } else {
      setSeasonSelect(seasonLetter);
      shareContext.setTrip({ ...shareContext.trip, season: seasonLetter });
    }
  }

  //לבדיקת ולידציה סופית - האם נוספו מסעדות ולא הוכנסו להם פרטים
  const countComponentsByType = (components, targetType) => {
    return components.filter(comp => comp.type === targetType).length;
  };





  const SaveTrip = () => {
    setAlertWhenSaving({ visibility: 'hidden', message: "" })

    if (shareContext.newTagsForDB.length == 0) {

      shareContext.setTrip(prevTrip => ({
        ...prevTrip,
        placesInTrip: shareContext.placesForFinalTrip,
        typeID: shareContext.typesForFinalTrip,
        propID: shareContext.propsForFinalTrip,
        tagId: shareContext.tagsForFinalTrip.ids,
        restInTrip: shareContext.restsForFinalTrip
      }));
      setIsFinal(true);
    }
    else {

      let tagsIds;
      fetch(dataContext.apiUrl + `/TripData/AddTags`, {
        method: 'POST',
        body: JSON.stringify(shareContext.newTagsForDB),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
  
          tagsIds = shareContext.tagsForFinalTrip.ids
          data.forEach(tag => {
            tagsIds.push(tag)
          });

        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
        });
      setTimeout(() => {
        shareContext.setTrip(prevTrip => ({
          ...prevTrip,
          placesInTrip: shareContext.placesForFinalTrip,
          typeID: shareContext.typesForFinalTrip,
          propID: shareContext.propsForFinalTrip,
          tagId: tagsIds,
          restInTrip: shareContext.restsForFinalTrip
        }));


        setIsFinal(true);
      }, 500);

    }

  }


  ///fetch חיבור דאטא בייס
  
  useEffect(() => {

    sessionStorage.clear();

    fetch(dataContext.apiUrl + `/TripData/GetPandRid`)
      .then((response) => response.json())
      .then((data) => {
        setServerData({
          dataPlaces: data.places || [],
          dataRests: data.rest || [],
          dataWarnings: data.warnings || []
        });
        shareContext.setDataTags(data.tags)
      })
      .catch((error) => {
        console.log(error);
      });

    if (shareContext.initialLoad) {
      shareContext.setInitialLoad(false); // הופך ל-false אחרי שהטעינה הראשונית הסתיימה
    }
  }, []);


  //בודק האם זה הסוף - isfinal
  useEffect(() => {

    if (isFinal == true) {

      if (activeStep == 2) {
        if (shareContext.trip.typeID.length == 0) {
          setAlertWhenSaving({ visibility: 'visible', message: " נא לבחור לפחות סוג אחד לטיול " })
          setIsFinal(false)
          return;
        }
      }

      //fetch
      //api - מגיע מהפרופס של דף הוספת טיול 
      fetch(dataContext.apiUrl + `/TripData/AddTrip`, {
        method: 'POST',
        body: JSON.stringify(shareContext.trip),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          SetTripId(data);
        })
        .catch((error) => {
          console.log(error);
          setAlertWhenSaving({ visibility: 'visible', message: " שגיאה בשמירת טיול בשרת " })
        })

    }
  }, [isFinal]);

  // הוספת תמונות לשרת
  useEffect(() => {
    if (tripId !== "") {

      dataContext.UploadImage(`/UploadImage/UploadMainPic?tripId=${tripId}`, images.main);
      dataContext.UploadImage(`/UploadImage/UploadTripPic1?tripId=${tripId}`, images.img1);
      dataContext.UploadImage(`/UploadImage/UploadTripPic2?tripId=${tripId}`, images.img2);

      navigate("/HomePage")

    }
  }, [tripId]);



  //ולידציות
  const valideSteps = () => {
    let counter = 0;
    let tempErrors = {
      title: "",
      description: "",
      date: "",
      area: "",
    }
    if (activeStep == 0) {

      if (shareContext.trip.tripTitle === "") {
        tempErrors.title = "שדה חובה"
        counter++;
      }
      if (shareContext.trip.tripDescription === "") {
        tempErrors.description = "שדה חובה"
        counter++;
      }
      if (shareContext.trip.area === null || shareContext.trip.area == "") {
        tempErrors.area = "נא לבחור אזור"
        counter++;
      }

      if (!shareContext.trip.tripDate) {
        tempErrors.date = "נא להכניס תאריך"
        counter++;

      } else {
        let DateSplit = shareContext.trip.tripDate.split('-');
        let year = parseInt(DateSplit[0]);

        if (year > 2024 || year < 1990) {
          tempErrors.date = "נא להכניס תאריך בין 1990 ל2024"
          counter++;
        }

      }
      if (counter > 0) {
        setError(tempErrors);
        return false;
      }
      else return true;
    }
    else if (activeStep == 1) {
      let numberOfPlacesComponents = countComponentsByType(shareContext.components, 'place');
      let numberOfRestaurantsComponents = countComponentsByType(shareContext.components, 'restaurant');

      if (shareContext.components.length == 0) {
        setAlert({ visibility: 'visible', message: "   נא לבחור לפחות מסעדה אחת או מקום אחד    " })

        return false;
      }
      else if (numberOfPlacesComponents !== shareContext.placesForFinalTrip.length || numberOfRestaurantsComponents !== shareContext.restsForFinalTrip.length) {
        setAlert({ visibility: 'visible', message: "  נא להכניס פרטים למסעדה או מקום  שנבחרו  " })

        return false;
      }
      else {
        setAlert({ visibility: 'hidden', message: '' });
        return true;
      }
    }
  }


  //טופס מחולק
  const steps = ['התחלה ', 'אמצע', 'סיום'];
  const [activeStep, setActiveStep] = useState(0);
  //משנה גודל מספרים ב1-2-3 של הטופס
  const theme = createTheme({ typography: { fontSize: 17 } });

  //

  //מעבר בין חלקי הטופס
  const handleNext = () => {
    if (valideSteps()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  {/*  טופס מחולק - הפונקציה */ }
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormPart1
            errors={errors}
            setError={setError}
            changeAreaSelect={changeAreaSelect}
            areaSelect={areaSelect}
            changeSeasonSelect={changeSeasonSelect}
            seasonSelect={seasonSelect}

          />
        );
      case 1:
        return (
          <FormPart2

            serverData={serverData}
            alert={alert}
            setAlert={setAlert}
            images={images}
            setImages={setImages}
          />
        );
      case 2:
        return (
          <FormPart3
            SaveTrip={SaveTrip}
            alertWhenSaving={alertWhenSaving}
            setAlertWhenSaving={setAlertWhenSaving}
          />
        );
      default:
        return <div>שגיאה</div>;
    }
  };


  return (

    <div style={{
      margin: '0 auto',
      textAlign: 'center',
      direction: 'rtl',
      color: "#697e42",
      fontFamily: "inherit",
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <p onClick={() => navigate(-1)} style={{ marginTop: "55px", cursor: "pointer", textAlign: "right", position: "absolute", top: "10%", marginRight: 50 }}> <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px", marginRight: 50 }} />בחזרה לעמוד הקודם  </p>

      {/* כותרת */}
      <div>
        <h1 style={{ fontFamily: 'inherit', fontSize: '50px' }}>ספרו על הטיול שלכם</h1>
      </div>

      {/* טופס מחולק */}
      <Paper style={{ width: '1200px', padding: 16, maxWidth: '90%', margin: '0 auto' }}>
        <ThemeProvider theme={theme}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#697e42', // circle color (COMPLETED)
                  },
                  '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                  {
                    color: '#697e42', // Just text label (COMPLETED)
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#E1E5D9', // circle color (ACTIVE)

                  },
                  '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                  {
                    color: 'fff', // Just text label (ACTIVE)
                  },
                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                    fill: 'black', // circle's number (ACTIVE)
                  },
                  "& .MuiStepConnector-horizontal": {
                    paddingLeft: '5px'
                  }
                }}>
                <StepLabel></StepLabel>
              </Step>
            ))}
          </Stepper>
        </ThemeProvider>

        <Box mt={8}>
          {renderStepContent(activeStep)}
        </Box>


        {/* כפתורי חזרה והבא */}
        {activeStep < 2 && (
          <div style={{ margin: 20, float: 'left', display: 'flex', alignItems: 'center' }}>
            <Button
              disabled={activeStep == 0}
              onClick={handleBack}
              variant="outlined"
              style={{
                backgroundColor: '#fff',
                color: 'black',
                border: '1px solid #697e42',
                marginRight: 8,
                fontFamily: "inherit",
                display: activeStep == 0 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              startIcon={<ArrowForwardIcon style={{
                cursor: 'pointer',
                fontSize: '30px',
                margin: '0 -20 0 20',
              }} />}
            >
              חזור
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              style={{
                height: '44px',
                minWidth: '100px',
                backgroundColor: '#697e42',
                color: 'white',
                margin: 8,
                fontFamily: "inherit",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              endIcon={<ArrowBackIcon style={{
                cursor: 'pointer',
                fontSize: '30px',
                margin: '0 20 0 -20'
              }} />}
            >
              הבא
            </Button>
          </div>
        )}

        {activeStep === 2 && (
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <img
                src='./pictures/ShareSavePic.png'
                alt='Share save pic'
                style={{ width: "18%", marginBottom: '-10px', marginRight: '4%' }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleBack}
                style={{
                  backgroundColor: '#fff',
                  color: 'black',
                  border: '1px solid #697e42',
                  marginRight: 8, // מרווח בין הכפתורים
                  fontFamily: "inherit",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                startIcon={<ArrowForwardIcon style={{
                  cursor: 'pointer',
                  fontSize: '30px',
                  margin: '0 -20 0 20',
                }} />}
              >
                חזור
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  backgroundColor: "#927070",
                  color: "white",
                  width: 150,
                  padding: 10,
                  borderRadius: 10,
                  fontSize: 17,
                  marginTop: "-20px",
                }}
                variant="contained"
                onClick={SaveTrip}
              >
                שמור טיול
              </Button>
            </Grid>
          </Grid>
        )}

      </Paper>

    </div>

  )
}
