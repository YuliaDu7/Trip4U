import React, { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LikesTrip(props) {

  const sessionData = () => {
    const savedVisibility = JSON.parse(sessionStorage.getItem('selectedIds')) || [];
    let visibilityState = {};
    for (let i = 1; i <= 8; i++) {
      visibilityState[i] = savedVisibility.includes(i.toString());
    }
    return visibilityState;
  };

  const [visible, setVisible] = useState(sessionData);
  const [selectedIds, setSelectedIds] = useState(JSON.parse(sessionStorage.getItem('selectedIds')) || []);

  useEffect(() => {
    sessionStorage.setItem('selectedIds', JSON.stringify(selectedIds));
  }, [selectedIds]);

  function BackComp() {
    props.send2ParentBack("type");
  }

  function setTypes(id) {
    setVisible((prevVisible) => ({ ...prevVisible, [id]: !prevVisible[id] }));

    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((itemId) => itemId !== id)
        : [...prevSelectedIds, id]
    );
  }

  const optStyle = {
    width: "13%",
    height: "13%",
    borderRadius: '70%',
    padding: 15
  };

  return (
    <div dir="rtl" style={{ textAlign: 'center', color: '#7c99ab', height: "80%", width: "100%" }}>
      <p onClick={BackComp} style={{ textAlign: "right", position: "fixed", top: 13 }}>
        <ArrowForwardIcon style={{ paddingRight: 40, marginBottom: "-14px", height: "10%", width: "10%" }} /> חזרה
      </p>
      <br />
      <h1 style={{ fontFamily: 'inherit', fontSize: "40px" }}> איזה סוגי טיול אתה אוהב?</h1>
      <div style={{ margin: "0 auto" }}>
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[1] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/1.png"
          id="1"
        />
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[2] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/7.png"
          id="2"
        />
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[3] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/2.png"
          id="3"
        />
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[4] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/3.png"
          id="4"
        />
      </div>
      <div style={{ margin: "0 auto" }}>
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[5] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/4.png"
          id="5"
        />
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[6] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/8.png"
          id="6"
        />
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[7] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/5.png"
          id="7"
        />
        <img
          onClick={(e) => setTypes(e.target.id)}
          style={{ ...optStyle, border: visible[8] ? '5px solid' : 'none' }}
          src="./pictures/typeTrip/6.png"
          id="8"
        />
      </div>
      <img
        style={{
          width: "10%",
          height: "10%",
          display: 'inline',
        }}
        src="./pictures/typeTrip/9.png"
      />
      <div style={{ margin: "0 auto" }}>
        <button
          style={{
            backgroundColor: '#7c99ab',
            color: 'white',
            width: "30%",
            display: 'inline',
            padding: 15,
            borderRadius: 10,
            fontSize: 17,
            position: "relative",
            bottom: "30px",
           
          }}
          variant="contained"
          onClick={() => props.send2ParentType(selectedIds)}
        >
          המשך
        </button>
      </div>
    </div>
  );
}
