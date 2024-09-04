import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useMediaQuery } from "@mui/material";
import { DataContext } from "../ContextProvider";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});


export default function SignUp(props) {
  
  const dataContext = useContext(DataContext);
  const apiUrl = dataContext.apiUrl;

  const theme = createTheme({ direction: 'rtl' });
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const sessionData = JSON.parse(sessionStorage.getItem('userDetails')) || {
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    instagramUrl: "",
    birthDate: "",
    userPic: "",
    email: "",
  };

  const [user, setUser] = useState(sessionData);

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    instagramUrl: "",
    birthDate: "",
    userPic: "",
    email: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };



  async function registerUser() {
    let tempErrors = {};
    let counter = 0;
    const response = await fetch(apiUrl + `/Data/CheckIfExist`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userName: user.userName,
          email: user.email
      })
  });
   const data = await response.json();


    if (!/^[a-zA-Z0-9_]+$/.test(user.userName) || user.userName === "")
      tempErrors.userName = "שם משתמש יכול לכלול רק אותיות באנגלית, מספרים וקווים תחתיים והוא חובה."; 
    else {
     
     
      if (!data.userName) {
        tempErrors.userName = "";
        counter++;
      } else {
        tempErrors.userName = "שם משתמש קיים במערכת."; 
      }
    }

    if (user.password.length < 6 || user.password === "")
      tempErrors.password = "סיסמה חייבת להיות מורכבת לפחות מ-6 תווים והיא חובה";
    else {
      tempErrors.password = "";
      counter++;
    }

    if (user.confirmPassword !== user.password) 
      tempErrors.confirmPassword = "הסיסמאות לא זהות";
    else {
      tempErrors.confirmPassword = "";
      counter++;
    }

    if (!/^[\u0590-\u05FF ]+$/.test(user.firstName) || user.firstName === "") 
      tempErrors.firstName = "שם פרטי חייב להיות בעברית והוא חובה";
    else {
      tempErrors.firstName = "";
      counter++;
    }

    if (user.birthDate === "") 
      tempErrors.birthDate = "נא לבחור תאריך לידה";
    else {
      tempErrors.birthDate = "";
      counter++;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) || user.email === "") 
      tempErrors.email = "כתובת אימייל לא תקינה";
    else {
      if (!data.email){
      tempErrors.email = "";
      counter++;
    }
      else tempErrors.email = "האימייל כבר רשום במערכת.";
    }

    if (counter === 6) {
      props.send2ParentDetails(user, imageFile);
    sessionStorage.setItem('userDetails', JSON.stringify(user));
}
    else
      setErrors(tempErrors);
  };
  const themes = useTheme();
  const isXs = useMediaQuery(themes.breakpoints.between('xs', 'xl')); // בודק אם המסך הוא בין XS ל-LG
  const isXl = useMediaQuery(themes.breakpoints.only('xl'));
  console.log("Current screen size breakpoint:", themes.breakpoints.values);

console.log("isXs:", isXs);  // בדיקה אם נמצא במסך קטן מאוד
console.log("isXl:", isXl); 
  return (
    <>
      <div
        style={{
          textAlign: "center",
          direction: "rtl",
          height: "100%",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Grid container style={{ height: "100%", width: "100%" }}>
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Grid 
                item xs={12} md={6} 
                style={{ 
                  height: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: "32px",
                }}>
                <div id="rightDiv" style={{ width: "100%", maxWidth: "400px" }}>
                  <h1 style={{ color: "black" }}>הרשמה</h1>
                  <Grid container   spacing={{ xs: 2, xl: 3 }} style={{ justifyContent: "center",}}>
                  <Grid item xs={10} xl={12}>
                  <TextField
                        label="שם משתמש"
                        variant="outlined"
                        onChange={(e) => setUser({ ...user, userName: e.target.value })}
                        style={{ width: "100%" }}
                        value={user.userName}
                        error={errors.userName !== ""}
                        helperText={errors.userName}
                        size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                      />
                    </Grid>

                    <Grid item xs={10} xl={12}>
                    <TextField
                        label="סיסמה"
                        variant="outlined"
                        type="password"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        style={{ width: "100%" }}
                        value={user.password}
                        error={errors.password !== ""}
                        helperText={errors.password}       
                       size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                      />
                    </Grid>

                    <Grid item xs={10} xl={12}>                 
                     <TextField
                        label="אימות סיסמה"
                        variant="outlined"
                        type="password"
                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                        style={{ width: "100%" }}
                        value={user.confirmPassword}
                        error={errors.confirmPassword !== ""}
                        helperText={errors.confirmPassword}
                        size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                   />
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <TextField
                        label="שם פרטי"
                        variant="outlined"
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        style={{ width: "100%" }}
                        value={user.firstName}
                        error={errors.firstName !== ""}
                        helperText={errors.firstName}
                        size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                      />
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <Stack component="form" noValidate spacing={3}>
                        <TextField
                          dateformat="dd/mm/yyyy"
                          id="date"
                          label="תאריך לידה"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                          value={user.birthDate}
                          error={errors.birthDate !== ""}
                          helperText={errors.birthDate}
                          style={{ width: "100%" }}
                          size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <Button
                        style={{
                          backgroundColor: "#fff",
                          color: "#000",
                          width: "100%",
                        }}
                        component="label"
                        variant="contained"
                        startIcon={
                          <CloudUploadIcon style={{ marginRight: "5px", color: "#474747" }} />
                        }
                      >
                        העלאת תמונה
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <TextField
                        label="כתובת מייל"
                        variant="outlined"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        style={{ width: "100%" }}
                        value={user.email}
                        error={errors.email !== ""}
                        helperText={errors.email}
                        size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                      />
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <TextField
                        label="קישור לאינסטגרם"
                        variant="outlined"
                        onChange={(e) => setUser({ ...user, instagramUrl: e.target.value })}
                        style={{ width: "100%" }}
                        value={user.instagramUrl}
                        size={isXs ? "small" : isXl ? "medium" : "medium"} // שימוש ב- small עבור XS ו-medium (רגיל) עבור XL

                      />
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <Button
                        style={{
                          backgroundColor: "#927070",
                          width: "100%",
                          color: 'white',
                          padding: 10,
                          borderRadius: 10,
                          fontSize: 17,
                        }}
                        variant="contained"
                        onClick={registerUser}
                      >
                        הרשמה
                      </Button>
                    </Grid>

                    <Grid item xs={10} xl={12}>
                      <Link to="/">למסך ההתחברות</Link>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} md={6} style={{ display: "flex" }}>
            <div style={{
              position: "relative",
              backgroundColor: "rgb(239, 248, 255)",
              minHeight: "100vh", 
              height: "100%", 
              width: "100%", 
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <img 
                src="./pictures/SignUp.png"
                alt="sidePic"
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  position: "absolute", 
                  bottom: "0", 
                  left: "50%", 
                  transform: "translateX(-50%)" 
                }} 
              />
  </div>
              </Grid>
            </ThemeProvider>
          </CacheProvider>
        </Grid>
      </div>
    </>
  );
}
