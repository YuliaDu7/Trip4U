import React, { useState, useEffect } from 'react'
import { Alert, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PlacesAndRests from './PlacesAndRests';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function FormPart2(props) {
    //  - קוד שצריך לכפתור העלאת תמונה
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

    const [errorMessage, setErrorMessage] = useState({
        display: 'none', message: ''
    })


    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={2} >

                {/* תמונות */}
                <Grid item xs={12} mb={5} >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h3 style={{ marginBottom: 5, color: "black", textAlign: "center", fontSize: 19 }}>שתפו בתמונות מהטיול</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ marginTop: 0, marginBottom: 0 }}>לאחר בחירת תמונה מרכזית, תיפתח האופציה לבחור תמונות נוספות</p>
                        <Tooltip title="2MB גודל מירבי לתמונה הוא">
                            <IconButton>
                                <InfoIcon fontSize="small" style={{ marginLeft: 8 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    {/* דיב של 3 כפתורי תמונות */}
                    <div>

                        <div style={{ marginTop: '30px', margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }} dir='rtl'>
                            <div style={{ textAlign: 'center', marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button
                                    style={{
                                        justifyContent: 'center',
                                        gap: '10px',
                                        backgroundColor: '#fff',
                                        color: '#737373',
                                        width: 200
                                    }}
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon style={{ color: '#737373' }} />}
                                >
                                    שתפו בתמונה מרכזית
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/jpg, image/jpeg"
                                        onChange={(e) => {
                                            if (e.target.files[0].size > 2 * 1024 * 1024) {
                                                setErrorMessage({ display: 'inline-flex', message: 'נא לבחור קובץ עד 2MB' });
                                                e.target.value = null;
                                            }
                                            else {
                                                setErrorMessage({ display: 'none', message: '' });
                                                props.setImages(prev => ({ ...prev, main: e.target.files[0] }))

                                            }
                                        }}
                                    />
                                </Button>
                                {props.images.main && <div style={{ color: 'green' }}>תמונה נבחרה</div>}
                            </div>

                            {props.images.main && (
                                <div style={{ textAlign: 'center', margin: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Button
                                        style={{
                                            justifyContent: 'center',
                                            gap: '10px',
                                            backgroundColor: '#fff',
                                            color: '#737373',
                                            width: 200
                                        }}
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon style={{ color: '#737373' }} />}
                                    >
                                        שתפו בתמונה נוספת
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/jpg, image/jpeg"
                                            onChange={(e) => {
                                                if (e.target.files[0].size > 2 * 1024 * 1024) {
                                                    setErrorMessage({ display: 'inline-flex', message: 'נא לבחור קובץ עד 2MB' });
                                                    e.target.value = null;
                                                }
                                                else {
                                                    setErrorMessage({ display: 'none', message: '' });
                                                    props.setImages(prev => ({ ...prev, img1: e.target.files[0] }))
                                                }

                                            }}
                                        />
                                    </Button>
                                    {props.images.img1 && <div style={{ color: 'green' }}>תמונה נבחרה</div>}
                                </div>
                            )}

                            {props.images.img1 && (
                                <div style={{ textAlign: 'center', marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Button
                                        style={{
                                            justifyContent: 'center',
                                            gap: '10px',
                                            backgroundColor: '#fff',
                                            color: '#737373',
                                            width: 200
                                        }}
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon style={{ color: '#737373' }} />}
                                    >
                                        שתפו בתמונה נוספת
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/jpg, image/jpeg"
                                            onChange={(e) => {
                                                if (e.target.files[0].size > 2 * 1024 * 1024) {
                                                    setErrorMessage({ display: 'inline-flex', message: 'נא לבחור קובץ עד 2MB' });
                                                    e.target.value = null;
                                                } else {
                                                    setErrorMessage({ display: 'none', message: '' });
                                                    props.setImages(prev => ({ ...prev, img2: e.target.files[0] }))
                                                }

                                            }}
                                        />
                                    </Button>
                                    {props.images.img2 && <div style={{ color: 'green' }}>תמונה נבחרה</div>}
                                </div>
                            )}
                        </div>
                    </div>
                    <Alert style={{ margin: '0 auto', textAlign: 'center', width: '50%', display: errorMessage.display }} severity="error">
                        {errorMessage.message}
                    </Alert>
                </Grid>

                {/* קומפוננטה להוספת מקום ומסעדה*/}
                <PlacesAndRests
                    apiUrl={props.apiUrl}
                    serverData={props.serverData}
                    setAlert={props.setAlert}
                    alert={props.alert}

                />

            </Grid>

        </>
    )
}
