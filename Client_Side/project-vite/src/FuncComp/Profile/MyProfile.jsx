import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../ContextProvider';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function MyProfile(props) {

    const dataContext = useContext(DataContext)
    const apiUrl = dataContext.apiUrl;
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({ trips: [], following: [] });
    const [tripImages, setTripImages] = useState({});
    const [followerImages, setFollowerImages] = useState({});

    const [alert, setAlert] = useState({
        display: 'none', message: ''
    })

    // דיאלוג של מווי
    const [open, setOpen] = useState(false);
    const [isSure, setIsSure] = useState(false);
    //בשביל לעשות שינויים בין פונקציות ולהציג את כותרת הטיול בדיאלוג
    const [selectedTripTitle, setSelectedTripTitle] = useState('');
    const [selectedTripId, setSelectedTripId] = useState(null);
    const go2Edit = (tripID) => {
        navigate(`/editTrip/${tripID}`)
    }
    const deleteTrip = (tripIdFromClick, title) => {
        setSelectedTripTitle(title);
        setSelectedTripId(tripIdFromClick);
        //לבחור האם הוא בטוח dialog
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isSure) {

            setIsSure(false);
            setAlert({ display: 'none', message: '' })

            fetch(apiUrl + `/TripData/DeleteTrip?tripId=${selectedTripId}`, {
                method: 'DELETE',
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
            })
                .then((response) => {
                    if (!response.ok) {
                        setAlert({ display: 'block', message: 'שגיאה בשרת' })
                        console.log(response);
                    }
                    
                    return response.text().then(text => text ? JSON.parse(text) : {});
                })
                .then((data) => {
                    
                    setOpen(false);
                    fetchProfile();
                })
                .catch((error) => {
                    console.log(error);
                    setAlert({ display: 'block', message: 'שגיאה בשרת' })
                })

        }

    }, [isSure, selectedTripId])

    const Trip = ({ imgSrc, title, likes, tripId, go2Edit }) => (

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <Link to={`/TripPage/${tripId}`}>
                <img src={imgSrc} alt="TripMainPic"
                    style={{ width: '150px', height: '150px', borderRadius: '10px', marginRight: '20px' }}
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "./pictures/defaultPicture.png"; 
                    }}
                />
            </Link>
            <div style={{ padding: 20, textAlign: 'right', flex: '1' }}>
                <h3>{title}</h3>
                <p>
                    <FavoriteBorderIcon style={{ marginBottom: '-6px' }} /> {likes}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                    <Tooltip title="ערוך טיול" arrow>
                        <button onClick={(e) => go2Edit(tripId)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: "black" }}>
                            <EditIcon />
                        </button>
                    </Tooltip>
                    <Tooltip title="מחק טיול" arrow>
                        <button onClick={() => { deleteTrip(tripId, title) }} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: "black" }}>
                            <DeleteIcon />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <Link to={`/TripPage/${tripId}`}> <Button
                    style={{ fontFamily: 'inherit', color: '#697e42', cursor: 'pointer', fontSize: '14px', }}>
                    צפייה בטיול
                </Button></Link>
            </div>
        </div>
    );


    function fetchProfileImages(data) {
        let tripImagesTemp = {};
        let followerImagesTemp = {};

        data.trips.forEach(trip => {
            dataContext.GetImage(`/GetImage/GetMainPic?tripId=${trip.tripId}`)
                .then((imageObjectURL) => {
                    tripImagesTemp[trip.tripId] = imageObjectURL;
                    setTripImages(prevState => ({ ...prevState, ...tripImagesTemp }));
                })
                .catch(error => console.log(`Error fetching image for trip ${trip.tripId}:`, error));
        });

        data.following.forEach(follower => {
            dataContext.GetImage(`/GetImage/GetUserPic?primaryKey=${follower}`)
                .then((imageObjectURL) => {
                    followerImagesTemp[follower] = imageObjectURL;
                    setFollowerImages(prevState => ({ ...prevState, ...followerImagesTemp }));
                })
                .catch(error => console.log(`Error fetching image for follower ${follower}:`, error));
        });
    }

    const Follower = ({ imgSrc, name }) => {
        const [isFollowing, setIsFollowing] = useState(true);

        const toggleFollow = (followUserName) => {
            setIsFollowing(!isFollowing);

            const follows = {
                userName: dataContext.loggedUser.userName,
                followingUserName: followUserName
            };
            const jsonString = JSON.stringify(follows);
            console.log(follows);
            const options = {
                method: "PUT",
                body: jsonString,
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            };
            const url = apiUrl + "/Actions/changeFollow";

            fetch(url, options)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };


        return (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                
                <Link to={`/userProfile/${name}`}> <img src={imgSrc} alt={name} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} /></Link>
                <strong style={{ flex: '1' }}>{name}</strong>
                <button
                    onClick={() => toggleFollow(name)}
                    style={{
                        marginLeft: "10px",
                        padding: '5px 10px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: isFollowing ? '#ff5c5c' : '#007bff',
                        color: 'white',
                        width: "80px",
                        cursor: 'pointer'
                    }}>
                    {isFollowing ? 'הסר מעקב' : 'עקוב'}
                </button>
            </div>
        );
    };

    useEffect(() => {
        fetchProfile();

    }, [dataContext.loggedUser]);

    const fetchProfile = () => {
        fetch(apiUrl + `/Data/Profile?userName=${dataContext.loggedUser.userName}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Profile data:', data);
                setProfileData(data);
                fetchProfileImages(data);
            })
            .catch((error) => {
                console.log('Error fetching profile data:', error);
            });
    }
    
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
        <div dir="rtl" style={{ fontFamily: 'inherit', textAlign: "center", backgroundColor: '#eff8ff', padding: '20px', color: "black",height:"100vh" }}>
            <p onClick={() => navigate(-1)} style={{ marginTop: "55px", cursor: "pointer", textAlign: "right", position: "absolute", top: "10%", marginRight: 50,zIndex:1000 }}> <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px", marginRight: 50 }} />בחזרה לעמוד הקודם  </p>

           <div style={{ position:'relative', padding: 20, backgroundColor: "white", borderRadius: '10px', marginBottom: '20px' }}>
              <h3>הפרופיל שלי</h3> 
             <div style={{ position: 'relative', display: 'inline-block', width: '80px', height: '80px' }}>
           <img   src={dataContext.loggedUserPic}    style={{  width: '100%',   height: '100%',   borderRadius: '50%', position: "absolute",   top: 0,   left: 0    }} />
              {isInfluencer && (
              <img src="./pictures/verfaid.png"   alt="Iverified"
                   style={{height: "27px",width: "27px",   position: "absolute",  right: -9, bottom: 0  }}  />
               )}        
              </div>
                <p style={{width:"40%", margin:"0 auto"}}>
                    {profileData.bio ? profileData.bio : "לא הוזן BIO אתה מוזמן לערוך את הפרופיל ולהוסיף"}
                </p>
                <div style={{ position: "absolute", left: "2%", top: "20%", }}>
                    <div>
                        <Link to={`/editProfile`}>
                            <Button style={{color: "#697e42",  margin: '10px 10px 0px 10px',  padding: "10px 20px",borderRadius: 15 }}  >
                                <SettingsIcon style={{ marginLeft: '5px' }} />
                                עריכת פרופיל
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link to={`/favorite`}>
                            <Button style={{ color: "#697e42", margin: '10px 10px 0px 10px',   padding: "10px 20px", borderRadius: 15 }}   >
                                <FavoriteBorderIcon style={{ marginLeft: '5px' }} />
                                המועדפים שלי
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                dir='rtl'
                aria-labelledby="alert-dialog-title"
                PaperProps={{   style: { backgroundColor: '#f5f5f5',  padding: '10px', borderRadius: '10px',  minWidth: '300px',  }}}
                aria-describedby="alert-dialog-description"
            >
                <IconButton
                    style={{ position: 'absolute', top: '5px', left: '10px' }}
                    onClick={handleClose}
                >
                    <ClearIcon />
                </IconButton>
                <DialogTitle
                   
                    id="alert-dialog-title">
                 מחיקת טיול
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    <div >
                    {`האם אתם בטוחים שתרצו למחוק את הטיול - "${selectedTripTitle}"?`}
                    
                    </div>
                    <Alert style={{ margin: '0px 20px', display: alert.display }} severity="warning"> {alert.message}</Alert>

                </DialogContent>
                <DialogActions style={{ marginTop: -8 }}>
                    <Button
                        style={{ color: 'white', backgroundColor: "#f44336", border: `1px solid #f44336`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }} 
                        onClick={handleClose}>ביטול</Button>
                    <Button
                        style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }} 
                        onClick={() => {
                            
                            setIsSure(true);
                        }} autoFocus>
                        כן, אני רוצה למחוק
                    </Button>
                </DialogActions>
            </Dialog>

            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <div style={{ width: '45%', backgroundColor: '#eff8ff', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ marginBottom: '5%', }} >הטיולים שלי</h2>
                    {profileData.trips.map(trip => (
                        <Trip
                            key={trip.tripId}
                            imgSrc={tripImages[trip.tripId] || ""}
                            title={trip.tripTitle}
                            likes={trip.favoriteSum}
                            tripId={trip.tripId}
                            go2Edit={go2Edit}
                        />
                    ))}
                </div>

                <div style={{ width: '43%', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                 <h2 style={{ marginBottom: '20px' }}>עוקב אחרי</h2>
                    <div style={{  height: "300px", overflowY: "scroll",  scrollbarColor: "#7c99ab #f1f1f1",  scrollbarWidth: "thin",   padding: "10px"  }}>
                {profileData.following.map((follower, index) => (
                     <Follower
                        key={index}
                        imgSrc={followerImages[follower] || ""}
                        name={follower}
                    />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

