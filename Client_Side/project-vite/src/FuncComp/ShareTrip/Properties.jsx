import React, { useState , useEffect} from 'react';
import { Box, Grid, FormControlLabel, Checkbox, Typography } from '@mui/material';

export default function Properties(props) {

    const [dataProps, setDataProps] = useState([
        { propertyId: 1, propDescription: 'מתאים לזוגות', checked: false },
        { propertyId: 2, propDescription: 'מסלול קשה', checked: false },
        { propertyId: 3, propDescription: 'מסלול קל', checked: false },
        { propertyId: 4, propDescription: 'כניסה בחינם', checked: false },
        { propertyId: 5, propDescription: 'יש נגישות', checked: false },
        { propertyId: 6, propDescription: 'פתוח בשבת', checked: false },
        { propertyId: 7, propDescription: 'מתאים לכלב', checked: false },
        { propertyId: 8, propDescription: 'מתאים למשפחות', checked: false }
    ]);



    useEffect(() => {
        if (props.mode === 'edit' && props.propsIds.length > 0) {
            setDataProps((prevDataProps) =>
                prevDataProps.map(item => ({
                    ...item,
                    checked: props.propsIds.includes(item.propertyId)
                }))
            );
        }
    }, [props.propsIds]);


    const handleCheckboxChange = (e) => {
        let propertyId = parseInt(e.target.value);
        let isChecked = e.target.checked;

        if (props.mode == "edit") {
            props.setTripToEdit(prevTrip => {

                if (isChecked) {
                    
                    return ({
                        ...prevTrip,
                        propID: [...prevTrip.propID, propertyId],
                    });

                } else {
        
                    return ({
                        ...prevTrip,
                        propID: prevTrip.propID.filter((id) => id !== propertyId),
                    });
                }

            })
            setDataProps((prevDataProps) =>
                prevDataProps.map((prop) => ({
                    ...prop,
                    checked: prop.propertyId === propertyId ? isChecked : prop.checked,
                }))
            );


        } else {
            props.setPropsForFinalTrip((prevProps) => {
                if (isChecked) {
                    return [...prevProps, propertyId];
                } else {
                    return prevProps.filter((id) => id !== propertyId);
                }
            });
        }

    };

    return (
        <Grid item xs={12}>
            <Typography variant="p" gutterBottom>
                <br />
                <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>
                    {props.mode == "edit" ? "מאפייני הטיול" : "כיצד הייתם מאפיינים את הטיול?"}
                </h3>
                <br />
            </Typography>
            <Box sx={{
                flexDirection: 'column',
                padding: 0,
                margin: '0 auto',
                width: '55%'
            }}>
                <Grid container spacing={2}>
                    {dataProps.map((property) => (
                        <Grid item xs={3} key={property.propertyId}>
                            <FormControlLabel
                                style={{ width: '55%' }}
                                control={<Checkbox
                                    style={{ color: "#697e42" }}
                                    value={property.propertyId}
                                    onChange={handleCheckboxChange}
                                    checked={props.mode=="edit"? property.checked : props.propsForFinalTrip.includes(property.propertyId)}
                                />}
                                label={property.propDescription}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Grid>
    )
}
