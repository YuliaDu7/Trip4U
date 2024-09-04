import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


export const DataContext = createContext();

export default function ContextProvider(props) {

  const apiUrl = 'https://proj.ruppin.ac.il/bgroup40/test2/tar1/api';
  const [loggedUser, setLoggedUser] = useState("")
  const [loggedUserPic, setLoggedUserPic] = useState("");


  useEffect(() => {
    const userList = JSON.parse(localStorage.getItem("UserList"))
    if (userList) {
      setLoggedUser(userList)
    }

  }, [])

  const HandleLogOut = () => {
    setLoggedUser(""); setLoggedUserPic("");
    localStorage.removeItem('UserList');

  }

  const GetImage = async (controller) => {
    const fullUrl = apiUrl + controller;
    return fetch(fullUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.blob();
      })
      .then((imageBlob) => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        return imageObjectURL;
      })
      .catch((error) => {
        console.log(error);
        if(controller.includes("GetUserPic"))
        return ("./pictures/defaultUserPic.png")
      else      return ("./pictures/defaultPicture.png")
       
      });
  }

  const UploadImage = async (endpoint, image) => {
    const formData = new FormData();
    formData.append("file", image);

    fetch(apiUrl + endpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Image uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const DeleteImage = async (endpoint) => {
    fetch(`${apiUrl}${endpoint}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete image');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Image deleted successfully:", data);
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };



  useEffect(() => {

    if (loggedUser !== "") {
      fetch(apiUrl + `/GetImage/GetUserPic?primaryKey=${loggedUser.userName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }
          return response.blob();
        })
        .then((imageBlob) => {
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setLoggedUserPic(imageObjectURL);
        })
        .catch((error) => {
          console.log(error);
          
          setLoggedUserPic("./pictures/defaultUserPic.png")
        });

    }


  }, [loggedUser])



  return (
    <DataContext.Provider value={{ loggedUser, setLoggedUser, loggedUserPic, GetImage, UploadImage, HandleLogOut, apiUrl, DeleteImage }}>{props.children}</DataContext.Provider>
  )
}
