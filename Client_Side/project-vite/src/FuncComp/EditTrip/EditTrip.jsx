import React, { useState, useEffect, useContext } from 'react'
import { Alert, Box } from '@mui/material';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useNavigate, useParams } from 'react-router-dom';
import Tags from '../ShareTrip/Tags';
import Tips from '../ShareTrip/Tips';
import Types from '../ShareTrip/Types';
import Properties from '../ShareTrip/Properties';
import { DataContext } from '../ContextProvider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function EditTrip() {

    const dataContext = useContext(DataContext);
    const apiUrl = dataContext.apiUrl;

    const navigate = useNavigate();
    const params = useParams();
    //סטייטים
    //לתמוך בעברית מימין לשמאל
    const theme = createTheme({ direction: 'rtl' })
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const [tripToEdit, setTripToEdit] = useState({});
    const [buttonsForPage, setButtonsForPage] = useState({
        areaSelect: "",
        seasonSelect: "",
        title: "",
        date: "",
        typesIds: [],
        propsIds: [],
    });


    //מהדאטא בייס
    const [dataTags, setDataTags] = useState([])
    const [newTagsForDB, setNewTagsForDB] = useState([])


    const [errors, setError] = useState({
        description: "",
        title: "",
        date: "",
    })

    //בשביל העלאת תמונות
    const [errorMessage, setErrorMessage] = useState({
        display: 'none', message: ''
    })

    //מה שקשור לדיאלוג ומחיקות התמונה
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const handleOpenDeleteDialog = (key) => {
        setImageToDelete(key);
        setOpenDeleteDialog(true);
    };
    const handleDeleteImage = () => {
        setImages(prev => ({
            ...prev,
            [imageToDelete]: { url: './pictures/defaultPicture.png', file: null }
        }));
        setOpenDeleteDialog(false); // סגירת הדיאלוג לאחר המחיקה
    };

    const [isFinal, setIsFinal] = useState(false);
    const [images, setImages] = useState({
        mainPic: { url: null, file: null },
        tripPic1: { url: null, file: null },
        tripPic2: { url: null, file: null }
    });


    //פונקציות
    useEffect(() => {
        fetchTripData(),
            fetchTags(),
            fetchTripPics(params.tripId)

    }, [dataContext.loggedUser]);

    const fetchTripData = () => {
        fetch(`${apiUrl}/TripData/GetTripforEdit?tripID=${params.tripId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTripToEdit(data);
                setButtonsForPage({
                    areaSelect: data.area,
                    seasonSelect: data.season,
                    title: data.tripTitle,
                    date: data.tripDate.slice(0, 10),
                    typesIds: data.typeID,
                    propsIds: data.propID,
                });
                
            })
            .catch(error => {
                console.log(error);
            });
    };

    const fetchTags = () => {
        fetch(`${apiUrl}/TripData/GetTags`)
            .then(response => response.json())
            .then(data => {
                setDataTags(data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (dataTags.length > 0 && tripToEdit?.tags?.length > 0) {
            const tripTags = tripToEdit.tags.map(tag => tag.tagId);
            const filteredTags = dataTags.filter(tag => !tripTags.includes(tag.tagId));
            setDataTags(filteredTags);
        }

    }, [dataTags.length, tripToEdit?.tags?.length])


    //תמונות של טיולים
    const fetchTripPics = (tripId) => {
        const imageEndpoints = [
            { key: 'mainPic', url: `/GetImage/GetMainPic?tripid=${tripId}` },
            { key: 'tripPic1', url: `/GetImage/GetTripPic1?tripid=${tripId}` },
            { key: 'tripPic2', url: `/GetImage/GetTripPic2?tripid=${tripId}` },
        ];

        imageEndpoints.forEach(endpoint => {
            dataContext.GetImage(endpoint.url)
                .then((imageUrl) => {
                    setImages(prevImages => ({
                        ...prevImages,
                        [endpoint.key]: { ...prevImages[endpoint.key], url: imageUrl }
                    }));
                })
                .catch(() => {
                    setImages(prevImages => ({
                        ...prevImages,
                        [endpoint.key]: { ...prevImages[endpoint.key], url: null }
                    }));
                });
        });
    };

    const handleImageUpload = (e, imageKey) => {
        const file = e.target.files[0];
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage({ display: 'inline-flex', message: 'נא לבחור קובץ עד 2MB' });
            e.target.value = null;
        } else {
            setErrorMessage({ display: 'none', message: '' });
            const imageUrl = URL.createObjectURL(file);
            setImages(prev => ({ ...prev, [imageKey]: { url: imageUrl, file: file } }));
        }
    };

    const SaveTrip = () => {
        let counter = 0;
        let tempErrors = {
            title: "",
            description: "",
            date: "",
        }


        if (tripToEdit.tripTitle.trim() === "") {
            tempErrors.title = "שדה חובה"
            counter++;

        }
        if (tripToEdit.tripDescription.trim() === "") {
            tempErrors.description = "שדה חובה"
            counter++;
        }

        if (!tripToEdit.tripDate) {
            tempErrors.date = "נא להכניס תאריך"
            counter++;
        }
        else {
            let DateSplit = tripToEdit.tripDate.split('-');
            let year = parseInt(DateSplit[0]);

            if (year > 2024 || year < 1990) {
                tempErrors.date = "נא להכניס תאריך בין 1990 ל2024"
                counter++;
            }

        }

        if (counter > 0) {
            setError(tempErrors)
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
        else {
            let tripId = params.tripId
            if (images.mainPic.file) {
                dataContext.UploadImage(`/UploadImage/UploadMainPic?tripId=${tripId}`, images.mainPic.file);
            } else if (images.mainPic.url === './pictures/defaultPicture.png') {
                dataContext.DeleteImage(`/DeleteImage/DeleteMainPic?tripId=${tripId}`);
            }

            if (images.tripPic1.file) {
                dataContext.UploadImage(`/UploadImage/UploadTripPic1?tripId=${tripId}`, images.tripPic1.file);
            } else if (images.tripPic1.url === './pictures/defaultPicture.png') {
                dataContext.DeleteImage(`/DeleteImage/DeleteTripPic1?tripId=${tripId}`);
            }

            if (images.tripPic2.file) {
                dataContext.UploadImage(`/UploadImage/UploadTripPic2?tripId=${tripId}`, images.tripPic2.file);
            } else if (images.tripPic2.url === './pictures/defaultPicture.png') {
                dataContext.DeleteImage(`/DeleteImage/DeleteTripPic2?tripId=${tripId}`);
            }


            let tagsIds = tripToEdit.tags.map(tag => tag.tagId);
            let tripDataToSave;
            if (newTagsForDB.length > 0) {
                fetch(apiUrl + `/TripData/AddTags`, {
                    method: 'POST',
                    body: JSON.stringify(newTagsForDB),
                    headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
                })
                    .then((response) => {
                        if (!response.ok) {
                            console.log("שגיאה בשרת", response);
                        }
                        return response.text().then(text => text ? JSON.parse(text) : {});
                    })
                    .then((data) => {
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
                    tripDataToSave = {
                        ...tripToEdit,
                        tagId: tagsIds // מחליפים את המערך של התגיות במערך של המספרים שלהם

                    };
                    setTripToEdit(tripDataToSave)
                    setIsFinal(true);
                }, 500);

            }
            else {
                tripDataToSave = {
                    ...tripToEdit,
                    tagId: tagsIds // מחליפים את המערך של התגיות במערך של המספרים שלהם
                };
                setTripToEdit(tripDataToSave)
                setIsFinal(true);
            }

        }
    }


    useEffect(() => {
        if (isFinal == true) {
            fetch(apiUrl + `/TripData/EditTrip`, {
                method: 'PUT',
                body: JSON.stringify(tripToEdit),
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', })

            })
                .then((response) => {

                    if (!response.ok) {
                        console.log("שגיאה בשרת", response);
                    }
                    //כי זה לא מקבל כלום ברספונס ועשה שגיאה
                    return response.text().then(text => text ? JSON.parse(text) : {});
                })
                .then((data) => {
                    console.log("trip for edit: ", tripToEdit);
                    navigate("/HomePage")
                })
                .catch((error) => {
                    console.log(error);
                });
        }


    }, [isFinal])

    const changeAreaSelect = (areaLetter) => {

        if (buttonsForPage.areaSelect === areaLetter) {
            setButtonsForPage((prevButton) => ({ ...prevButton, areaSelect: '' }));
            setTripToEdit({ ...tripToEdit, area: '' })

        } else {
            setButtonsForPage((prevButton) => ({ ...prevButton, areaSelect: areaLetter }));
            setTripToEdit({ ...tripToEdit, area: areaLetter })
        }
    }

    const changeSeasonSelect = (seasonLetter) => {

        if (buttonsForPage.seasonSelect === seasonLetter) {
            setButtonsForPage((prevButton) => ({ ...prevButton, seasonSelect: '' }));
            setTripToEdit({ ...tripToEdit, season: '' })

        } else {
            setButtonsForPage((prevButton) => ({ ...prevButton, seasonSelect: seasonLetter }));
            setTripToEdit({ ...tripToEdit, season: seasonLetter })
        }

    }





    return (
        <div style={{ margin: '0 auto', textAlign: 'center', direction: 'rtl', color: "#697e42", fontFamily: "inherit", }}>

            <h4 onClick={() => navigate('/Profile')} style={{ cursor: 'pointer', textAlign: "right", position: "absolute", top: 70, right: "5%" }}>
                <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} /> חזרה לפרופיל
            </h4>


            <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
                        <h1 style={{ fontFamily: 'inherit', fontSize: '50px', marginLeft: '10px' }}>עריכת טיול</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
                        <p>עדכנו את השדות שברצונכם לשנות</p>
                        <Tooltip title="ניתן לערוך פרטים בסיסיים על הטיול בלבד. על מנת לשנות פרטים נוספים (כגון שינוי מקומות או מסעדות) - עליכם לשתף טיול חדש">
                            <IconButton>
                                <InfoIcon fontSize="small" style={{ color: '#697e42' }} />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <br></br>
                    {/* כותרת הטיול */}
                    <TextField
                        required
                        label="כותרת הטיול"
                        inputProps={{
                            maxLength: 40,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        style={{ width: "50%" }}
                        value={buttonsForPage.title}
                        error={errors.title !== ""}
                        helperText={errors.title}
                        onChange={(e) => {
                            //לתצוגה
                            setButtonsForPage((prevButton) => ({ ...prevButton, title: e.target.value }));
                            //לשמירת טיול סופי
                            setTripToEdit({ ...tripToEdit, tripTitle: e.target.value })
                        }}
                    />
                    <br /><br /><br /><br />

                    {/* תמונות */}

                    <Dialog
                        open={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        dir='rtl'
                    >
                        <DialogTitle id="alert-dialog-title">מחיקת תמונה</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                שימו לב: אתם עומדים למחוק את התמונה לצמיתות לאחר לחיצה על עדכון הטיול, האם תרצו להמשיך?                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                style={{ color: 'white', backgroundColor: "#f44336", border: '1px solid #f44336', borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
                                onClick={() => setOpenDeleteDialog(false)}
                            >
                                ביטול
                            </Button>
                            <Button
                                style={{ color: 'white', backgroundColor: "#7C99AB", border: '1px solid #7C99AB', borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
                                onClick={handleDeleteImage}
                            >
                                כן, מחק
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>

                        עדכון תמונות הטיול
                    </h3>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                        <Grid container spacing={4} justifyContent="center" alignItems="center">
                            {Object.keys(images).map((key, index) => (
                                <Grid item key={index}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 100,
                                                width: 100,
                                                borderRadius: 1,
                                                border: '1px solid #ccc',
                                                objectFit: 'cover',
                                                marginBottom: '10px',
                                            }}
                                            src={images[key].url ? images[key].url : images[key].file}
                                            alt={`Image ${index + 1}`}
                                        />

                                        <Box display="flex" alignItems="center">
                                            <Button
                                                style={{
                                                    justifyContent: 'center',
                                                    backgroundColor: '#fff',
                                                    color: '#737373',
                                                }}
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon style={{ color: '#737373' }} />}
                                            >
                                                {images[key].url === './pictures/defaultPicture.png'
                                                    ? 'הוסף תמונה חדשה'
                                                    : 'שינוי '}
                                                <input
                                                    type="file"
                                                    accept="image/jpg, image/jpeg"
                                                    hidden
                                                    onChange={(e) => handleImageUpload(e, key)}
                                                />
                                            </Button>

                                            {/* מחיקת תמונה */}
                                            {images[key].url !== './pictures/defaultPicture.png' && (
                                                <Button
                                                    style={{ height: '35px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', color: '#737373', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '5px', padding: 0 }}
                                                    onClick={() => handleOpenDeleteDialog(key)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>


                    <Alert style={{ margin: '0 auto', textAlign: 'center', width: '50%', display: errorMessage.display }} severity="error">
                        {errorMessage.message}
                    </Alert>



                    <br /><br /><br />
                    {/* אזור בארץ */}
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>שינוי חלק של הארץ:</h3>
                    <div>
                        {['N', 'C', 'S'].map((value, index) => (
                            <Button
                                key={value}
                                value={value}
                                onClick={() => {
                                    changeAreaSelect(value);
                                }}
                                style={{
                                    marginRight: 35,
                                    backgroundColor: buttonsForPage.areaSelect === value ? "#697e42" : "white",
                                    color: buttonsForPage.areaSelect === value ? "white" : "#697e42",
                                    border: buttonsForPage.areaSelect === value ? 'none' : '1px solid #697e42',
                                    borderRadius: 10,
                                    padding: "8px 40px",
                                    zIndex: 1,
                                    position: "relative",
                                }}
                            >
                                {value === 'N' ? 'צפון' : value === 'C' ? 'מרכז' : 'דרום'}
                            </Button>
                        ))}
                    </div>
                    <br /><br />

                    {/* תיאור כללי */}
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>שינוי התיאור הכללי של הטיול:</h3>
                    <TextField
                        required
                        lebel='* תיאור כללי... '
                        variant="outlined"
                        multiline
                        maxRows={4}
                        defaultValue={tripToEdit.tripDescription}
                        style={{ width: "50%" }}
                        error={errors.description !== ""}
                        helperText={errors.description}
                        onChange={(e) => {
                            setTripToEdit({ ...tripToEdit, tripDescription: e.target.value })
                        }}
                    />
                    <br /><br /><br />

                    {/* כפתור תאריך טיול */}
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>שינוי תאריך הטיול:</h3>

                    <Stack component="form" noValidate spacing={3}>
                        <div dir="rtl">
                            <TextField
                                id="date"
                                type="date"
                                value={buttonsForPage.date}
                                sx={{ width: 220 }}
                                style={{ width: "20%" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{ max: '9999-12-31' }}
                                error={errors.date !== ""}
                                helperText={errors.date}
                                onChange={(e) => {
                                    setTripToEdit({ ...tripToEdit, tripDate: e.target.value })
                                    setButtonsForPage((prevButton) => ({ ...prevButton, date: e.target.value }));
                                }}
                            />
                        </div>
                    </Stack>
                    <br /><br />


                    {/* עונה */}
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>שינוי עונה לטיול:</h3>
                    <div>
                        {[
                            { value: 'ק', label: 'קיץ' },
                            { value: 'א', label: 'אביב' },
                            { value: 'ס', label: 'סתיו' },
                            { value: 'ח', label: 'חורף' }
                        ].map((season) => (
                            <Button
                                key={season.value}
                                value={season.value}
                                onClick={(e) => {
                                    changeSeasonSelect(season.value);
                                }}
                                style={{
                                    marginRight: 35,
                                    backgroundColor: buttonsForPage.seasonSelect === season.value ? "#697e42" : "white",
                                    color: buttonsForPage.seasonSelect === season.value ? "white" : "#697e42",
                                    border: buttonsForPage.seasonSelect === season.value ? 'none' : '1px solid #697e42',
                                    borderRadius: 10,
                                    padding: "8px 40px",
                                    zIndex: 1,
                                    position: "relative",
                                }}
                            >
                                {season.label}
                            </Button>
                        ))}
                    </div>

                    <br /><br />
                    {/* סוגי הטיול */}

                    <Types
                        mode={"edit"}
                        typesIds={buttonsForPage.typesIds}
                        tripToEdit={tripToEdit}
                        setTripToEdit={setTripToEdit}
                    />


                    {/* מאפייני הטיול */}
                    <Properties
                        mode={"edit"}
                        tripToEdit={tripToEdit}
                        setTripToEdit={setTripToEdit}
                        propsIds={buttonsForPage.propsIds}
                    />

                    <br /><br />
                    {/*  תגיות */}
                    <Tags
                        mode={"edit"}
                        dataTags={dataTags}
                        setDataTags={setDataTags}
                        tripToEdit={tripToEdit}
                        setTripToEdit={setTripToEdit}
                        newTagsForDB={newTagsForDB}
                        setNewTagsForDB={setNewTagsForDB}
                    />
                    {/* טיפים  */}
                    <Tips
                        mode={"edit"}
                        tripToEdit={tripToEdit}
                        setTripToEdit={setTripToEdit}
                    />

                    <br /><br />

                    <img
                        src='./pictures/editsave.png'
                        alt='Share save pic'
                        style={{ width: "30%", marginRight: '74%' }}
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
                            marginTop: "-32px"
                        }}
                        variant="contained"
                        onClick={SaveTrip}
                    >
                        עדכן טיול
                    </Button>

                </ThemeProvider>
            </CacheProvider>
        </div>
    )
}
