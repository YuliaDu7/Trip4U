import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Tooltip, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import { Link, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { DataContext } from '../ContextProvider';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function EditProfile() {

    //לתמונה
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


    const navigate = useNavigate();
    // לתמוך בעברית מימין לשמאל
    const theme = createTheme({ direction: 'rtl' })
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const dataContext = useContext(DataContext);
    const apiUrl = dataContext.apiUrl;

    const [user, setUser] = useState({
        bio: "",
        userName: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        instagramUrl: "",
        birthDate: "",
        userPic: "",
        email: "",
        typeID: [],
        propID: [],
    });

    const [typesImages, setTypesImages] = useState([
        { id: 1, src: './pictures/typeTrip/1.png', selected: false },
        { id: 2, src: './pictures/typeTrip/7.png', selected: false },
        { id: 3, src: './pictures/typeTrip/2.png', selected: false },
        { id: 4, src: './pictures/typeTrip/3.png', selected: false },
        { id: 5, src: './pictures/typeTrip/4.png', selected: false },
        { id: 6, src: './pictures/typeTrip/8.png', selected: false },
        { id: 7, src: './pictures/typeTrip/5.png', selected: false },
        { id: 8, src: './pictures/typeTrip/6.png', selected: false },
    ]);

    const [propsImages, setPropsImages] = useState([
        { id: 1, src: './pictures/importInTrip/10.png', selected: false },
        { id: 2, src: './pictures/importInTrip/11.png', selected: false },
        { id: 3, src: './pictures/importInTrip/12.png', selected: false },
        { id: 4, src: './pictures/importInTrip/13.png', selected: false },
        { id: 5, src: './pictures/importInTrip/14.png', selected: false },
        { id: 6, src: './pictures/importInTrip/15.png', selected: false },
        { id: 7, src: './pictures/importInTrip/16.png', selected: false },
        { id: 8, src: './pictures/importInTrip/17.png', selected: false },
    ]);
    //בשביל החבאה והצגת הסיסמאות עם אייקון עין
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hasDeletedPic, setHasDeletedPic] = useState(false);
    const [errorMessageForPic, setErrorMessageForPic] = useState({ display: 'none', message: '' });


    const [profilePic, setProfilePic] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        setProfilePic(dataContext.loggedUserPic)
    }, [dataContext.loggedUserPic])


    const deletePicture = () => {
        let apiEnd = `/DeleteImage/DeleteUserImage?userName=${dataContext.loggedUser.userName}`
        dataContext.DeleteImage(apiEnd)
    }

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
        firstName: "",
        email: "",
        date: "",
    });

    const [showAlertMessage, setshowAlertMessage] = useState('none');

    const renderImages = (images, typeOfImage) => (
        images.map(img => (
            <img
                key={img.id}
                onClick={() => {
                    if (typeOfImage === "types") {
                        setTypesImages(prevTypesImages =>
                            prevTypesImages.map(type =>
                                type.id === img.id ? { ...type, selected: !type.selected } : type
                            )
                        );
                    } else if (typeOfImage === "props") {
                        setPropsImages(prevPropsImages =>
                            prevPropsImages.map(prop =>
                                prop.id === img.id ? { ...prop, selected: !prop.selected } : prop
                            )
                        );
                    }
                }}
                style={{ ...optStyle, border: img.selected ? '3px solid #7c99ab' : 'none' }}
                src={img.src}
                id={img.id}
            />
        ))
    );

    useEffect(() => {
        if (dataContext.loggedUser !== "") {
            fetch(`${apiUrl}/Data/getUserDetails?userName=${dataContext.loggedUser.userName}`)
                .then(response => response.json())
                .then(data => {
                    setUser({
                        bio: data.bio,
                        userName: data.userName,
                        password: data.password,
                        confirmPassword: data.password,
                        firstName: data.firstName,
                        birthDate: data.birthDate.slice(0, 10),
                        email: data.email,
                        userPic: profilePic,
                        instagramUrl: data.instagramUrl,
                        typeID: data.typeID,
                        propID: data.propID,
                    })

                    setTypesImages(prevTypesImages =>
                        prevTypesImages.map(type =>
                            ({ ...type, selected: data.typeID.includes(type.id) })
                        )
                    );

                    setPropsImages(prevPropsImages =>
                        prevPropsImages.map(prop =>
                            ({ ...prop, selected: data.propID.includes(prop.id) })
                        )
                    );

                })
                .catch(error => console.error('Error fetching user details:', error));
        }
    }, [dataContext.loggedUser]);

    const optStyle = {
        width: "15%",
        height: "15%",
        borderRadius: '70%',
        padding: 10,
        color: "#7c99ab",
        cursor: 'pointer',
    };



    function validateInputs() {
        let valid = true;
        let newErrors = { ...errors };

        if (user.password.length < 6 || user.password === "") {
            newErrors.password = 'סיסמה חייבת להיות מורכבת מלפחות 6 תווים והיא חובה';
            valid = false;
        } else {
            newErrors.password = '';
        }

        if (user.password !== user.confirmPassword) {
            newErrors.confirmPassword = 'סיסמאות אינן תואמות!';
            valid = false;
        } else {
            newErrors.confirmPassword = '';
        }

        if (!user.birthDate) {
            newErrors.date = "נא להכניס תאריך לידה"
            valid = false;
        }
        else {
            let DateSplit = user.birthDate.split('-');
            let year = parseInt(DateSplit[0]);

            if (year > 2024) {
                newErrors.date = "שנת לידה לא תקינה"
                valid = false;
            }
            else {
                newErrors.date = '';
            }

        }

        if (!/^[\u0590-\u05FF ]+$/.test(user.firstName) || user.firstName === "") {
            newErrors.firstName = 'שם פרטי חייב להיות בעברית והוא חובה';
            valid = false;
        } else {
            newErrors.firstName = '';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) || user.email === "") {
            newErrors.email = 'sample@sample.com';
            valid = false;
        } else {
            newErrors.email = '';
        }

        setErrors(newErrors);
        return valid;
    }


    async function updateProfile() {

        if (validateInputs()) {

            if (hasDeletedPic) {
                deletePicture();
            }

            if (profilePic && user.userPic) {
                if (profilePic != user.userPic) {
                    dataContext.UploadImage(`/UploadImage/UploadUserImage?userName=${user.userName}`, user.userPic)
                }
            }

            let updatedData = {
                ...user,
                typeID: typesImages.filter(type => type.selected).map(type => type.id),
                propID: propsImages.filter(prop => prop.selected).map(prop => prop.id)
            };

            fetch(`${apiUrl}/Data/UpdateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
                .then(response => {
                    if (response.ok) {
                        const updatedUser = {
                            bio: updatedData.bio,
                            userName: updatedData.userName,
                            firstName: updatedData.firstName,
                            birthDate: updatedData.birthDate
                        };

                        localStorage.setItem("UserList", JSON.stringify(updatedUser));
                        window.location.reload();

                    } else {
                        console.error('Error updating profile:', response.statusText);
                        setshowAlertMessage('block')
                    }
                })
                .catch(error => {
                    console.error('Error updating profile:', error)
                    setshowAlertMessage('block')
                }

                );
        }
    }

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

    return (
        <div dir="rtl" style={{ fontFamily: 'inherit', textAlign: "center", color: "black", backgroundColor: '#eff8ff', padding: '20px' }}>
            <div style={{ position: 'relative', padding: 20, backgroundColor: "white", borderRadius: '10px', marginBottom: '20px' }}>
                <Link to={'/Profile'}>
                    <h4 style={{ color: 'black', textAlign: "right", position: "absolute" }}>
                        <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px" }} /> חזרה לפרופיל
                    </h4>
                </Link>
                <h2 style={{ color: "black" }}>עריכת פרופיל</h2>


                <div style={{ position: "relative" }}>
                    <img
                        src={profilePic}
                        style={{
                            cursor: 'pointer',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            marginRight: '10px'
                        }}
                        onClick={() => navigate('/Profile')}
                        alt="Profile"
                    />
                    {isInfluencer && (
                        <img
                            src="./pictures/verfaid.png"
                            alt="Iverified"
                            style={{
                                height: "27px",
                                width: "27px",
                                position: "absolute",
                                right: "47.5%",
                                top: "65%"
                            }}
                        />
                    )}

                    <div style={{
                        position: 'absolute',
                        left: -100,
                        bottom: 40,
                        transform: 'translateY(100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        zIndex: 3 // מוודא שהרכיב יהיה מעל ה-TextField
                    }}>
                        <IconButton
                            style={{
                                color: "#7c99ab",
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={toggleMenu}>
                            <EditIcon style={{ marginLeft: 5 }} />
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>ערוך תמונת פרופיל</span>
                        </IconButton>

                        {isMenuOpen && (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '10px',
                                borderRadius: '10px',
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',

                            }}>
                                <Button
                                    style={{ color: "#7c99ab", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    component="label"
                                >
                                    <CloudUploadIcon style={{ marginLeft: '10px' }} />
                                    העלאת תמונת פרופיל חדשה
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/jpg, image/jpeg"
                                        onChange={(e) => {
                                            let file = e.target.files[0];
                                            if (file.size > 2 * 1024 * 1024) { // 2MB
                                                setErrorMessageForPic({ display: 'block', message: 'נא לבחור קובץ תמונה עד 2MB' });
                                                e.target.value = null;
                                            } else {
                                                setErrorMessageForPic({ display: 'none', message: '' });
                                                let imageUrl = URL.createObjectURL(file);
                                                setHasDeletedPic(false)
                                                setProfilePic(imageUrl);
                                                setUser({ ...user, userPic: file });
                                            }
                                        }}
                                    />
                                </Button>
                                <Button
                                    style={{ color: "#7c99ab", display: 'flex', alignItems: 'center' }}
                                    onClick={() => {
                                        setHasDeletedPic(true);
                                        if (profilePic != "./pictures/defaultUserPic.png") {
                                            setProfilePic('./pictures/defaultUserPic.png');
                                        }
                                    }}
                                >
                                    <DeleteIcon style={{ marginLeft: '10px' }} />
                                    מחיקת תמונת פרופיל
                                </Button>
                            </div>
                        )}
                    </div>


                </div>  <br /><br />
                <CacheProvider value={cacheRtl}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            id="outlined-multiline-static"
                            label="ספר על עצמך"
                            value={user.bio}
                            variant="outlined"
                            style={{ width: "40%", zIndex: 1 }}
                            multiline
                            onChange={(e) => setUser({ ...user, bio: e.target.value })}
                        />

                        {errorMessageForPic.display == 'block' && (
                            <div style={{ color: 'red', display: "block", textAlign: 'center' }}>
                                <p>{errorMessageForPic.message}</p>
                            </div>
                        )}
                    </ThemeProvider>
                </CacheProvider>



            </div>


            {/*  צד ימין */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "35%", textAlign: "center" }} >
                    <div style={{ backgroundColor: '#fff', padding: 40, borderRadius: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
                                <p>עדכנו את השדות שברצונכם לשנות</p>
                                <Tooltip title="בסיום יש ללחוץ על כפתור שמירת שינויים כדי לעדכן">
                                    <IconButton>
                                        <InfoIcon fontSize="small" style={{ color: '#7c99ab' }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <CacheProvider value={cacheRtl}>
                                <ThemeProvider theme={theme}>
                                    <TextField
                                        disabled
                                        label="שם משתמש"
                                        value={user.userName}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        style={{ width: "95%", marginBottom: '10%' }}
                                    />

                                    <TextField
                                        required
                                        label="סיסמה"
                                        type={showPassword ? 'text' : 'password'}
                                        value={user.password}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                        inputProps={{
                                            maxLength: 30,
                                        }}
                                        variant="outlined"
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        style={{ width: "95%", marginBottom: '10%' }}
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

                                    <TextField
                                        required
                                        label="אימות סיסמה"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={user.confirmPassword}
                                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                                        inputProps={{
                                            maxLength: 30,
                                        }}
                                        variant="outlined"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        style={{ width: "95%", marginBottom: '10%' }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        required
                                        label="שם פרטי"
                                        value={user.firstName}
                                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                        inputProps={{
                                            maxLength: 15,
                                        }}
                                        variant="outlined"
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        style={{ width: "95%", marginBottom: '10%' }}
                                    />

                                    <TextField
                                        type="date"
                                        label="תאריך לידה"
                                        value={user.birthDate}
                                        style={{ width: "95%", marginBottom: '10%' }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{ max: '9999-12-31' }}
                                        onChange={(e) => {
                                            setUser({ ...user, birthDate: e.target.value })
                                        }}
                                        error={errors.date !== ""}
                                        helperText={errors.date}
                                    />

                                    <TextField
                                        required
                                        disabled
                                        label="כתובת מייל"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        inputProps={{
                                            maxLength: 40,
                                        }}
                                        variant="outlined"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        style={{ width: "95%", marginBottom: '10%' }}
                                    />

                                    <TextField
                                        label="קישור לאינסטגרם"
                                        value={user.instagramUrl}
                                        onChange={(e) => setUser({ ...user, instagramUrl: e.target.value })}
                                        variant="outlined"
                                        style={{ width: "95%", marginBottom: '10%' }}
                                    />
                                </ThemeProvider>
                            </CacheProvider>
                        </div>
                    </div>

                </div>

                {/*צד שמאל */}
                <div style={{ width: "60%" }}>
                    <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        <h2 style={{ fontFamily: 'inherit', fontSize: "20px", color: "black" }}>שינוי/ בחירת סוגי טיול</h2>
                        <div style={{ margin: "0 auto" }}>
                            {renderImages(typesImages, "types")}
                        </div>
                    </div>
                    <br />
                    <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        <h1 style={{ fontFamily: 'inherit', fontSize: "20px", color: "black" }}>שינוי/ בחירת תכונות חשובות בטיול</h1>
                        <div style={{ margin: "0 auto" }}>
                            {renderImages(propsImages, "props")}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <img
                    src='./pictures/edituser.png'
                    alt='Share save pic'
                    style={{ width: "15%", marginRight: '80%', marginTop: '20px' }}
                />
                <Button
                    onClick={updateProfile}
                    style={{
                        color: "white",
                        padding: "20px",
                        borderRadius: 10,
                        cursor: 'pointer',
                        backgroundColor: "#927070",
                        marginRight: '80%',
                        marginTop: "-15px"
                    }}
                >
                    שמירת שינויים בפרטי משתמש
                </Button>

                <p style={{ color: 'red', marginRight: '81%', display: showAlertMessage }}>אירעה שגיאה בעת שמירה בשרת</p>
            </div>

        </div>
    );
}