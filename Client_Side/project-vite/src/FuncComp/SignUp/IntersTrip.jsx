import React, { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function IntersTrip(props) {
  // טעינה מהסשן סטורג'
  const sessionData = () => {
    const savedVisibility = JSON.parse(sessionStorage.getItem('selectedProps')) || [];
    let visibilityState = {};
    for (let i = 1; i <= 8; i++) {
      visibilityState[i] = savedVisibility.includes(i.toString());
    }
    return visibilityState;
  };

  const [visible, setVisible] = useState(sessionData);
  const [selectedIds, setSelectedIds] = useState(JSON.parse(sessionStorage.getItem('selectedProps')) || []);

  useEffect(() => {
    sessionStorage.setItem('selectedProps', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const optStyle = {
    width: "13%",
    height: "13%",
    borderRadius: '70%',
    padding: 15
  };

  function BackComp() {
    props.send2ParentBack("prop");
  }

  function setProps(id) {
    setVisible((prevVisible) => ({ ...prevVisible, [id]: !prevVisible[id] }));

    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id) ? prevSelectedIds.filter((itemId) => itemId !== id) : [...prevSelectedIds, id]
    );
  }

  return (
    <div dir="rtl" style={{ textAlign: 'center', color: '#7c99ab', height: "80%", width: "100%" }}>
      <p onClick={BackComp} style={{ textAlign: "right", position: "fixed", top: 13 }}>
        <ArrowForwardIcon style={{ paddingRight: 40, marginBottom: "-14px", height: "10%", width: "10%" }} /> חזרה
      </p>
      <br />
      <h1 style={{ fontFamily: 'inherit', fontSize: "40px" }}>מה חשוב לך בטיול?</h1>
      <div style={{ margin: "0 auto" }}>
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[1] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/10.png"
          id="1"
        />
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[2] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/11.png"
          id="2"
        />
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[3] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/12.png"
          id="3"
        />
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[4] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/13.png"
          id="4"
        />
      </div>
      <div style={{ margin: "0 auto" }}>
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[5] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/14.png"
          id="5"
        />
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[6] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/15.png"
          id="6"
        />
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[7] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/16.png"
          id="7"
        />
        <img
          onClick={(e) => setProps(e.target.id)}
          style={{ ...optStyle, border: visible[8] ? '5px solid' : 'none' }}
          src="./pictures/importInTrip/17.png"
          id="8"
        />
      </div>

      <img
        style={{
          width: "10%",
          height: "10%",
          display: 'inline',
        }}
        src="./pictures/importInTrip/18.png"
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
            position: "relative",
            bottom: "30px",
            fontSize: "20px"
          }}
          variant="contained"
          onClick={() => props.send2ParentProps(selectedIds)}
        >
          שמירה
        </button>
      </div>
    </div>
  );
}
