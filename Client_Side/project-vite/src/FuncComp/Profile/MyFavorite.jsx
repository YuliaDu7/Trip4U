import React, { useState, useEffect, useContext } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { DataContext } from '../ContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import { DialogContent, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



export default function MyFavorite(props) {

    const dataContext = useContext(DataContext)
    const apiUrl = dataContext.apiUrl;
    const navigate = useNavigate();


    //תבנית עיצוב
    const Trip = ({ imgSrc, title, tripId }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '10px', position: 'relative' }}>
            <Link to={`/TripPage/${tripId}`}>
                <img src={imgSrc} alt="TripMainPic"
                    style={{ width: '150px', height: '150px', borderRadius: '10px', marginRight: '20px' }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "./pictures/defaultPicture.png";
                    }}
                /></Link>
            <div style={{ marginTop: -50, padding: 20, textAlign: 'right', flex: '1' }}>
                <h3 onClick={() => navigate(`/TripPage/${tripId}`)}>{title}</h3>
                <img onClick={() => Dislike(tripId, title)}
                    style={{ cursor: 'pointer', position: 'absolute', bottom: 40, left: 40, height: 25 }}
                    src='./pictures/dislike.png'
                />

            </div>
        </div>
    );


    //סטייטים
    const [FavoritsData, setFavoritsData] = useState([]);
    const [favImages, setFavImages] = useState({});

    // דיאלוג של מווי
    const [open, setOpen] = useState(false);
    const [isSure, setIsSure] = useState(false);
    //בשביל לעשות שינויים בין פונקציות ולהציג את כותרת הטיול בדיאלוג
    const [selectedTripTitle, setSelectedTripTitle] = useState('');
    const [selectedTripId, setSelectedTripId] = useState(null);

    const [alert, setAlert] = useState({
        visibility: 'hidden', message: ''
    })

    //פונקציות

    useEffect(() => {
        fetchFavorites();
    }, [dataContext.loggedUser.userName]);

    //פונקציה נפרדת בשביל לעשות רירנדר כשמוחקים ממועדפים
    const fetchFavorites = () => {

        fetch(apiUrl + `/Data/GetFavorits?userName=${dataContext.loggedUser.userName}`)
            .then((response) => response.json())
            .then((data) => {
                setFavoritsData(data);
                fetchImages(data);
            })
            .catch((error) => {
                console.log('Error fetching profile data:', error);
            });
    }

    const fetchImages = (data) => {
        let favImagesTemp = [];

        data.forEach(trip => {

            dataContext.GetImage(`/GetImage/GetMainPic?tripId=${trip[0].tripId}`)
                .then((imageObjectURL) => {
                    favImagesTemp[trip[0].tripId] = imageObjectURL;
                    setFavImages(prevState => ({ ...prevState, ...favImagesTemp }));
                })
                .catch(error => console.log(`Error fetching image for trip ${trip[0].tripId}:`, error));
        });
    }

    const handleClose = () => {
        setOpen(false);
    };


    //אם מישהו לוחץ על הלב
    const Dislike = (tripIdFromClick, title) => {
        setSelectedTripTitle(title);
        setSelectedTripId(tripIdFromClick);
        //לבחור האם הוא בטוח dialog
        setOpen(true);

    }


    //אם הוא בחר בדיאלוג
    useEffect(() => {

        if (isSure) {
            let SavedByTemp = {
                tripId: selectedTripId,
                userName: dataContext.loggedUser.userName
            }
            setIsSure(false);
            setAlert({ visibility: 'hidden', message: '' })

            fetch(apiUrl + `/Actions/deleteFavorite`, {
                method: 'DELETE',
                body: JSON.stringify(SavedByTemp),
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' }) 
            })
                .then((response) => {

                    if (!response.ok) {
                        setAlert({ visibility: 'visible', message: 'שגיאה בשרת' })
                        console.log(response);
                    }
                    
                    return response.text().then(text => text ? JSON.parse(text) : {});
                })
                .then((data) => {
                    
                    fetchFavorites();

                })
                .catch((error) => {
                    console.log("Error deleting favorite", error);
                    setAlert({ visibility: 'visible', message: 'שגיאה בשרת' })


                })


        }

    }, [isSure, selectedTripId])

    //is influence
    const [isInfluencer, setIsInfluencer] = useState(false);
    useEffect(() => {
        checkInfluencerStatus();
    }, [dataContext.loggedUser.userName]);

    function checkInfluencerStatus() {
        const storedUserList = localStorage.getItem("UserList");
        console.log("Stored User List:", storedUserList);
        if (storedUserList) {
            const userList = JSON.parse(storedUserList);
            const influencerStatus = userList.isInflunce;
            setIsInfluencer(influencerStatus === true);
        }
    }


    return (
        <div dir="rtl" style={{ fontFamily: 'inherit', textAlign: "center", color: "black", backgroundColor: '#e1dfd6', padding: '20px',height:"100VH" }}>
            <div style={{ position: 'relative', padding: 20, backgroundColor: "white", borderRadius: '10px', marginBottom: '20px' }}>
                <Link to={'/Profile'}><h4 style={{ color: 'black', textAlign: "right", position: "absolute" }}>
                    <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} /> חזרה לפרופיל
                </h4></Link>
                <div style={{ position: 'relative', display: 'inline-block', width: '90px', height: '90px' }}>
           <img   src={dataContext.loggedUserPic}    style={{  width: '100%',   height: '100%',   borderRadius: '50%', position: "absolute",   top: 0,   left: 0    }} />
              {isInfluencer && (
              <img src="./pictures/verfaid.png"   alt="Iverified"
                   style={{height: "27px",width: "27px",   position: "absolute",  right: -9, bottom: 0  }}  />
               )}        
              </div>
                <h2>המועדפים שלי</h2>
            </div>

            <Alert style={{ margin: '0 auto', marginTop: '30px', marginBottom: '30px', textAlign: 'center', width: '50%', visibility: alert.visibility }} severity="warning"> {alert.message} </Alert>


            <Dialog
                open={open}
                onClose={handleClose}
                dir='rtl'
                aria-labelledby="alert-dialog-title"

                PaperProps={{
                    style: {
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '10px',
                        minWidth: '300px',
                    }
                }}

                aria-describedby="alert-dialog-description"
            >
                <IconButton
                    style={{ position: 'absolute', top: '10px', left: '10px' }}
                    onClick={handleClose}
                >
                    <ClearIcon />
                </IconButton>
                <DialogTitle
                    style={{
                        paddingBottom: '15px',
                        marginBottom: '10px',

                    }}
                    id="alert-dialog-title">
                   הסרה ממועדפים
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    <div >
                    {`האם אתם בטוחים שאתם רוצים להסיר את "${selectedTripTitle.trim()}" ממועדפים?`}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        style={{ color: 'white', backgroundColor: "#f44336", border: `1px solid #f44336`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
                        onClick={handleClose}>ביטול</Button>
                    <Button
                        style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
                        onClick={() => {
                            setIsSure(true);
                            setOpen(false);
                        }} autoFocus>
                        כן, אני רוצה
                    </Button>
                </DialogActions>
            </Dialog>



            {FavoritsData.length === 0 ? (
                <div style={{ display: 'inline-block', backgroundColor: '#6A7F43', color: '#fff', fontSize: '18px', padding: '10px', borderRadius: '5px' }}>
                    עדיין אין לכם טיולים שמורים במועדפים <br />

                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {FavoritsData.map(fav => (
                        < Trip
                            key={fav[0].tripId}
                            imgSrc={favImages[fav[0].tripId] || ""}
                            title={fav[0].tripTitle}
                            tripId={fav[0].tripId}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}
