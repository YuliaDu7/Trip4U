import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge'; 
import { DataContext } from '../ContextProvider';
import SideBar from './SideBar';
import { query, collection, where, onSnapshot } from 'firebase/firestore'; 
import { db } from '../Firebase/firebase';

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

export default function NavBar(props) {
  const [drawerState, setDrawerState] = useState(false);
  const dataContext = useContext(DataContext);
  const [user, setUser] = useState(DataContext.loggedUser);
  const [weather, setWeather] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); 
  const location = useLocation();
  const date = new Date();
  const hours = date.getHours();
  const navigate = useNavigate();
  const userDate = new Date(dataContext.loggedUser.birthDate);
  const windowDimension = { width: window.innerWidth, height: window.innerHeight };
  const [isBirthday,setBirthday] = useState (false)
  useEffect(() => {
    setUser({ ...dataContext.loggedUser });

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const isWithinRange = (userDate, date) => {
      const sameMonthCondition = userDate.getMonth() === date.getMonth() && 
        Math.abs(userDate.getDate() - date.getDate()) <= 10;
    
      const nextMonthCondition = userDate.getMonth() === date.getMonth() + 1 && 
        userDate.getDate() + daysInMonth(date.getFullYear(), date.getMonth()) - date.getDate() <= 10;
    
      const prevMonthCondition = userDate.getMonth() === date.getMonth() - 1 && 
        date.getDate() + daysInMonth(userDate.getFullYear(), userDate.getMonth()) - userDate.getDate() <= 10;
    
      return sameMonthCondition || nextMonthCondition || prevMonthCondition;
    };
      
    if (isWithinRange(userDate, date) && location.pathname.toLowerCase() === '/homepage'){
      setConfetti(true);
      setBirthday(true);
    }
    else {
      setConfetti(false); 
    }
 
    
    if (dataContext.loggedUser.userName) {
      checkUnreadNotifications(); 
    }
  }, [dataContext.loggedUser.userName, location.pathname,isBirthday]);

  const checkUnreadNotifications = () => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", dataContext.loggedUser.userName),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasUnreadNotifications(!snapshot.empty);
    });

    return () => unsubscribe();
  };

  const fetchWeather = async (apiKey) => {
   
    try {
      const response = await fetch(`${apiUrl}?q=Tel Aviv&appid=${apiKey}&units=metric&lang=he`);
      if (!response.ok) {
       const apiKey ="";
      //const apiKey = '!!!';
     fetchWeather (apiKey);

      }
      else{
      const data = await response.json();
      setWeather(`${data.main.temp}°C, ${data.weather[0].description}`);
      setWeatherIcon(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);}
    } catch (error) {
      setWeather('Error fetching weather');
    }
  };

  const greeting = () => {
    if (isBirthday) {
      return 'יום הולדת שמח';
    } else if (hours >= 5 && hours < 11) {
      return 'בוקר טוב';
    } else if (hours >= 11 && hours < 17) {
      return 'צהריים טובים';
    } else if (hours >= 17 && hours < 21) {
      return 'ערב טוב';
    } else {
      return 'לילה טוב';
    }
  };

  const handleLogout = () => {
    dataContext.HandleLogOut();
    navigate('/');
  };
  
//is influence
      const [isInfluencer, setIsInfluencer] = useState(false);    
      useEffect(() => {
        checkInfluencerStatus();
      }, [dataContext.loggedUser.userName]);
    
      function checkInfluencerStatus() {    
        const storedUserList = localStorage.getItem("UserList");
        
        if (storedUserList) {
          const userList = JSON.parse(storedUserList);    
          const influencerStatus = userList.isInflunce;    
          setIsInfluencer(influencerStatus === true);
        }
      }

    useEffect(() => {
         // const apiKey = '!!!';
      const apiKey = '328bc7fe7396df2cede3f3102baaafe9';
        //const apiKey = '9c8f22c64410a00d35a16447cab79478';
        fetchWeather(apiKey);

      },[])

  return (
    <>
      {confetti && <> <ReactConfetti width={windowDimension.width} height={windowDimension.height} />
      <button
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              zIndex: 1000,
              backgroundColor: '#ff6666',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              cursor: 'pointer'
            }}
            onClick={()=>setConfetti(false)}
          >
            הפסק קונפטי
          </button>
        </>
      }
      {user && (
        <div>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: 'white', borderBottom: '1px solid #ccc' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10%', color: "black" }}>
              <img style={{ cursor: 'pointer', height: '70px', marginRight: '-3px' }} src="./logo.png" alt="Trip4U Logo" onClick={() => navigate('/homepage')} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: 'black', marginRight: '5%' }}>
              <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'black', marginLeft: '20px', display: 'flex', alignItems: 'center', paddingRight: 15 }}>
                  <img src={weatherIcon} alt="Weather Icon" style={{ height: '50px', verticalAlign: 'middle', marginRight: '5px' }} />
                  {weather}
                </span>
                :התחזית להיום
                <span style={{ color: 'black', paddingLeft: 30 }}>,{greeting()} {user.firstName}</span>
                <div style={{position:"relative", display: 'inline-block'}}>
                <img
                  style={{ cursor: 'pointer', height: 40, width: 40, borderRadius: '50%', marginLeft: '30px', marginRight: '20px' }}
                  src={dataContext.loggedUserPic}
                  alt="User"
                  onClick={() => navigate('/Profile')}
                />
                {isInfluencer && (
                  <img
                    src="./pictures/verfaid.png" 
                    alt="Iverified"
                    style={{
                      height: "17px",
                      width: "17px",
                      position: "absolute",
                      right: "15%",
                      top: "55%" 
                    }} 
                  />
                )}
                  </div>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#927070',
                    cursor: 'pointer',
                    padding: '0 10px',
                    fontSize: '16px',
                    marginLeft: '10px',
                    whiteSpace: 'nowrap',
                    textDecoration: "underline"
                  }}
                  onClick={handleLogout}
                >
                  התנתקות
                </button>
              </div>

              <Badge color="error" variant="dot" invisible={!hasUnreadNotifications}>
                <MenuIcon onClick={() => { setDrawerState(true) }} style={{ cursor: 'pointer', marginLeft: '20px' }} />
              </Badge>

              <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
