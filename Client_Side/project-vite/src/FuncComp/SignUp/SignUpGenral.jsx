import React, { useState, useEffect, useContext } from "react";
import SignUp from "./SignUp";
import LikesTrip from "./LikesTrip";
import IntersTrip from "./IntersTrip";
import { useNavigate } from 'react-router-dom';
import { DataContext } from "../ContextProvider";


export default function SignUpGenral() {
  const dataContext = useContext(DataContext)
  const apiUrl = dataContext.apiUrl;


  const navigate = useNavigate();
  const [user, setUser] = useState({
    userName: "",
    password: "",
    firstName: "",
    instagramUrl: "",
    birthDate: "",
    userPic: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [propsSelected, setPropsSelected] = useState(false);
  const [signUP, setVisvble] = useState(<SignUp send2ParentDetails={GetDetials} user={user}/>);

  function GetDetials(userFromSign, imageFileFromSign) {
    setUser((prevUser) => ({
      ...prevUser,
      ...userFromSign,
    }));

    setImageFile(imageFileFromSign);
    setVisvble(<LikesTrip send2ParentType={GetTypes} send2ParentBack ={GoBack} />);
  }

  function GetTypes(typesId) {
    setUser((prevUser) => ({
      ...prevUser,
      typeID: [...typesId],
    }));
    setVisvble(<IntersTrip send2ParentProps={GetProps} send2ParentBack ={GoBack} />);
  }

  function GetProps(propsId) {
    setPropsSelected(true);
    setUser((prevUser) => ({
      ...prevUser,
      propID: [...propsId],
    }));
  }
  function GoBack (comp){
    
    if (comp=="type"){
      setVisvble(<SignUp send2ParentDetails={GetDetials} />)
    }
     else if (comp ="prop"){
      setVisvble(<LikesTrip send2ParentType={GetTypes} send2ParentBack ={GoBack} />);
    }
  }
  useEffect(() => {

    // לדעת אם אנחנו בשלב האחרון
    if (propsSelected) {
      let jsonString = JSON.stringify(user);
      console.log(jsonString);
      let options = {
        method: "POST",
        body: jsonString,
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      };
      let url = apiUrl +"/Data/signUp";

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });

      if (imageFile) {
        dataContext.UploadImage(`/UploadImage/UploadUserImage?userName=${user.userName}`, imageFile)
      }
      sessionStorage.removeItem('selectedIds');
      sessionStorage.removeItem('selectedProps');
      sessionStorage.removeItem('userDetails');
      navigate("/")
    }
  }, [propsSelected]);


  return (
    <>
      {signUP}
    </>
  );
}