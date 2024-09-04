import React, { useState, useEffect, useContext } from 'react';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../ContextProvider';
import Button from '@mui/material/Button';

export default function Options(props) {
    const dataContext = useContext(DataContext)
    const apiUrl = dataContext.apiUrl;

    const [tripsUsersPics, setTripsUsersPics] = useState([]);
    const [tripsPics, setTripsPics] = useState([]);
    const [visibleTrips, setVisibleTrips] = useState(3);
    const navigate = useNavigate();
    useEffect(() => {
        fetchTripUserPics(props.options);
        fetchTripPics(props.options);
    }, [props.options]);

    function fetchTripUserPics(tripsUsers) {
        let pics = [...tripsUsersPics];
        tripsUsers.forEach((trip, index) => {
            fetch(apiUrl + `/GetImage/GetUserPic?primaryKey=${trip.userName}`)
                .then((response) => response.blob())
                .then((imageBlob) => {
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    pics[index] = imageObjectURL;
                    setTripsUsersPics([...pics]);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    function fetchTripPics(trips) {
        let pics = [...tripsPics];
        trips.forEach((trip, index) => {
            fetch(apiUrl + `/GetImage/GetMainPic?tripid=${trip.tripId}`)
                .then((response) => response.blob())
                .then((imageBlob) => {
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    pics[index] = imageObjectURL;
                    setTripsPics([...pics]);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    const handleShowMore = () => {
        setVisibleTrips(visibleTrips + 3);
    };

    return (
        <div dir="rtl" style={{ fontFamily: 'inherit', textAlign: "center", color: "black", position: "relative", height: "100%" }}>
            <h4 onClick={() => navigate(-1)} style={{ cursor: 'pointer', textAlign: "right", position: "absolute", top: 3, right: "5%" }}>
                <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} /> נחפש טיול מחדש?
            </h4>
            <br />   <br />   <br />
            {props.options.slice(0, visibleTrips).map((trip, index) => (
                <div key={index}>
                    <div style={{ margin: "0 auto", backgroundColor: "#eff8ff", padding: 20, width: "70%", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", position: "relative" }}>
                        <div style={{ display: "flex", flex: "0 0 auto", height: "100%" }}>
                           <Link to={`/TripPage/${trip.tripId}`}> <img
                                src={tripsPics[index] || ""}
                                style={{ cursor: 'pointer',width:270, height: 240, borderRadius: 10, marginRight: 10, marginLeft: 20 }} alt="TripMainPic"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "./pictures/defaultPicture.png";
                                }}
                            /></Link>
                        </div>
                        <div style={{ flex: 1, textAlign: "right", marginRight: 10, }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: 40, height: 40, borderRadius: "50%", marginLeft: 10 }} src={tripsUsersPics[index] || ""} alt="UserPic" />
                                <span style={{ fontSize: "1em", fontWeight: "bold" }}>{trip.userName}</span>
                            </div>
                            <div style={{ marginRight: "10%" }}>
                                <h3>{trip.tripTitle}</h3>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: 10 }}>
                                    {trip.tags.map((tag, index) => (
                                        <span key={index} style={{ backgroundColor: "#dbcda4", padding: "5px 10px", borderRadius: 5 }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <br />
                                <p style={{ display: "inline", }}>
                                    <FavoriteBorderIcon style={{ marginBottom: "-6px" }} /> {trip.favoriteSum || 0}
                                </p>
                            </div>
                        </div>
                       <Link to={`/TripPage/${trip.tripId}`}><div style={{ position: "absolute", bottom: 10, left: 25 }}>
                            <p style={{color:'black', cursor: 'pointer', fontSize: "1em", fontWeight: "bold" }}>קרא עוד{">>>"}</p>
                        </div></Link>
                    </div>
                    <br />
                </div>
            ))}
            <br />
            <br />
            {visibleTrips < props.options.length && (
                <div style={{ margin: "0 auto" }}>
                    <img style={{ width: 100, height: 100, marginBottom: "-15px" }} src="./pictures/4.png" alt="showMore" />
                    <br />
                    <Button onClick={handleShowMore} style={{ backgroundColor: "#927070", color: "white", width: 250, padding: 20, borderRadius: 10, fontSize: 17 }}>
                        רוצה עוד טיולים?
                    </Button>
                </div>
            )}
        </div>
    );
}
