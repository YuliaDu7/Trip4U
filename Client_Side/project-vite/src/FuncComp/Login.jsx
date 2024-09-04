import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { DataContext } from './ContextProvider';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';


export default function Login() {
  const dataContext = useContext(DataContext);
  const navigate = useNavigate();
  //לתמוך בעברית מימין לשמאל
  const theme = createTheme({ direction: 'rtl' })
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const apiUrl = dataContext.apiUrl;
  let user = {
    password: "",
    username: "",
  };

  const [userState, setUser] = useState({ ...user });
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(()=>{
    if(dataContext.loggedUser){
      navigate("/HomePage")
    }
    
    

  },[dataContext.loggedUser])

  function LogIn() {
    if (!userState.username || !userState.password) {
      setError("נא להכניס שם משתמש וסיסמה");
      return;
    }
    setLoading(true);
    let obj = { userName: userState.username, password: userState.password };
    let jsonString = JSON.stringify(obj);
    let options = {
      method: 'PUT',
      body: jsonString,
      headers: new Headers({
        'Content-Type': 'application/json;  charset=UTF-8'
      }),
    };
    let url = apiUrl + '/Data/signIn';
    fetch(url, options)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.isExist) {
          
          // מעבר לעמוד הבית, שמירת טיולים שמתקבלים בסטייט באפ
          localStorage.setItem("UserList", JSON.stringify(data.list));
          dataContext.setLoggedUser(data.list);
          navigate('/HomePage');
        } else {
          setError("שם משתמש או סיסמה לא נכונים");
        }
      }).catch(function (error) {
        console.log(error);
        setError("שגיאה בשרת");
      })
      .finally(() => {
        setLoading(false); // הפסקת loading
      });
  }

  return (
    <div style={{ textAlign: 'center', direction: "rtl", height: "100%", width: "100%" }} >
      <Grid container>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', top: '5%' }} >
              <div id='rightDiv' style={{ padding: '10% 0% 0% 0%', width: '80%' }} >
                <h1 style={{ color: "black" }}>כניסה</h1>
                <Grid container spacing={2}>
                  <Grid item xs={12}>

                    <TextField
                      label="שם משתמש"
                      variant="outlined"
                      onChange={(e) => setUser({ ...userState, username: e.target.value })}
                      style={{ width: "40%" }}
                    />


                  </Grid>
                  <Grid item xs={12}>
                    <CacheProvider value={cacheRtl}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          label=" סיסמה"
                          variant="outlined"
                          type={showPassword ? 'text' : 'password'}
                          onChange={(e) => setUser({ ...userState, password: e.target.value })}
                          style={{ width: "40%" }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </ThemeProvider>
                    </CacheProvider>
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <p style={{ color: 'red' }}>{error}</p>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      style={{
                        backgroundColor: "#927070",
                        width: "40%",
                        color: 'white',
                        display: 'inline',
                        padding: 10,
                        borderRadius: 10,
                        fontSize: 17,
                      }}
                      variant="contained"
                      onClick={LogIn}
                    >כניסה
                    </Button>
                    <br></br>
                    {loading && (
                      <Grid mt={5} item xs={12}>
                        <CircularProgress style={{color: '#927070'}} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Link to="/SignUp"> אין לך משתמש קיים? להרשמה</Link>
                  </Grid>
                  <Grid item xs={12} >
                    <Link to="/forgotPassword">שכחתי סיסמה</Link>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6}
              style={{
                display: 'block', height: "100vh",
                '@media only screen and (minWidth:0px)': { display: 'none' },
                '@media only screen and (minWidth:600px)': { display: 'block' },
              }}>
              <div style={{ position: "relative", backgroundColor: 'rgb(239, 248, 255)', height: "100vh", width: "100%" }}>
                <img src='./pictures/loginNobackground.png' alt='sidePic' style={{
                  width: '100%', position: "absolute",
                  bottom: "0", left: "80px"
                }} />
              </div>
            </Grid>
          </ThemeProvider>
        </CacheProvider>
      </Grid>
    </div>
  );
}
