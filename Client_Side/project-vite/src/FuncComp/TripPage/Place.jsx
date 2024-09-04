import React, { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Place(props) {
  
  const [place1, setPlace1] = useState({
    ...props.place,
  });


  return (
    <div dir="rtl">
      <div style={{ textAlign: "center" }}>
      <img src=".\pictures\location.png"
            style={{height: "37px"}}/>
        <h2 style={{ fontFamily: "inherit", fontSize: 25 }}>
          {place1.placeName}
        </h2>
        <div style={{ fontSize: 20 }}>
          <p style={{ width: "70%", margin: "0 auto" }}>
            {place1.placeDescription}
          </p>
          <br />
          <AccessTimeIcon style={{ marginBottom: "-5px" }} />
          <p style={{ display: "inline", padding: 10}}>
            זמן הגעה מומלץ: {place1.recommendedTime}
          </p>
          <br />
          <img style={{marginTop:20}} src=".\pictures\shekel.png" alt="shekel" />
            {(place1.placeCost === 0 && place1.childCost === 0) ? (
              <p style={{display: "inline", padding: 10, color: "#7c99ab" }}>
                הכניסה חינם
              </p>
            ) : (
              <>
                <p style={{ display: "inline", padding: 10, color: "#7c99ab" }}>
                  עלות לאדם: {place1.placeCost}
                </p>
                <p style={{ display: "inline", padding: 10, color: "#7c99ab" }}>
                  עלות לילד: {place1.childCost}
                </p>
              </>
            )}
          <div style={{ display: "inline", padding: 10, color: "#927070" }}>
            {place1.warnDescription && place1.warnDescription.length > 0 ? (
              <>
                {place1.warnDescription.map((description, index) => (
                  <p key={index}> <WarningAmberIcon style={{marginLeft:8, color: "#927070", marginBottom: "-5px" }} />{description}</p>
                ))}
                <span style={{fontSize: 15, color: "#927070", fontWeight: "bold" }}>
                  * אזהרות ניתנו בתאריך {formatDate(place1.receiveDate)}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}


function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
}