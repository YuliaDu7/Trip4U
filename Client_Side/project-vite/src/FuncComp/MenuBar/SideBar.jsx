import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { DataContext } from "../ContextProvider";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import TextField from "@mui/material/TextField";

export default function SideBar(props) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userImages, setUserImages] = useState({});
  const navigate = useNavigate();
  const dataContext = useContext(DataContext);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", dataContext.loggedUser.userName),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasUnreadNotifications(!snapshot.empty);
    });

    return () => unsubscribe();
  }, [dataContext]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (
      !event.target.closest(".search-field") &&
      !event.target.closest(".search-result")
    ) {
      props.setDrawerState(open);
    }
  };

  const handleSearch = async (query) => {
    if (query) {
      
      const response = await fetch(
        dataContext.apiUrl +`/Search/SearchUserName?obj=${query}`
      );
      const data = await response.json();
      setSearchResults(data);

      const imagesTemp = {};
      await Promise.all(
        data.map(async (user) => {
          const imageObjectURL = await dataContext.GetImage(
            `/GetImage/GetUserPic?primaryKey=${user}`
          );
          imagesTemp[user] = imageObjectURL;
        })
      );
      setUserImages(imagesTemp);
    } else {
      setSearchResults([]);
      setUserImages({});
    }
  };

  useEffect(() => {
    if (searchQuery===" "){
      setSearchQuery("")
      return
    }
     searchQuery
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchResultClick = (userName) => {
    navigate(`/userProfile/${userName}`);
    setSearchQuery("");
    setSearchResults([]);
    props.setDrawerState(false);
  };

  const items = [
    { text: "דף הבית", icon: <HomeIcon />, nav: "/HomePage" },
    { text: "הקבוצות שלי", icon: <GroupsIcon />, nav: "/mygroup" },
    { text: "חיפוש טיול", icon: <SearchIcon />, nav: "/searchTrip" },
    { text: "שיתוף טיול", icon: <EditIcon />, nav: "/ShareTrip" },
    { text: "הפרופיל שלי", icon: <AccountCircleIcon />, nav: "/Profile" },
    { text: "מועדפים", icon: <FavoriteIcon />, nav: "/Favorite" },

    
  ];

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={(e) => toggleDrawer(false)(e)}
      onKeyDown={(e) => toggleDrawer(false)(e)}
    >
      <List>
        <Box mt={2} mb={1}>
          <ListItem key={items[0].text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(items[0].nav);
                props.setDrawerState(false);
              }}
            >
              <ListItemText
                style={{ textAlign: "right", marginRight: "5px" }}
                primary={items[0].text}
              />
              <ListItemIcon>{items[0].icon}</ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Box>
        <Divider />


        <Box mt={2} mb={1}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/ChatsList");
                props.setDrawerState(false);
              }}
            >
              <ListItemText
                style={{ textAlign: "right", marginRight: "10px" }}
                primary="הודעות"
              />
              <ListItemIcon>
                <Badge
                  color="error"
                  variant="dot"
                  invisible={!hasUnreadNotifications}
                >
                  <EmailIcon />
                </Badge>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          {items.slice(1).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.nav);
                  props.setDrawerState(false);
                }}
              >
                <ListItemText
                  style={{ textAlign: "right", marginRight: "10px" }}
                  primary={item.text}
                />
                <ListItemIcon>{item.icon}</ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      </List>
      <Divider />

      {/* חיפוש משתמשים */}
      <Box mt={2} mb={4}>
        <h4 style={{textAlign:"right", paddingRight:30}}>?לחפש משתמש</h4>
        <ListItem disablePadding>
          <TextField
            className="search-field"
        
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '80%', margin: '0 auto' }}    

            size="small"
          />
        </ListItem>
        <List>
          {searchResults.map((user, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                className="search-result"
                onClick={() => handleSearchResultClick(user)}
              >
                <ListItemText
                  style={{ textAlign: "right", paddingRight: 10 }}
                  primary={user}
                />
                <img
                  src={userImages[user]}
                  alt={user}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor={"right"}
      open={props.drawerState}
      onClose={toggleDrawer(false)}
    >
      {list()}
    </Drawer>
  );
}
