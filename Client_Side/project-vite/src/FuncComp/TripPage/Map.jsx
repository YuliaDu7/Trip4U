import React, { useState, useEffect,  useRef } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    MarkerClusterer,
    DirectionsRenderer
} from "@react-google-maps/api";
import { Button } from "@mui/material";

export default function Map(props) {
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [directions, setDirections] = useState(null);
    const [travelMode, setTravelMode] = useState('DRIVING');
    const directionsPanelRef = useRef(null);
    const [directionsLoaded, setDirectionsLoaded] = useState(false);

    useEffect(() => {
        if (props.location && props.location.length > 0) {
            setMarkers(props.location);
            
            const firstPlace = changeURLtoPoint(props.location[0].url);
            
            if (firstPlace) { 
                setCenter(firstPlace);
                calculateRoute(props.location);
            }
        }
    }, [props.location, travelMode]);

    useEffect(() => {
        if (directions && directionsPanelRef.current) {
            setDirectionsLoaded(true);
        }
    }, [directions]);

    const changeURLtoPoint = (url) => {
        const test = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const matches = url.match(test);
        if (matches) {
            const latitude = parseFloat(matches[1]);
            const longitude = parseFloat(matches[2]);
            return { lat: latitude, lng: longitude };
        } else {
            return null;
        }
    };

    const calculateRoute = (locations) => {
        const waypoints = locations.slice(1, -1).map(location => ({
            location: changeURLtoPoint(location.url),
            stopover: true
        }));

        const origin = changeURLtoPoint(locations[0].url);
        const destination = changeURLtoPoint(locations[locations.length - 1].url);

        if (origin && destination) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    travelMode: window.google.maps.TravelMode[travelMode],
                    region: "IL",  // אזור ישראל
                    language: "he"  // שפה עברית
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
            
        }
    };
 
    const mapStyles = {
        height: "45vh",
        width: "100%",
        margin: "0 auto"
    };

    const clusterOptions = {
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    };

    const printDirections = () => {
        if (directions) {
            const printWindow = window.open("", "PrintWindow", "width=600,height=400");
            printWindow.document.write("<html><head><title>Print Directions</title></head><body>");
            printWindow.document.write("<h1>הנחיות מסלול הטיול</h1>");
            printWindow.document.write(directionsPanelRef.current.innerHTML);
            printWindow.document.write("</body></html>");
            printWindow.document.close();
            printWindow.print();
        }else {
            alert("Directions are not loaded yet.");
        }
    }; 
    
    return (
        <div style={{ boxSizing: "border-box", display: "inline-table", width: props.width, height: "50%", margin: "0 auto", direction: "rtl" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <label>
                   <span style={{color:"black"}}> איך תרצו לעבור בין המיקומים?  </span>
                    <select style={{cursor:"pointer",margin:10, border: "1px solid #697e42", borderRadius:7, padding:5,backgroundColor:"white",color:"black"}} value={travelMode} onChange={(e) => setTravelMode(e.target.value)}>
                        <option value="DRIVING"> בנסיעה ברכב</option>
                        <option value="WALKING">בהליכה ברגל</option>
                        <option value="BICYCLING">ברכיבה על אופניים</option>
                        <option value="TRANSIT">בתחבורה ציבורית</option>
                    </select>
                </label>
            </div>
           
            {center && (
                <GoogleMap mapContainerStyle={mapStyles} zoom={9} center={center}>
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{ suppressMarkers: true }}
                            panel={directionsPanelRef.current}
                        />
                    )}

                    <MarkerClusterer options={clusterOptions}>
                        {(clusterer) =>
                            markers.map((marker, index) => {
                                const coordinates = changeURLtoPoint(marker.url);

                                if (!coordinates) return null;
                                
                                // הגדרת אייקון שונה לכל סוג מקום
                                const iconUrl = marker.type === "restaurant" 
                                ? "https://cdn-icons-png.flaticon.com/512/3448/3448653.png"
                                : "https://upload.wikimedia.org/wikipedia/commons/9/9e/Pin-location.png";
 
                                return (
                                    <Marker
                                        key={index}
                                        position={coordinates}
                                        clusterer={clusterer}
                                        onClick={() => setSelectedMarker(marker)}
                                        
                                         icon={{
                                            url: iconUrl,
                                            scaledSize: new window.google.maps.Size(38, 38)
                                        }} 
                                    />
                                );
                            })
                        }
                    </MarkerClusterer>
                    {selectedMarker && (
                        <InfoWindow
                            position={changeURLtoPoint(selectedMarker.url)}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div style={{ textAlign: "center" }}>
                                <h2 style={{ paddingLeft: 10 }}>{selectedMarker.name}</h2>
                                <img
                                    src="https://rankmyapp.com/wp-content/uploads/2018/03/interna-blog-app-icon-rankmyapp.jpg"
                                    alt=""
                                    style={{ width: 50, height: 33, borderRadius: 10, marginBottom: "-5px", display: "block", margin: "0 auto" }}
                                    onClick={() => {
                                        const coordinates = changeURLtoPoint(selectedMarker.url);
                                        window.open(`https://www.waze.com/he/live-map/directions?navigate=yes&to=ll.${coordinates.lat}%2C${coordinates.lng}`, "_blank");
                                    }}
                                />
                                <p style={{ textAlign: "center" }}>{selectedMarker.description}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap> 
            )}
            <br />
            <Button onClick={printDirections} style={{ 
                marginBottom: "10px",
                backgroundColor: "#7C99AB",color: "white",
                width: 100,
                padding: 2,
                borderRadius: 10,
                fontSize: 17,
                cursor:"pointer",
             }}>הדפס מסלול</Button> 
           <div ref={directionsPanelRef} style={{ display: "none" }}></div> 
        </div>
    );
}
