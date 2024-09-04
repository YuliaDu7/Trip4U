import React, { useState } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";

const Switch = (props) => {
  const { test, children } = props;
  
  return children.find((child) => {
    return child.props.value === test;
  });
};

export default function Restaurant(props) {
  

  const [restaurant, setRestaurant] = useState({
    ...props.rest,
  });

  return (
    <div dir="rtl">
      <img src=".\pictures\restaurant .png"
            style={{height: "37px"}}/>
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "inherit",
            fontSize: 25,
            display: "inline",
            padding: 10,
          }}
        >
          {restaurant.restName}
        </h2>
        <StarIcon  style={{marginBottom:"-5px"}}/>
        <p style={{ display: "inline", padding: 10 }}>
          {restaurant.restRating}
        </p>
        <br />
        <br />
        <div style={{ fontSize: 20 }}>
          <p style={{width:"70%", margin: "0 auto"}}>{restaurant.restDescription}</p>
          <br />
          <img src=".\pictures\shekel.png" alt="shekel"/>
          <p style={{ color: "#7c99ab", display: "inline", padding: 10 }}>
            עלות ממוצעת: {restaurant.avgCost}
          </p>
          <br />
          <br />
          <WarningAmberIcon style={{ color: "#927070" ,marginBottom:"-5px"}}/>

            <Switch test={restaurant.isKosher}>
            <p style={{ display: "inline", padding: 10, color: "#927070" }} value={1}>המסעדה כשרה </p>
            <p style={{ display: "inline", padding: 10, color: "#927070" }}value={0}>המסעדה לא כשרה </p>
            <p style={{ display: "inline", padding: 10, color: "#927070" }}value={null}>לא ידוע על כשרות </p>
              
            </Switch>
           
        
          <br />
          <br />
          <RestaurantIcon />
          <br />
          <a href={restaurant.restUrl}>להזמנת מקום במסעדה</a>
        </div>
      </div>
    </div>
  );
}
