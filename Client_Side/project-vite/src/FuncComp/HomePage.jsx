import React, { useState, useEffect, useContext, useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './ContextProvider';
import { fetchUserData, handleKeyDown, fetchTripData } from './Gpt';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VoiceRecognitionDialog from './VoiceRecognitionDialog'; 

export default function HomePage(props) {
  const navigate = useNavigate();
  const dataContext = useContext(DataContext);
  const apiUrl = dataContext.apiUrl;
  const [searchQuery, setSearchQuery] = useState("");
  const [top3, setTop3] = useState({ top3: [{ tags: [] }] });
  const [influancerUsersImage, setInfluancerUsersImage] = useState([]);
  const [tripsPics, setTripsPics] = useState([]);
  const [tripsUsersPics, setTripsUsersPics] = useState([]);
  const [recommendUsers, setRecommendUsers] = useState([]);
  const [recommendUsersImage, setRecommendUsersImage] = useState([]);
  const bthnRef = useRef(null);
  const [recommendTrips, setRecommendTrips] = useState([]);
  const [recommendTripsImage, setRecommendTripsImage] = useState([]);
  const [recommendTripsUsersPics, setRecommendTripsUsersPics] = useState([]);
  const [followTripsPics, setFollowTripsPics] = useState([]);
  const [followTripsUsersPics, setFollowTripsUsersPics] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchMode, setSearchMode] = useState(false);
  const inputRef = useRef(null);
  const followTripsRef = useRef(null);

  useEffect(() => {
    if (bthnRef.current) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://bringthemhomenow.net/1.1.0/hostages-ticker.js";
      script.setAttribute("integrity", "sha384-DHuakkmS4DXvIW79Ttuqjvl95NepBRwfVGx6bmqBJVVwqsosq8hROrydHItKdsne");
      script.setAttribute("crossorigin", "anonymous");
      bthnRef.current.appendChild(script);
    }  
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
       
        const response = await fetch(apiUrl + `/TripData/GetHomePageData?userName=${dataContext.loggedUser.userName}`);
        const data = await response.json();
        setTop3(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHomePageData();

    fetchUserData(dataContext.loggedUser.userName, apiUrl).then(setRecommendUsers);
    fetchTripData(dataContext.loggedUser.userName, apiUrl).then(setRecommendTrips);
  }, [apiUrl, dataContext.loggedUser.userName]);

  const fetchImages = (items, setState, getImagePath) => {
    const pics = [];
    items.forEach((item, index) => {
      dataContext.GetImage(getImagePath(item))
        .then(image => {
          pics[index] = image;
          setState([...pics]);
        });
    });
  };

  const scrollLeft = () => {
    followTripsRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    followTripsRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (top3.influancers) fetchImages(top3.influancers, setInfluancerUsersImage, user => `/GetImage/GetUserPic?primaryKey=${user}`);
    if (top3.top3) {
      fetchImages(top3.top3, setTripsPics, trip => `/GetImage/GetMainPic?tripid=${trip.tripId}`);
      fetchImages(top3.top3, setTripsUsersPics, trip => `/GetImage/GetUserPic?primaryKey=${trip.userName}`);
    }
    if (top3.followTrips) {
      fetchImages(top3.followTrips, setFollowTripsPics, trip => `/GetImage/GetMainPic?tripid=${trip.tripId}`);
      fetchImages(top3.followTrips, setFollowTripsUsersPics, trip => `/GetImage/GetUserPic?primaryKey=${trip.userName}`);
    }
  }, [top3]);

  useEffect(() => {
    if (recommendUsers.length) fetchImages(recommendUsers, setRecommendUsersImage, user => `/GetImage/GetUserPic?primaryKey=${user.userName}`);
  }, [recommendUsers]);

  useEffect(() => {
    if (recommendTrips.length) {
      fetchImages(recommendTrips, setRecommendTripsImage, trip => `/GetImage/GetMainPic?tripid=${trip.tripId}`);
      fetchImages(recommendTrips, setRecommendTripsUsersPics, trip => `/GetImage/GetUserPic?primaryKey=${trip.userName}`);
    }
  }, [recommendTrips]);



  const isRespons = windowWidth <= 1700;

  const handleSpeechResult = (result) => {
    setSearchQuery(result);
    inputRef.current.value = result;
    handleKeyDown({ key: 'Enter', target: inputRef.current }, apiUrl, props.send2ParentsOptions);
  };

  const buttonStyle = {
    fontFamily: 'inherit',
    position: "absolute",
    width: isRespons ? 350 : 500,
    height: 40,
    borderRadius: 10,
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    color: "#697e42",
    fontSize: 20,
    cursor: 'pointer',
    boxShadow: "#697e42 3px 5px 18px",
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'inherit', textAlign: "center", color: "#697e42", position: "relative" }}>
      <div style={{position:'relative'}}>
        <img src="./pictures/Screenshot 2024-05-30 150532.png" style={{ width: "100%", height: "30%" }} alt="banner" />
        {!searchMode ? (
          <Button style={{ ...buttonStyle,   top: "65%",  left: "73%",  }}
            onClick={() => setSearchMode(true)}
          >
            <SearchIcon style={{ position: "absolute", left: "10%", marginTop: "-1" }} />
            נחפש טיול
          </Button>
        ) : (
          <div style={{ position: "absolute", top: "68%", left: "73%", transform: "translate(-50%, -50%)", width: isRespons ? 350 : 500 }} >
            <div style={{ position: "relative", width: "100%" }}>
              <SearchIcon style={{ position: "absolute",  right: 10,  top: "50%",   transform: "translateY(-50%)",  color: "#697e42",  }}  />
              <VoiceRecognitionDialog onResult={handleSpeechResult} />
              <input
                type="text"
                placeholder="אני רוצה לטייל ב..."
                style={{  fontFamily: 'inherit', width: "100%", height: 40, borderRadius: 10, backgroundColor: "white", color: "#697e42",fontSize: 20,textAlign: "right",
                  paddingRight: 40, cursor: 'text', border: "3px solid #697e42", boxShadow: "#697e42 3px 2px 10px", }}
                onKeyDown={(event) => handleKeyDown(event, apiUrl, props.send2ParentsOptions)}
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <a   onClick={(e) => { e.preventDefault(); navigate('/searchTrip');  }}
                style={{color: "#697e42",textDecoration: "underline",  cursor: "pointer",fontSize: "16px",  fontWeight:"bold"  }}  >
                רוצה לענות על שאלון קצר במקום?
              </a>
            </div>
          </div>
        )}
        
        <Button
          style={{...buttonStyle,  top: "50%", left: "73%",  }}
          onClick={() => navigate('/ShareTrip')}
        >
          <CreateIcon style={{ position: "absolute", left: "10%", marginTop: "-1" }} />
          נשתף טיול
        </Button>
        
      </div>
      <div id="bthn" lang="he" ref={bthnRef}></div>
      <br /><br /> <br />

      <div style={{ height: top3.followTrips && top3.followTrips.length > 0 ? 400 : 200,  position: 'relative', backgroundColor: "#eff8ff", margin: "15px 10px", padding: "50px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", borderRadius: "15px" }}>
  <h2 style={{ marginBottom: "30px", textAlign: top3.followTrips && top3.followTrips.length > 0 ? "right" : "center", color: "#927070", }}>
    {top3.followTrips && top3.followTrips.length > 0 ? "טיולים במעקב" : "עקוב אחרי אנשים כדי להתעדכן בטיולים חדשים"}
  </h2>

  {top3.followTrips && top3.followTrips.length > 0 ? (
    <>
      <ArrowBackIosIcon
        onClick={scrollLeft}
        style={{
          position: 'absolute', top: '50%', left: '0',
          transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1,
        }}
      />

      <div ref={followTripsRef} style={{ paddingTop: 8, paddingBottom: 8, height: "80%", cursor: 'pointer', display: "flex", justifyContent: "space-around", color: "black", overflowX: "scroll", overflowY: "hidden", msOverflowStyle: "none", scrollbarWidth: "none", scrollBehavior: "smooth" }}>
        {top3.followTrips.map((trip, index) => (
          <div key={index} onClick={() => { navigate(`/TripPage/${trip.tripId}`) }}
            onMouseEnter={e => {
              e.currentTarget.style.transition = "transform 0.3s ease";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transition = "transform 0.3s ease";
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{ textAlign: "center", position: "relative", width: "30%", minWidth: "350px", margin: "0 30px" }}
          >
            <img style={{ borderRadius: "10%", width: "90%", height: "70%", objectFit: "cover" }} src={followTripsPics[index]} alt={`trip${index}`} />
            <div style={{ position: "absolute", bottom: "30%", right: isRespons ? "60px" : "30px" }}>
              {trip.tags && trip.tags.map((tag, tagIndex) => (
                <span key={tagIndex} style={{ backgroundColor: "#DBCDA4", borderRadius: "15px", margin: 20, padding: "10px 25px" }}>{tag}</span>
              ))}
            </div>
            <div style={{ position: 'relative', right: "100px", bottom: isRespons ? "-5px" : "-15px" }}>
              <img style={{ position: "absolute", right: "-25%", top: "-10px", borderRadius: "50%", width: "50px", height: "50px", objectFit: "cover", marginTop: "5px", border: "solid 5px lightblue" }} src={followTripsUsersPics[index]} alt="user" />
              <h3 style={{ color: "#927070", margin: "0", position: "absolute", top: "10px", right: "-50px", textAlign: "center", width: "75%", marginRight: 20 }}>{trip.tripTitle}</h3>
            </div>
          </div>
        ))}
      </div>

      <ArrowForwardIosIcon
        onClick={scrollRight}
        style={{
          position: 'absolute', top: '50%', right: '0',
          transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1,
        }}
      />
    </>
  ) : null}
</div>

              
        <div style={{backgroundColor: "#eff8ff", padding: 50, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", borderRadius: "15px", margin: "0 10px" }}>
          <h2 style={{ marginBottom: "30px", textAlign: "right", color: "#927070" }}>משתמשים מומלצים </h2>
          {recommendUsersImage.map((imgSrc, index) => (
            // בדיקה אם recommendUsers[index] מוגדר
            recommendUsers[index] && (
              <div key={index} style={{ cursor: 'pointer', position: 'relative', display: 'inline-block', margin: '0 80px' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transition = "transform 0.3s ease";
                  e.currentTarget.style.transform = "scale(1.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transition = "transform 0.3s ease";
                  e.currentTarget.style.transform = "scale(1)";
                }}>
                <img
                  style={{ borderRadius: "50%", width: "150px", height: "150px", objectFit: "cover" }}
                  src={imgSrc}
                  alt={`user${index}`}
                  onClick={() => {
                    if (recommendUsers[index].userName === dataContext.loggedUser.userName)
                      navigate(`/Profile`);
                    else
                      navigate(`/userProfile/${recommendUsers[index].userName}`);
                  }}
                />
                {recommendUsers[index].isInfluencer === 1 && (
                  <img style={{ position: 'absolute', bottom: '5px', right: '5px', width: '30px', height: '30px' }} src="./pictures/verfaid.png" alt="verified" />
                )}
              </div>
            )
          ))}
        </div>



      <br />
      <div style={{ height:400,position:'relative',backgroundColor: "#eff8ff", margin: "15px 10px", padding: "50px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", borderRadius: "15px", }}>
      <h2 style={{ marginBottom: "30px", textAlign: "right", color: "#927070" }}>הטיולים המומלצים עבורך</h2>
        <div style={{cursor: 'pointer', display: "flex", justifyContent: "space-around", color: "black" }}>
        {recommendTrips.map((trip, index) => (
      <div key={index} onClick={() => { navigate(`/TripPage/${trip.tripId}`) }}
           onMouseEnter={e => {
             e.currentTarget.style.transition = "transform 0.3s ease";
             e.currentTarget.style.transform = "scale(1.15)";
           }}
           onMouseLeave={e => {
             e.currentTarget.style.transition = "transform 0.3s ease";
             e.currentTarget.style.transform = "scale(1)";
           }}
           style={{ textAlign: "center", position: "relative", width: "30%" }}>
        <img style={{ borderRadius: "10%", width: "80%", height: "250px", objectFit: "cover" }} src={recommendTripsImage[index]} alt={`trip${index}`} />
        <div style={{ position: "absolute", bottom: "3px", right : isRespons ? "60px" : "160px", }}>
          {recommendTrips[index] && recommendTrips[index].tags && recommendTrips[index].tags.map((tag, index) => (
            <span key={index} style={{backgroundColor: "#DBCDA4", borderRadius: "15px", margin: 20, padding: "10px 25px" }}>{tag}</span>
          ))}
        </div>
        <div style={{position: 'absolute',right:"100px", bottom: isRespons ? "-80px" : "-60px" }}>
          <img style={{ position:"absolute", right: "-58px", top: "-21px",borderRadius: "50%", width: "50px", height: "50px", objectFit: "cover", marginTop: "5px", border: "solid 5px lightblue"}} src={recommendTripsUsersPics[index]} alt="user" />
          <h3 style={{ color: "#927070", marginTop: "10px",marginRight: isRespons ? "10px":"80px" ,textAlign:"center"}}>{recommendTrips[index].tripTitle}</h3>
        </div>
      </div>
    ))}
        </div>
      </div>
      
  

      <br />
      <div style={{backgroundColor: "#eff8ff", padding: 50, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", borderRadius: "15px", margin: "0 10px" }}>
        <h2 style={{ marginBottom: "30px", textAlign: "right", color: "#927070" }}>משתמשים פופולריים</h2>
        {influancerUsersImage.map((imgSrc, index) => (
          <div onMouseEnter={e => {
            e.currentTarget.style.transition = "transform 0.3s ease";
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transition = "transform 0.3s ease";
            e.currentTarget.style.transform = "scale(1)";
          }}
          key={index} style={{ cursor: 'pointer', position: 'relative', display: 'inline-block', margin: '0 80px' }}>
            <img
              style={{ borderRadius: "50%", width: "150px", height: "150px", objectFit: "cover" }}
              src={imgSrc}
              alt={`user${index}`}
              onClick={() => {
                
                if (top3.influancers[index] == dataContext.loggedUser.userName)
                  navigate(`/Profile`)
                else
                  navigate(`/userProfile/${top3.influancers[index]}`)
              }}
             
            />
            <img style={{ position: 'absolute', bottom: '5px', right: '5px', width: '30px', height: '30px' }} src="./pictures/verfaid.png" alt="verified" />
          </div>
        ))}
      </div>

      <div style={{ height:400,position:'relative',backgroundColor: "#eff8ff", margin: "15px 10px", padding: "50px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", borderRadius: "15px", }}>
        <h2 style={{ marginBottom: "30px", textAlign: "right", color: "#927070" }}>הטיולים הפופולריים ביותר</h2>
        <div style={{cursor: 'pointer', display: "flex", justifyContent: "space-around", color: "black" }}>
          {top3.top3.map((trip, index) => (
            <div key={index} onClick={() => {navigate(`/TripPage/${trip.tripId}`) }}
                onMouseEnter={e => {
                  e.currentTarget.style.transition = "transform 0.3s ease";
                  e.currentTarget.style.transform = "scale(1.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transition = "transform 0.3s ease";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{ textAlign: "center", position: "relative", width: "30%" }}
              >
              <img style={{ borderRadius: "10%", width: "80%", height: "250px", objectFit: "cover" }} src={tripsPics[index]} alt={`trip${index}`} />
              <div style={{ position: "absolute", bottom: "3px", right : isRespons ? "60px" : "160px", }}>
                {top3.top3[0] && top3.top3[0].tags && top3.top3[index].tags.map((tag, index) => (
                  <span key={index} style={{backgroundColor: "#DBCDA4", borderRadius: "15px", margin: 20, padding: "10px 25px" }}>{tag}</span>
                ))}
              </div>
              <div style={{position: 'absolute',right:"100px", bottom: isRespons ? "-80px" : "-60px" }}>
                <img style={{ position:"absolute", right: "-58px", top: "-21px",borderRadius: "50%", width: "50px", height: "50px", objectFit: "cover", marginTop: "5px", border: "solid 5px lightblue"}} src={tripsUsersPics[index]} alt="user" />
                <h3 style={{ color: "#927070", marginTop: "10px",marginRight: isRespons ? "10px":"80px" ,textAlign:"center"}}>{top3.top3[index].tripTitle}</h3>
              </div>
              
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}
