import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import TripPage from './FuncComp/TripPage/TripPage.jsx';
import Login from './FuncComp/Login.jsx';
import SearchTrip from './FuncComp/SearchTrip/SearchTrip.jsx';
import HomePage from './FuncComp/HomePage.jsx';
import NavBar from './FuncComp/MenuBar/NavBar.jsx';
import ShareTrip from './FuncComp/ShareTrip/ShareTrip.jsx';
import SignUpGenral from './FuncComp/SignUp/SignUpGenral.jsx';
import Options from './FuncComp/SearchTrip/Options.jsx';
import MyProfile from './FuncComp/Profile/MyProfile.jsx';
import MyFavorite from './FuncComp/Profile/MyFavorite.jsx';
import UserProfile from './FuncComp/Profile/UserProfile.jsx';
import EditTrip from './FuncComp/EditTrip/EditTrip.jsx';
import ContextProvider from './FuncComp/ContextProvider.jsx';
import ContextShare from './FuncComp/ShareTrip/ContextShare.jsx';
import EditProfile from './FuncComp/Profile/EditProfile.jsx';
import ForgotPassword from './FuncComp/ForgotPassword.jsx';
import GroupChat from './FuncComp/Firebase/GroupChat.jsx';
import CreateGroup from './FuncComp/Group/CreateGroup.jsx';
import TripGroup from './FuncComp/Group/TripGroup.jsx';
import SendMassege from './FuncComp/Firebase/SendMassege.jsx';
import ChatsList from './FuncComp/Firebase/ChatsList.jsx';
import MyGroup from './FuncComp/Group/MyGroup.jsx';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Group from './FuncComp/Group/Group.jsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [options, setOptions] = useState([]);
  const [showArrow, setShowArrow] = useState(false);


  function LoadOptions(opt) {
    console.log(opt)
    setOptions(opt);
  }

  useEffect(() => {
    if (options.length !== 0) navigate('/Options');
  }, [options]);

  useEffect(() => {
    /*   קבלה מלוקאל סטורג*/
    const userList = JSON.parse(localStorage.getItem("UserList"))
    if (!userList && location.pathname !== '/' && location.pathname !== '/SignUp' && location.pathname !== '/forgotPassword') {
      navigate('/');
    }

    const handleScroll = () => {
      if (window.scrollY > 0)
        setShowArrow(true);
      else
        setShowArrow(false);

    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };



  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ContextProvider>
      {showArrow && (
        <ArrowForwardIcon
          onClick={() => { window.scrollTo({ top: 0, behavior:"smooth"}); }}
          style={{
            position: 'fixed', right: '20px', bottom: '40px', paddingLeft: 10,
            marginRight: 50, transform: "rotate(-90deg)", cursor: 'pointer', fontSize: '30px',
            backgroundColor: "#697e42", color: "white", borderRadius: '50%', zIndex: 1,
          }}
        />
      )}

      {location.pathname !== '/SignUp' && location.pathname !== '/' && location.pathname !== '/forgotPassword' && <NavBar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUpGenral />} />
        <Route path="/TripPage/:tripId" element={<TripPage />} />
        <Route path="/ShareTrip" element={<ContextShare>  <ShareTrip /> </ContextShare>} />
        <Route path="/searchTrip" element={<SearchTrip send2ParentsOptions={LoadOptions} />} />
        <Route path="/HomePage" element={<HomePage send2ParentsOptions={LoadOptions} />} />
        <Route path="/Options" element={<Options options={options} />} />
        <Route path="/Profile" element={<MyProfile />} />
        <Route path="/Favorite" element={<MyFavorite />} />
        <Route path="/userProfile/:userName" element={<UserProfile />} />
        <Route path="/editTrip/:tripId" element={<EditTrip />} />
        <Route path="/group" element={<Group />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/chat" element={<GroupChat />} />
        <Route path="/ChatsList" element={<ChatsList />} />
        <Route path="/createGroup" element={<CreateGroup />} />
        <Route path="/myGroup" element={<MyGroup />} />
        <Route path="/TripGroup/:groupId" element={<TripGroup />} />
        <Route path="/SendMassege/:userName" element={<SendMassege />} />
      </Routes>
    </ContextProvider>
  );
}

export default App;
