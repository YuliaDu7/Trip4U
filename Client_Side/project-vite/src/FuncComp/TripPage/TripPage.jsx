import React, { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PinDropIcon from "@mui/icons-material/PinDrop";
import InstagramIcon from "@mui/icons-material/Instagram";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Place from "./Place";
import Restaurant from "./Restaurant";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from "@mui/material/TextField";
import Carousel from 'react-material-ui-carousel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Map from "./Map";
import { DataContext } from "../ContextProvider";
import { useContext } from "react";
import Button from '@mui/material/Button';
import { Tooltip } from "@mui/material";
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';



export default function TripPage() {


  const navigate = useNavigate();
  const dataContext = useContext(DataContext);
  const apiUrl = dataContext.apiUrl;

  const Switch = (props) => {
    const { test, children } = props;
    return children.find((child) => {
      return child.props.value === test;
    });
  };

  const params = useParams();
  const [trip, setTrip] = useState({ restInTrip: [], userPic: "", mainPic: "", tripPic1: "", tripPic2: "" });
  const id = params.tripId;
  //בשביל התמונות
  const [images, setImages] = useState([]);
  //רשימה של הסידור מקומות ומסעדות
  const [list, setList] = useState();

  //להחליף את הלב ממלא לריק
  const [heart, setHeart] = useState(
    <FavoriteBorderIcon onClick={() => { AddToFavorite(true); }} style={{ cursor: 'pointer', fill: "#697e42" }} />
  );
  const [isFavorite, setIsFavorite] = useState(false);

  //לתגובות 
  const [newComment, setNewComment] = useState("");
  const [commentUserPics, setCommentUserPics] = useState({});
  const [locations, setLocations] = useState({});
  
  //משתמש נוכחי מחובר
  let loggedUser = dataContext.loggedUser.userName;

  const [open, setOpen] = useState(false);
  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  useEffect(() => {
    if (dataContext.loggedUser.userName) {
      loggedUser = dataContext.loggedUser.userName;
      LoadTrip(id);
      window.scrollTo(0, 0)
      let obj = {
        tripId: id,
        userName: dataContext.loggedUser.userName
      };
      let jsonString = JSON.stringify(obj);
      let options = {
        method: 'PUT',
        body: jsonString,
        headers: new Headers({
          'Content-Type': 'application/json;  charset=UTF-8'
        }),
      };

      let url = apiUrl + '/Actions/SetClick';

      fetch(url, options)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data)
        }).catch(function (error) {
          console.log(error);
        });

    }

  }, [dataContext.loggedUser.userName]);

  function LoadTrip(tripId) {
    fetch(apiUrl + `/TripData/GetTripDetails?tripID=${tripId}&user=${loggedUser}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setIsFavorite(data.isFavorite);

        let newTrip = {
          tripTitle: data.tripTitle,
          area: data.area,
          tripDescription: data.tripDescription,
          tripDate: data.tripDate,
          favoriteSum: data.favoriteSum,
          season: data.season,
          tips: data.tips,
          publishDate: data.publishDate,
          userName: data.userName,
          isInfluencer: data.isInfluencer,
          tags: data.tags,
          restInTrip: data.restInTrip,
          instagramUrl: data.instagramUrl,
          props: data.tripProperties,
          comments: data.commentsOnTrip
        };

        //מסעדות ומקומות לפי הסדר
        let templist = {};
        let tempLocation = []
        data.placesInTrip.forEach((element) => {
          tempLocation = [...tempLocation, { name: element.placeName, url: element.placeMap, description: element.placeDescription, type: "place" }]
          templist[element.placePlaceInTrip] = <Place place={element} />;
        });

        data.restInTrip.forEach((element) => {
          tempLocation = [...tempLocation, { name: element.restName, url: element.restMap, description: element.restDescription, type: "restaurant" }]
          templist[element.restPlaceInTrip] = <Restaurant rest={element} />;
        });

        //למפה
        setLocations(tempLocation)
        setList({ ...templist });
        //להצגה של מקומות ומסעדות
        setTrip(newTrip);
        fetchTripPics(tripId);
        fetchCommentUserPics(data.commentsOnTrip);
        fetchUserPic(data.userName);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // להוריד תמונה של משתמש
  function fetchUserPic(userName) {
    dataContext.GetImage(`/GetImage/GetUserPic?primaryKey=${userName}`)
      .then((image) => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          userPic: image
        }));
      })
  }

  //תמונות של טיולים
  function fetchTripPics(tripId) {
    dataContext.GetImage(`/GetImage/GetMainPic?tripid=${tripId}`)
      .then((image) => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          mainPic: image
        }));
      })
      .catch(() => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          mainPic: null
        }));
      });

    dataContext.GetImage(`/GetImage/GetTripPic1?tripid=${tripId}`)
      .then((image) => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          tripPic1: image
        }));
      })
      .catch(() => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          tripPic1: null
        }));
      });

    dataContext.GetImage(`/GetImage/GetTripPic2?tripid=${tripId}`)
      .then((image) => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          tripPic2: image
        }));
      })
      .catch(() => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          tripPic2: null
        }));
      });
  }

  //הוספת תמונות לקרוסלה אם יהיה
  useEffect(() => {
    let newImages = [];
    let defaultPicturePath = "./pictures/defaultPicture.png";
    if (trip.mainPic && trip.mainPic !== defaultPicturePath) {
      newImages.push(trip.mainPic);
    }
    if (trip.tripPic1 && trip.tripPic1 !== defaultPicturePath) {
      newImages.push(trip.tripPic1);
    }
    if (trip.tripPic2 && trip.tripPic2 !== defaultPicturePath) {
      newImages.push(trip.tripPic2);
    }
    setImages(newImages);
  }, [trip.mainPic, trip.tripPic1, trip.tripPic2]);
  // להוריד תמונות של משתמשים מהתגובות
  function fetchCommentUserPics(comments) {
    let commentUserPicsTemp = {};
    comments.forEach(comment => {
      dataContext.GetImage(`/GetImage/GetUserPic?primaryKey=${comment.userName}`)
        .then((imageObjectURL) => {
          commentUserPicsTemp[comment.userName] = imageObjectURL;
          setCommentUserPics({ ...commentUserPicsTemp });
        })
    });
  }

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    AddToFavorite(!isFavorite);
  };

  function AddToFavorite(checked) {
    const loggedUser = dataContext.loggedUser.userName;
    let savedBy = { tripId: id, userName: loggedUser };
    let jsonString = JSON.stringify(savedBy);
    let options = {
      method: checked ? "PUT" : "DELETE",
      body: jsonString,
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    };

    fetch(apiUrl + (checked ? '/Actions/saveSum' : '/Actions/deleteFavorite'), options)
      .then((response) => {
        if (response.ok) {
        } else {
          throw new Error(checked ? 'Failed to save favorite' : 'Failed to delete favorite');
        }
      })
      .catch((error) => {
        console.log(error);
        handleOpen();
      });
  }

  function AddComment() {

    let jsonString = JSON.stringify(
      {
        tripId: id,
        userName: loggedUser,
        comment: newComment
      });

    let options = {
      method: "POST",
      body: jsonString,
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    };

    fetch(apiUrl + '/Actions/AddComment', options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout(() => {
      LoadTrip(id);
    }, 500);

  }


  return (
    <div dir="rtl" style={{ textAlign: "center", color: "#697e42" }}>


      <br />
      <p onClick={() => navigate(-1)} style={{ marginTop: "55px", cursor: "pointer", textAlign: "right", position: "absolute", top: "10%", marginRight: 50 }}> <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px", marginRight: 50 }} />בחזרה לעמוד הקודם  </p>
      <br />
      <h1 style={{ fontFamily: "inherit", fontSize: "50px" }}>
        {" "}
        {trip.tripTitle}
      </h1>
      <div style={{ position: "relative", display: "inline-block", padding: 30 }}>

        <p style={{ display: "inline", padding: 30 }}>
          <Link to={`/userProfile/${trip.userName}`}><img
            style={{ borderRadius: 50, width: 40, height: 40, marginLeft: 20, marginBottom: "-5px", cursor: "pointer" }}
            src={trip.userPic}
            alt="user-pic"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "./pictures/defaultUserPic.png";
            }}
          /></Link>
          {trip.isInfluencer && (
            <img
              src="./pictures/verfaid.png"
              alt="Iverified"
              style={{
                height: "17px",
                width: "17px",
                position: "absolute",
                bottom: "28%",
                left: "86%",
                transform: "translate(-25%, -25%)",
              }}
            />
          )}
          {trip.userName}
        </p>
        <p style={{ display: "inline", padding: 30 }}>
          {formatDate(trip.publishDate)}
        </p>
        <p style={{ display: "inline", padding: 30 }}>
          <FavoriteBorderIcon style={{ marginBottom: "-5px" }} /> {trip.favoriteSum}
        </p>
      </div>
      <br />
      <br />
      <p style={{ fontSize: 20, width: "60%", margin: "0 auto" }} >{trip.tripDescription}</p>
      <br />
      <br />
      <div style={{ fontSize: 17 }}>
        {trip.season && <p style={{ display: "inline" }}>עונה מומלצת: </p>}

        <Switch test={trip.season}>
          <span style={{ fontWeight: "bold" }} value={"ק"} >קיץ</span>
          <span style={{ fontWeight: "bold" }} value={"ח"}>חורף</span>
          <span style={{ fontWeight: "bold" }} value={"א"}>אביב</span>
          <span style={{ fontWeight: "bold" }} value={"ס"}>סתיו</span>
        </Switch>

        <p style={{ display: "inline", padding: 30 }}>
          תאריך טיול:
          <span style={{ fontWeight: "bold" }}>  {formatDate(trip.tripDate)}</span>
        </p>
      </div>
      <br />
      <br />

      {trip.tags && trip.tags.map((typeItem, index) => (
        <p style={{ backgroundColor: '#dbcda4', display: "inline", margin: 10, borderRadius: 10, padding: 10, color: "black", fontWeight: "bold" }}
          key={index}>
          {typeItem}
        </p>
      ))}


      {images.length >0 && <div style={{ width: "40%", margin: "0 auto" }}>
        <br />
        <br />
        <br />
        <br />
        <Carousel >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`trip-pic-${index}`}
              style={{ width: "90%", height: 400, borderRadius: "10%" }}
            />
          ))}
        </Carousel>
        <br />
      </div>}

      {trip.tips && <div>
        <br />
        <br />
        <p style={{ fontSize: 20, width: "50%", margin: "0 auto", fontWeight: "bold" }} >  טיפים:
          <span style={{ fontWeight: "normal", }}>
            {"  "}
            {trip.tips}
          </span>
        </p>
        <br /> <br />  <br />   <br />
      </div>}

      <p style={{ borderBottom: "inset ", width: "50%", margin: "0 auto" }}> </p>
      {list &&
        Object.values(list).map((item, index) => (
          <div key={index} style={{ borderBottom: "inset ", width: "50%", margin: "0 auto" }} >
            <br />    <br />   {item}     <br />  <br />  <br />

          </div>
        ))}
      <br />
      {trip.props && trip.props.length > 0 && (
        <div>
          <h3>מאפיינים נוספים לטיול:</h3>
          {trip.props.map((item, index) => (
            <div key={index}>
              {item}
            </div>
          ))}
          <br />
        </div>
      )}
      {trip.instagramUrl && <p style={{ cursor: "pointer" }}>
        לאינסטגרם של כותב/ת הפוסט
        <a style={{ color: "#697e42" }} href={trip.instagramUrl}>
          <InstagramIcon style={{ marginRight: "10px", marginTop: "5px", marginBottom: "-6px" }} />
        </a>
      </p>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        <Tooltip title={isFavorite ? "הסרה ממועדפים" : "הוספה למועדפים"} arrow>
          <IconButton onClick={toggleFavorite}>
            {isFavorite ? <FavoriteIcon style={{ cursor: 'pointer', fill: "#697e42" }} /> : <FavoriteBorderIcon style={{ cursor: 'pointer', fill: "#697e42" }} />}
          </IconButton>
        </Tooltip>
        <ShareIcon onClick={()=>shareButton(id)} style={{ cursor: "pointer", marginLeft: '10px', fill: "#697e42" }} />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '10px',
            minWidth: '300px',
          }
        }}
      >
        <DialogTitle
          style={{
            textAlign: 'center',
          }}
          id="alert-dialog-title">
          <SentimentVeryDissatisfiedIcon style={{ marginRight: '5px', verticalAlign: 'middle' }} />
          {"אירעה שגיאה "}
        </DialogTitle>
        <DialogActions style={{ marginTop: -8, justifyContent: 'left' }}>
          <Button
            onClick={handleClose}>אוקיי</Button>
        </DialogActions>
      </Dialog>


      <h2 style={{ color: "black" }} /* onClick={go2Map} */>
        בואו תראו את הטיול על המפה<PinDropIcon style={{ marginBottom: "-6px" }} />
      </h2>

      {/* {showMap} */}
      <Map location={locations && locations} width={"50%"} style={{ margin: "0 auto" }} />

      <br />
      <h2 style={{ color: "black", textAlign: "right", paddingRight: "20%" }}>תגובות:</h2>
      <h5 style={{ color: "black", textAlign: "right", paddingRight: "20%" }}>הוסף/שנה תגובה</h5>
      <TextField
        label=""
        variant="outlined"
        onChange={(e) => setNewComment(e.target.value)}
        style={{ width: "40%" }}

      />
      <br />
      <br />
      <Button
        style={{
          backgroundColor: "#927070",
          color: "white",
          width: 80,
          padding: 8,
          borderRadius: 10,
          fontSize: 17,
          marginLeft: "-32%",
          cursor: "pointer"
        }}
        onClick={AddComment}
      >
        הוסף
      </Button>
      {trip.comments && (
        <div style={{ width: '50%', margin: '0 auto' }}>
          {(trip.comments).map((item, index) => (
            <div key={index} style={{ padding: 30, textAlign: "right", position: "relative", marginBottom: '20px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  style={{
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    position: "absolute",
                    right: 10,
                    marginTop: "5px",
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/userProfile/${item.userName}`)}
                  src={commentUserPics[item.userName]}
                  alt="user-pic"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "./pictures/defaultUserPic.png";
                  }}
                />
                {item.isInfluencer === 1 && (
                  <img style={{ position: 'absolute', bottom: -40, right: 5, width: '15px', height: '15px' }} src="./pictures/verfaid.png" alt="verified" />
                )}
              </div>
              <div style={{ marginRight: 50, marginTop: 5, color: "black" }}>
                <strong>{item.userName}</strong>
                <br />
                <p style={{ margin: "10px 0" }}>{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
}

function shareButton(tripid) {
  const shareText = 'תראה איזה טיול שווה';
  const shareUrl = `https://proj.ruppin.ac.il/bgroup40/test2/tar2/dist/index.html#/TripPage/${tripid}`;
  const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`;
  window.location.href = whatsappUrl;
}
