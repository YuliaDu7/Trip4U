import React, { useState, useEffect, useContext } from "react";
import Checkbox from "@mui/material/Checkbox";
import Button from '@mui/material/Button';
import { DataContext } from "../ContextProvider";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";

export default function SearchTrip(props) {
  const dataContext = useContext(DataContext)
  const apiUrl = dataContext.apiUrl;
  const navigate = useNavigate();

  const [type, setType] = useState({
    1: { text: "טיולי מים", selected: false },
    2: { text: "הליכה", selected: false },
    3: { text: "אטרקציות", selected: false },
    4: { text: "תרבות", selected: false },
    5: { text: "מוזיאונים ותערוכות", selected: false },
    6: { text: "שטח", selected: false },
    7: { text: "אופניים", selected: false },
    8: { text: "קולינרי", selected: false },
  });

  function changeButtonType(index) {
    setType((prevType) => {
      const newType = { ...prevType };
      newType[index].selected = !newType[index].selected;
      return newType;
    });

    setSelectedSearch((prevSearch) => {
      const newTypeId = [...prevSearch.typeId];
      if (newTypeId.includes(index)) {
        return {
          ...prevSearch,
          typeId: newTypeId.filter((id) => id !== index),
        };
      } else {
        return {
          ...prevSearch,
          typeId: [...newTypeId, index],
        };
      }
    });
  }

  const [checkboxState, setCheckboxState] = useState({
    checkedFriday: false,
    checkedDog: false,
    checkedCouples: false,
    checkedFamilies: false,
    checkedAccessibility: false,
    checkedFreeEntry: false,
    checkedIncludesRoute: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const [selectedRouteDifficulty, setSelectedRouteDifficulty] = useState("");

  const [selectedRegion, setSelectedRegion] = useState(null);
  const toggleBorder = (region) => {
    setSelectedRegion(selectedRegion === region ? null : region);
  };

  const [seasonSelect, setSeasonSelect] = useState(null);

  const changeSeasonSelect = (seasonLetter) => {
    if (seasonSelect === seasonLetter) {
      setSeasonSelect(null);
    } else {
      setSeasonSelect(seasonLetter);
    }
  }

  useEffect(() => {
    setSelectedSearch((prevSearch) => ({
      ...prevSearch,
      season: seasonSelect,
    }));
  }, [seasonSelect]);


  const [selectedSearch, setSelectedSearch] = useState({
    typeId: [],
    propertyId: [],
    area: null,
    season: null,
    routeDifficulty: null,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSelectedSearch((prevSearch) => ({
      ...prevSearch,
      area: selectedRegion,
    }));
  }, [selectedRegion]);

  useEffect(() => {
    const properties = [];
    if (checkboxState.checkedFriday) properties.push(6);
    if (checkboxState.checkedDog) properties.push(7);
    if (checkboxState.checkedCouples) properties.push(1);
    if (checkboxState.checkedFamilies) properties.push(8);
    if (checkboxState.checkedAccessibility) properties.push(5);
    if (checkboxState.checkedFreeEntry) properties.push(4);
    if (selectedRouteDifficulty === "easy") properties.push(3);
    if (selectedRouteDifficulty === "hard") properties.push(2);
    //לא לשנות את המספרים, זה מספרים מהשרת

    setSelectedSearch((prevSearch) => ({
      ...prevSearch,
      propertyId: properties,
    }));
  }, [checkboxState, selectedRouteDifficulty]);

  useEffect(() => {
    if (!checkboxState.checkedIncludesRoute) {
      setSelectedRouteDifficulty("");
    }
  }, [checkboxState.checkedIncludesRoute]);

  function SearchTrip() {
    const hasSelection =
      selectedSearch.typeId.length > 0 ||
      selectedSearch.propertyId.length > 0 ||
      selectedSearch.area !== null ||
      selectedSearch.season !== null;

    if (!hasSelection) {
      setErrorMessage("נא לבחור לפחות אופציה אחת.");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
      return;
    }

    setErrorMessage("");
    let url = apiUrl + "/Search/Search";
    let jsonString = JSON.stringify(selectedSearch);
    let options = {
      method: "POST",
      body: jsonString,
      headers: new Headers({
        "Content-Type": "application/json;",
      }),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.length == 0) {
          setErrorMessage("לא נמצאו תוצאות מתאימות ");
          window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        } else {
          props.send2ParentsOptions(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div
        dir="rtl"
        style={{ textAlign: "center",  color: "#697e42",  fontFamily: "inherit", minHeight: "100vh",    display: "flex", flexDirection: "column",  justifyContent: "space-between",   }} >
              <p onClick={() => navigate(-1)} style={{ marginTop: "55px", cursor: "pointer", textAlign: "right", position: "absolute", top: "10%", marginRight: 50 }}> <ArrowForwardIcon style={{ paddingLeft: 10, marginBottom: "-6px", marginRight: 50 }} />בחזרה לעמוד הקודם  </p>

        <div>
          <br />
          <h1 style={{ fontFamily: "inherit", fontSize: "50px" }}>חיפוש טיול</h1>

          {errorMessage && (
            <div id="errorMess" style={{ color: "#927070" }}>
              <h3>{errorMessage}</h3>
            </div>
          )}
          <div style={{ display: "inline-flex", fontSize:20 }}>
            <div
              onClick={() => toggleBorder("N")}
              style={{ textAlign: "center",  padding: "10px", border: selectedRegion === "N" ? "2px solid" : "none", borderRadius: 10,  marginLeft:'-10px'    }} >
              <img style={{marginTop:'10px', cursor: 'pointer', width: 160, height: 140 }} src="./pictures/northIsrael.png" alt="North Israel" />
              <p>צפון</p>
            </div>
            <div
              onClick={() => toggleBorder("C")}
              style={{
                textAlign: "center",
                padding: "10px",
                border: selectedRegion === "C" ? "2px solid" : "none",
                borderRadius: 10,
              }}
            >
              <img style={{ cursor: 'pointer', width: 150, height: 150 }} src="./pictures/middleIsrael.png" alt="Middle Israel" />
              <p>מרכז</p>
            </div>
            <div
              onClick={() => toggleBorder("S")}
              style={{
                textAlign: "center",
                padding: "10px",
                border: selectedRegion === "S" ? "2px solid" : "none",
                borderRadius: 10,
              }}
            >
              <img style={{ cursor: 'pointer', width: 120, height: 150 }} src="./pictures/southIsrael2.png" alt="South Israel" />
              <p>דרום</p>
            </div>
          </div>
          <br />
          <br />
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <h3 style={{fontSize:22}}>בחרו עונה:</h3>
            {[
              { value: 'ק', label: 'קיץ', icon: "sun"},
              { value: 'א', label: 'אביב', icon: "flower" },
              { value: 'ס', label: 'סתיו', icon: "fall" },
              { value: 'ח', label: 'חורף', icon: "umbrella" }
            ].map((season) => (
              <Button
                key={season.value}
                value={season.value}
                onClick={() => {
                  changeSeasonSelect(season.value);
                }}
                style={{ marginRight: 35,
                  backgroundColor: seasonSelect === season.value ? "#697e42" : "white",
                  color: seasonSelect === season.value ? "white" : "#697e42",
                  borderRadius: 10,  fontSize: 20,padding: "8px 40px", zIndex: 1,  position: "relative", }}
              >
                <span style={{ marginLeft: 20 }}>{season.label}</span> <img style={{height:40}} src={`./pictures/${season.icon}${seasonSelect == season.value ? "_white" : ""}.png`}/>
              </Button>
            ))}
          </div>
          <br />
          <br />
          <div>
            <h3 style={{fontSize:22}}>איזה סוג/י טיול?</h3>
            {Object.keys(type).map((key) => (
              <Button
                style={{
                  borderColor: "#697e42",
                  margin: 10,
                  backgroundColor: type[key].selected ? "#697e42" : "white",
                  color: type[key].selected ? "white" : "#697e42",
                  border: type[key].selected === 'hard' ? 'none' : '1px solid #697e42',
                  fontSize:18,  borderRadius: 10,padding: 10,  zIndex: 1,  position: "relative",  }}
                key={key}
                onClick={() => {
                  changeButtonType(parseInt(key));
                }}
              >
                {type[key].text}
              </Button>
            ))}
          </div>
          <br />
          <div
            style={{
              display: "grid",
              justifyItems: "start",
              gap: "10px",
              paddingRight: "30%",
            }}
          >
            {[
              { label: "טיול שפתוח בשבת?", name: "checkedFriday" },
              { label: "האם הטיול עם כלב?", name: "checkedDog" },
              { label: "מתאים לזוגות?", name: "checkedCouples" },
              { label: "מתאים למשפחות?", name: "checkedFamilies" },
              { label: "נגישות", name: "checkedAccessibility" },
              { label: "כניסה בחינם", name: "checkedFreeEntry" },
              { label: "כולל מסלול?", name: "checkedIncludesRoute" },
            ].map((checkbox) => (
              <div key={checkbox.name} style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{checkbox.label}</h3>

                <Checkbox
                  style={{ color: "#697e42", position: "absolute", right: "45%" }}
                  checked={checkboxState[checkbox.name]}
                  onChange={handleCheckboxChange}
                  name={checkbox.name}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </div>
            ))}
          </div>
          {checkboxState.checkedIncludesRoute && (
            <div>
              <h3>בחרו קושי מסלול</h3>
              <Button
                style={{
                  borderColor: "#697e42",
                  margin: 10,
                  backgroundColor: selectedRouteDifficulty === "easy" ? "#697e42" : "white",
                  color: selectedRouteDifficulty === "easy" ? "white" : "#697e42",
                  border: selectedRouteDifficulty === 'easy' ? 'none' : '1px solid #697e42',
                  borderRadius: 10,
                  padding: 10,
                  zIndex: 1, 
                  position: "relative",
                }}
                onClick={() => setSelectedRouteDifficulty("easy")}
              >
                מסלול קל
              </Button>
              <Button
                style={{
                  borderColor: "#697e42",
                  margin: 10,
                  backgroundColor: selectedRouteDifficulty === "hard" ? "#697e42" : "white",
                  color: selectedRouteDifficulty === "hard" ? "white" : "#697e42",
                  border: selectedRouteDifficulty === 'hard' ? 'none' : '1px solid #697e42',
                  borderRadius: 10,
                  padding: 10,
                  zIndex: 1, 
                  position: "relative",
                }}
                onClick={() => setSelectedRouteDifficulty("hard")}
              >
                מסלול קשה
              </Button>
            </div>
          )}
        </div>

        <br />
        <div style={{ textAlign: "left", marginLeft: 150, marginTop: "-115px" }}>
          <img style={{ width: 150, height: 150 }} src="./pictures/Img1.png" alt="Description" />
          <br />
          <Button
            style={{
              backgroundColor: "#927070",
              color: "white",
              width: 250,
              padding: 20,
              borderRadius: 10,
              fontSize: 17,
              marginTop: "-8px",

            }}
            onClick={SearchTrip}
          >
            צאו לדרך
          </Button>
        </div>
      </div>
    </>
  );
}
