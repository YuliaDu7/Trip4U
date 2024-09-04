import React, { useState, useEffect, useContext } from 'react'
import Alert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';

import AddPlace from './AddPlace';
import AddRest from './AddRest';
import { ShareContext } from './ContextShare';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export default function PlacesAndRests(props) {

    const shareContext = useContext(ShareContext);

    //לתמוך בעברית מימין לשמאל
    const theme = createTheme({ direction: 'rtl' })
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    //בודק האם מעל 3 מקומות
    const [placeCount, setPlaceCount] = useState(0);
    //בודק האם מעל 3 מסעדות
    const [restaurantCount, setRestaurantCount] = useState(0);


    useEffect(() => {

        if (shareContext.components && shareContext.components.length > 0) {
            let placeComponents = shareContext.components.filter(component => component.type == 'place');
            let restaurantComponents = shareContext.components.filter(component => component.type == 'restaurant');

            if (placeComponents.length > 0) {
                setPlaceCount(placeComponents.length);
            }

            if (restaurantComponents.length > 0) {
                setRestaurantCount(restaurantComponents.length);
            }
        }

    }, [shareContext.components]);

    //הוספת מסעדה או מקום
    const AddComponent = (type) => {

        if (type == "place" && placeCount < 3) {
            
            shareContext.setComponents(prevComponents => [
                ...prevComponents,
                { id: prevComponents.length + 1, type }]);
            setPlaceCount(prevCount => prevCount + 1);
        }
        else if (type == "restaurant" && restaurantCount < 3) {
            shareContext.setComponents(prevComponents => [
                ...prevComponents,
                { id: prevComponents.length + 1, type }]);
            setRestaurantCount(prevCount => prevCount + 1);
        }
        else {
            setAlert({ visibility: 'visible', message: "יש לבחור עד 3 מקומות ועד 3 מסעדות" })
        }
    }


    const DeleteComponent = (type, id) => {
        shareContext.setComponents(prevComponents => {
            const newComponents = prevComponents
                .filter(component => component.id !== id)
                .map((component, index) => ({ ...component, id: index + 1 }));
            return newComponents;
        });

        if (type === 'place') {
            setPlaceCount(prevCount => prevCount - 1);
            shareContext.setPlacesForFinalTrip(prevPlaces => {
                const newPlaces = prevPlaces
                    .filter(place => place.placePlaceInTrip !== id)
                    .map((place, index) => ({ ...place, placePlaceInTrip: index + 1 }));
                return newPlaces;
            });



            // session storage
            let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
            selectionOptions = selectionOptions
                .filter(place => place.order !== id)
                .map((place, index) => ({ ...place, order: index + 1 })); 
            sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));

        } else if (type === 'restaurant') {
            setRestaurantCount(prevCount => prevCount - 1);
            shareContext.setRestsForFinalTrip(prevRests => {
                const newRests = prevRests
                    .filter(rest => rest.restPlaceInTrip !== id)
                    .map((rest, index) => ({ ...rest, restPlaceInTrip: index + 1 }));
                return newRests;
            });

            //session storage
            let selectionOptions = JSON.parse(sessionStorage.getItem('selectionOptions')) || [];
            selectionOptions = selectionOptions
                .filter(rest => rest.order !== id)
                .map((rest, index) => ({ ...rest, order: index + 1 }));
            sessionStorage.setItem('selectionOptions', JSON.stringify(selectionOptions));
        }
    };

    //כשבוחרים מקום חדש במקום מקום קיים:
    const removePlaceFromFinalTrip = (placeId) => {

        let newPlacesListTemp = shareContext.placesForFinalTrip.filter(place => place.placeId !== placeId);
        shareContext.setPlacesForFinalTrip(newPlacesListTemp);

    }

    //כשבוחרים מסעדה חדשה במקום מסעדה קיים:
    const removeRestaurantFromFinalTrip = (restaurantId) => {
        let newRestaurantsListTemp = shareContext.restsForFinalTrip.filter(restaurant => restaurant.restaurantId !== restaurantId);
        shareContext.setRestsForFinalTrip(newRestaurantsListTemp);

    }


    const funcPlacesForFinalTrip = (selectedPlace) => {
        //בודק אם המקום כבר קיים ברשימה

        if (!shareContext.placesForFinalTrip.find(item => item.placeId == selectedPlace.placeId)) {

            shareContext.setPlacesForFinalTrip([...shareContext.placesForFinalTrip, selectedPlace]);
            props.setAlert({ visibility: 'hidden', message: "" });

        } else {
            props.setAlert({ visibility: 'visible', message: "המקום כבר נמצא ברשימה" });
        }
    }

    //כשנבחרת מסעדה מהקומבו בוקס
    const funcRestsForFinalTrip = (selectedRest) => {
        //בודק אם המסעדה כבר נמצאת ברשימה
        
        if (!shareContext.restsForFinalTrip.find(item => 
            item.restaurantId == selectedRest.restaurantId 
        )) {
            
            shareContext.setRestsForFinalTrip([...shareContext.restsForFinalTrip, selectedRest]);
            props.setAlert({ visibility: 'hidden', message: "" });
        } else {
            props.setAlert({ visibility: 'visible', message: "המסעדה כבר נמצאת ברשימה" });
        }
    }




    return (


        <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }} style={{ width: '100%' }} >

            <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>

                    {/* חילוץ מהסטייט את כל המקומות והמסעדות לפי הסוג שלהם */}
                    {shareContext.components.map((item) => {
                        if (item.type == 'restaurant') {
                            return (

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} key={item.id}>
                                    {/* שליחה בפרופס */}
                                    <div style={{ width: '100%' }}>
                                        <AddRest
                                            order={item.id}
                                            dataRests={props.serverData.dataRests}
                                            DeleteComponent={DeleteComponent}
                                            funcRestsForFinalTrip={funcRestsForFinalTrip}
                                            removeRestaurantFromFinalTrip={removeRestaurantFromFinalTrip}
                                        />
                                    </div>
                                </Grid>

                            );
                        }
                        if (item.type == 'place') {
                            return (
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} key={item.id}>
                                    {/* שליחה בפרופס */}
                                    <div style={{ width: '100%' }}>
                                        <AddPlace
                                            warnings={props.serverData.dataWarnings}
                                            order={item.id}
                                            dataPlaces={props.serverData.dataPlaces}
                                            DeleteComponent={DeleteComponent}
                                            funcPlacesForFinalTrip={funcPlacesForFinalTrip}
                                            removePlaceFromFinalTrip={removePlaceFromFinalTrip}

                                        />
                                    </div>

                                </Grid>
                            );
                        }
                        return null;
                    })}

                    <Grid item xs={12} style={{ color: "black" }}>
                        <IconButton onClick={() => AddComponent("place")} style={{ marginLeft: '10px', border: '2px solid #697e42', margin: 10 }} color="primary" aria-label="add to shopping cart">
                            <AddIcon style={{ color: "#697e42" }} />
                        </IconButton>
                        <strong style={{ fontSize: 20 }}>הוסף מקום</strong>
                        <strong style={{ fontSize: 20, marginRight: "5%" }}>הוסף מסעדה</strong>
                        <IconButton onClick={() => AddComponent("restaurant")} style={{ border: '2px solid #697e42', margin: 10 }} color="primary" aria-label="add to shopping cart">
                            <AddIcon style={{ color: "#697e42" }} />
                        </IconButton>
                        <br></br>
                        <Alert style={{ margin: '0 auto', marginTop: '30px', textAlign: 'center', width: '50%', visibility: props.alert.visibility }} severity="error"> {props.alert.message} </Alert>
                    </Grid>

                </ThemeProvider>
            </CacheProvider>
        </Grid>

    )
}
