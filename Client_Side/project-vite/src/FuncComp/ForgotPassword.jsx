import React, { useContext, useState } from 'react';
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


export default function ForgotPassword() {

    const navigate = useNavigate();

    const dataContext = useContext(DataContext);
    const apiUrl = dataContext.apiUrl;

    //לתמוך בעברית מימין לשמאל
    const theme = createTheme({ direction: 'rtl' });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const sendEmail = () => {
        if (email == "") {
            setErrorMessage("נא להכניס כתובת אימייל")
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("sample@sample.com אימייל לא תקין.")
        }
        else {
            fetch(apiUrl + '/sendEmail/sendPassword', {
                method: 'POST',
                body: JSON.stringify(email),
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
            })
                .then(response => {
                    if (response.status == 200) {
                        return response;
                    } else if (response.status == 400) {
                        throw new Error("BadRequest");
                    } else {
                        throw new Error("ServerError");
                    }
                })
                .then(() => {
                    setSuccessMessage("ברגע זה נשלח מייל ובו שחזור הסיסמה");
                    setErrorMessage("");
                })
                .catch((error) => {
                    setErrorMessage("אימייל זה לא קיים במערכת")
                    console.log(error);
                });

        }
    };




    return (
        <div style={{ textAlign: 'center', direction: "rtl", height: "100%", width: "100%" }}>
        <Grid container>
            <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', top: '5%' }}>
                        <div style={{ padding: '2% 0%', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '80%' }}>
                            {successMessage ? (
                            <div style={{height:'80px', padding:'5%'}}> 
                            <p style={{ color: "black" }}>{successMessage}</p> 
                            <Link to="/">חזרה לדף התחברות</Link>
                            </div>
                            ) : (
                                <>
                                    <h1 style={{ color: "black" }}>שכחת סיסמה?</h1>
                                    <p style={{ color: "grey" }}>זוכר/ת את הסיסמה שלך? <Link to="/">התחבר/י כאן</Link></p>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="כתובת אימייל"
                                                variant="outlined"
                                                style={{ width: "80%" }}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                style={{
                                                    backgroundColor: "#927070",
                                                    width: "80%",
                                                    color: 'white',
                                                    display: 'inline',
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    fontSize: 17,
                                                    marginBottom: 20,
                                                }}
                                                onClick={sendEmail}
                                                variant="contained"
                                            >שלח סיסמה
                                            </Button>
                                            <p style={{ color: 'red' }}>{errorMessage}</p>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
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
    )
}
