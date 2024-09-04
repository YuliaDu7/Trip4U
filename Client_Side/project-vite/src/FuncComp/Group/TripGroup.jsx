import React, { useState, useEffect, useContext } from 'react';
import GroupChat from '../Firebase/GroupChat';
import { db } from '../Firebase/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, updateDoc, doc, query, where, deleteDoc, getDocs } from 'firebase/firestore';
import { Button, IconButton } from '@mui/material';
import { DataContext } from '../ContextProvider';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TripManger from './TripManger';
import TripUser from './TripUser';
import Map from '../TripPage/Map';
import { getDoc, setDoc } from 'firebase/firestore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function TripGroup() {
  const [message, setMessage] = useState('');
  const dataContext = useContext(DataContext);
  const loggedUser = dataContext.loggedUser.userName;
  const { groupId } = useParams();  
  const [tripData, setTripData] = useState(null);
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [chatId] = useState(groupId);
  const [manager, setManager] = useState('');
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [suggestedRestaurants, setSuggestedRestaurants] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const { tripId } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    fetch(dataContext.apiUrl +`/Group/GetGroupTrip?tripId=${tripId}`)
      .then(response => response.json())
      .then(data => {
        const { trip, allPlaces, allRestuarnet, manger } = data;
        
        setTripData({
          ...trip,
          tripDate: trip.tripDate ? trip.tripDate.slice(0, 10) : '',
        });
        setPlaces(allPlaces);
        setRestaurants(allRestuarnet);
        setManager(manger);
      })
      .catch(error => console.error('Error fetching trip data:', error));

      if (dataContext.loggedUser.userName) {
        const loadVotes = async () => {
          const votesQuery = query(collection(db, 'votes'), where('user', '==', dataContext.loggedUser.userName));
          const voteSnapshot = await getDocs(votesQuery);
          const votes = {};
          voteSnapshot.forEach(doc => {
            const voteData = doc.data();
            votes[voteData.itemType + "_" + voteData.itemId] = voteData.itemId;
          });
          setUserVotes(votes);
        };
        loadVotes();
      } else {
        console.error('loggedUser is undefined or missing');
      };

    const placesQuery = query(collection(db, 'suggestedPlaces'), where('tripId', '==', tripId));
    const unsubscribePlaces = onSnapshot(placesQuery, (snapshot) => {
      setSuggestedPlaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const restaurantsQuery = query(collection(db, 'suggestedRestaurants'), where('tripId', '==', tripId));
    const unsubscribeRestaurants = onSnapshot(restaurantsQuery, (snapshot) => {
      setSuggestedRestaurants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribePlaces();
      unsubscribeRestaurants();
    };
  }, [loggedUser]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: message,
          createdAt: serverTimestamp(),
          sender: loggedUser,
        });
        setMessage('');
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleVote = async (id, type) => {
    try {
      const voteKey = type + "_" + id;
      const voteRef = doc(db, 'votes', `${loggedUser}_${id}_${type}`);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        await deleteDoc(voteRef);
        const itemRef = doc(db, type === 'place' ? 'suggestedPlaces' : 'suggestedRestaurants', id);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          await updateDoc(itemRef, {
            votes: (itemSnap.data().votes || 0) - 1,
          });
          setUserVotes({ ...userVotes, [voteKey]: null });
        }
      } else {
        await setDoc(voteRef, {
          user: loggedUser,
          itemId: id,
          itemType: type,
        });

        const itemRef = doc(db, type === 'place' ? 'suggestedPlaces' : 'suggestedRestaurants', id);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          await updateDoc(itemRef, {
            votes: (itemSnap.data().votes || 0) + 1,
          });
          setUserVotes({ ...userVotes, [voteKey]: id });
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const tripLocations = [
    ...(tripData?.places?.map(place => ({
      name: place.placeName,
      description: place.placeDescription,
      url: place.placeMap,
      type: 'place'
    })) || []),  
    ...(tripData?.rests?.map(rest => ({
      name: rest.restName,
      description: rest.restDescription,
      url: rest.restMap,
      type: 'restaurant'
    })) || [])  
  ];
  

  return (
    <div dir="rtl" style={{ color: "#7c99ab", fontFamily: "inherit", minHeight: "100vh", overflow: "auto", backgroundColor: "#eef3f8" }}>
        {/* Central Trip Title */}

    <p onClick={() => navigate(-1)}  style={{  marginTop: "20px", cursor: "pointer", textAlign: "right", position: "relative", marginRight: 50,color: "black"}}> 
          <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} />
          <b>בחזרה לעמוד הקודם </b>
        </p>
        <div style={{ width: "60%", margin: "0 20px",marginRight:"13%", borderRadius: "10px",}}>
          {tripData && (
    <h1 style={{ textAlign: "center", fontSize: "50px", marginBottom: "20px" }}>
      {tripData.tripTitle}
    </h1>
  )}</div>
     
     <div style={{ width: "95%", margin: "0 auto", display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', padding: '20px 0' }}>
       
       
          
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 20, 
              width: isChatOpen ? '400px' : '200px', 
              height: isChatOpen ? '500px' : '56px', 
              overflow: 'hidden',
              backgroundColor: "white",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.1)",
              transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
              zIndex: 1000,
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              display: 'flex',
              flexDirection: 'column', 
            }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
              <IconButton onClick={() => setIsChatOpen(!isChatOpen)} style={{ backgroundColor: '#7c99ab', color: 'white', marginRight: '8px' }}>
                {isChatOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
             <h3 style={{ paddingRight: 20, margin:0 ,fontWeight: 'bold', color: '#7c99ab' }}>צ'אט קבוצתי</h3>
        </div>
             

                  <div className="chat" style={{ color: "black", flex: 1, overflowY: "scroll", direction: "rtl", padding: "10px", scrollbarColor: "#7c99ab #f1f1f1", scrollbarWidth: "thin" }}>
                    <GroupChat chatId={chatId} loggedUser={loggedUser} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', padding: "10px", backgroundColor: 'white', zIndex: 1 }}>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="הקליד/י הודעה..."
                      style={{ flex: 1, backgroundColor: "white", border: "1px solid #7c99ab", borderRadius: 5, padding: "8px", color: "black", direction: "rtl" }}
                    />
                    <Button onClick={sendMessage} style={{ padding: "8px 16px", borderRadius: 5, border: "1px solid #7c99ab", backgroundColor: "#7c99ab", color: "white", marginLeft: 10 ,marginRight: 10 }}>
                      שלח
                    </Button>
                  </div>
              
            </div>

      
        {/* Suggestions Section */}
        <div style={{ width: "25%", borderRadius: "10px", padding: "15px", backgroundColor: "white",height:"100%" }}>
          <h2 style={{ textAlign: "center", fontSize: 25, marginBottom: "15px", color: "black" }}>הצעות שהתקבלו:</h2>
          
        
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ textAlign: "center", fontSize: 20, backgroundColor: "#eef3f8", padding: "5px 10px", borderRadius: "8px" }}>מקומות</h3>
            {suggestedPlaces.map((place, index) => {
              const voteKey = `place_${place.id}`;
              return (
                <div key={index} style={{ textAlign: "right", fontSize: 15, marginBottom: 10, padding: "10px", borderBottom: "inset ", borderRadius: "8px", backgroundColor: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{width:"65%"}}>
                  <p style={{color:"black"}}><b>{place.placeName} </b>
                    <br />   <br />  הצבעות: {place.votes || 0}</p>
                  <p>הוצע על ידי:  {place.suggestedBy}</p>
                </div>
                <Button 
                  variant="contained" 
                  onClick={() => handleVote(place.id, 'place')}
                  style={{ backgroundColor: userVotes[voteKey] ? '#bbb' : '#7c99ab'}}
                >
                  {userVotes[voteKey] ? ' בטל הצבעה ' : 'הצבע'}
                </Button>
              </div>
              
              );
            })}
          </div>
  
          <div>
            <h4 style={{ textAlign: "center", fontSize: 20, backgroundColor: "#eef3f8", padding: "5px 10px", borderRadius: "8px" }}>מסעדות</h4>
            {suggestedRestaurants.map((restaurant, index) => {
              const voteKey = `restaurant_${restaurant.id}`;
              return (
                <div key={index} style={{ textAlign: "right", fontSize: 15, borderBottom: "inset ", marginBottom: 10, padding: "10px", borderRadius: "8px", backgroundColor: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{width:"65%"}}>
                  <p style={{color:"black"}}><b> {restaurant.restaurantName}</b> <br />  <br /> הצבעות: {restaurant.votes || 0} </p>
                  <p>הוצע על ידי:    {restaurant.suggestedBy}</p>
                </div>
                <Button 
                  variant="contained" 
                  onClick={() => handleVote(restaurant.id, 'restaurant')}
                  style={{ backgroundColor: userVotes[voteKey] ? '#bbb' : '#7c99ab' }}
                >
                  {userVotes[voteKey] ? ' בטל הצבעה  ' : 'הצבע'}
                </Button>
              </div>
              
              );
            })}
            

          </div>
          
        </div>
          {/* User or Manager Content */}
          <div style={{ width: "60%", margin: "0 20px", backgroundColor: "white", padding: "20px",marginRight:"10%", borderRadius: "10px", }}>
          {tripData && (
            manager === loggedUser ? (
              <TripManger
                initialTripData={tripData}
                initialPlaces={places}
                initialRestaurants={restaurants}
              />
            ) : (
              <TripUser
                initialTripData={tripData}
                initialPlaces={places}
                initialRestaurants={restaurants}
              />
            )
          )}
            <h2 style={{color:"#927070"}}>מסלול הטיול</h2>
              {/* GroupMap Component */}
          <Map location={tripLocations} width={"70%"}/>
        </div>
  
      </div>
    </div>
  );
}
