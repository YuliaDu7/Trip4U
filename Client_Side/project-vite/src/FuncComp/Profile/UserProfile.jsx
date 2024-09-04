import React, { useState, useEffect, useContext } from 'react';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import EmailIcon from '@mui/icons-material/Email';
import { DataContext } from '../ContextProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

export default function UserProfile() {
    const [trips, setTrips] = useState([]);
    const [tripImages, setTripImages] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [isInfluencer, setIsInfluencer] = useState(false);   
    const dataContext = useContext(DataContext);
    const params = useParams();
    const apiUrl = dataContext.apiUrl;
    const navigate = useNavigate();
    const [UserImage, setUserImage] = useState(""); 
    const [userBio, setUserBio] = useState('')
    useEffect(() => {
        if (params.userName === dataContext.loggedUser.userName) {
            navigate("/Profile");
            return;
        }

        let options = {
            method: "PUT",
            body: JSON.stringify({
                userName: dataContext.loggedUser.userName,
                followingUserName: params.userName
            }),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        };
        
        let url = "/Data/OtherUserProfile";
        fetch(apiUrl + url, options)
            .then((response) => response.json())
            .then((data) => {
                
                setTrips(data.trips);
                setIsFollowing(data.isFollowing);
                fetchProfileImages(data.trips);
                setIsInfluencer(data.isInflunce)
                setUserBio( data.bio);
                dataContext.GetImage(`/GetImage/GetUserPic?primaryKey=${params.userName}`)
                    .then((imageObjectURL) => {
                        setUserImage(imageObjectURL);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [params.userName, dataContext.loggedUser, apiUrl]); 
    const Trip = ({ imgSrc, title, likes, tripId }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <Link to={`/TripPage/${tripId}`}> <img 
                src={imgSrc} alt="TripMainPic" 
                style={{ cursor: 'pointer', width: '150px', height: '150px', borderRadius: '10px', marginRight: '20px' }} 
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "./pictures/defaultPicture.png"; 
                }}
            /></Link>
            
            <div style={{ padding: 20, textAlign: 'right', flex: '1' }}>
                <h3>{title}</h3>
                <p>
                    <FavoriteBorderIcon style={{ marginBottom: '-6px' }} /> {likes}
                </p>
                <Link to={`/TripPage/${tripId}`}>
                <Button 
                style={{ cursor:'pointer', color:'black', fontSize: "1em", fontFamily:'inherit', fontWeight: "bold", marginRight:'60%' }}>קרא עוד {">>>"}
                </Button> </Link>
            </div>
        </div>
    );

    function fetchProfileImages(data) {
        let tripImagesTemp = {};

        data.forEach(trip => {
            dataContext.GetImage(`/GetImage/GetMainPic?tripId=${trip.tripId}`)
                .then((imageObjectURL) => {
                    tripImagesTemp[trip.tripId] = imageObjectURL;
                    setTripImages(prevState => ({ ...prevState, ...tripImagesTemp }));
                })
                .catch(error => console.log(`Error fetching image for trip ${trip.tripId}:`, error));
        });
    }

    const toggleFollow= () => {
        const followStatus = !isFollowing;
        setIsFollowing(followStatus);

        const follows = {
            userName: dataContext.loggedUser.userName,
            followingUserName: params.userName
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
        <div dir="rtl" style={{ color: "black", fontFamily: 'inherit', textAlign: "center", backgroundColor: '#eff8ff', padding: '20px', height:"100vh"}}>
            <div style={{ padding: 20, backgroundColor: "white", borderRadius: '10px', marginBottom: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position:'relative', textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{position:'relative'}}>
                    <img
                    src={UserImage}
                    style={{
                        width: '80px', height: '80px', borderRadius: '50%',  objectFit: 'cover'
                    }}
                    alt="User"
                    />
                    {isInfluencer && (
                        <img  src="./pictures/verfaid.png" alt="Iverified"
                        style={{height: "27px", width: "27px", position: "absolute",right: "47.5%", bottom: "10%",transform: "translate(50%, 50%)"}}/>
                    )}
                    </div>
                    <strong style={{ display: 'block', marginTop: '10px' }}>{params.userName}</strong>
                    <p style={{ margin: "0 auto", width:"60%" }}>{userBio}</p>
                </div>
                <div style={{ color: "#697e42", position: 'absolute', top: '70px', right: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '30px' }} onClick={toggleFollow}>
                        {isFollowing ? <PersonRemoveAlt1Icon /> : <PersonAddAlt1Icon />}
                        <p style={{ margin: '0 10px' }}>{isFollowing ? 'הסר מעקב' : 'עקוב'}</p>
                    </div>
                    <div 
                    onClick={() => navigate(`/SendMassege/${params.userName}`)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <EmailIcon />
                    <p style={{ margin: '0 10px' }}>שלח הודעה</p>
                    </div>
                </div>
            </div>

            <div>
                <div style={{ width: '100%', paddingTop: 20 }}>
                    <h3>הטיולים של {params.userName}</h3><br /><br />
                </div>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px',
                    width: '100%', backgroundColor: '#eff8ff', borderRadius: '10px'
                }}>
                    {trips && trips.map((trip, index) => (
                        <Trip
                            key={index}
                            imgSrc={tripImages[trip.tripId] || 'pictures/default.jpg'}  
                            title={trip.tripTitle}
                            likes={trip.favoriteSum}
                            tripId={trip.tripId}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}