import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export default function Types(props) {

    const [dataTypes, setDataTypes] = useState([
        { typeId: 1, typeName: 'טיול מים', selected: false },
        { typeId: 2, typeName: 'הליכה', selected: false },
        { typeId: 3, typeName: 'אטרקציות', selected: false },
        { typeId: 4, typeName: 'תרבות', selected: false },
        { typeId: 5, typeName: 'מוזיאונים ותערוכות', selected: false },
        { typeId: 6, typeName: 'שטח', selected: false },
        { typeId: 7, typeName: 'אופניים', selected: false },
        { typeId: 8, typeName: 'קולינרי', selected: false }
    ]);


    useEffect(() => {
        if (props.mode === 'edit' && props.typesIds.length > 0) {
            setDataTypes((prevDataTypes) =>
                prevDataTypes.map(item => ({
                    ...item,
                    selected: props.typesIds.includes(item.typeId)
                }))
            );
        }
    }, [props.typesIds]);


    const changeButtonType = (typeID) => {
        setDataTypes((prevDataTypes) =>
            prevDataTypes.map(item =>
                item.typeId === typeID ? { ...item, selected: !item.selected }
                    : item
            )
        );

        if (props.mode == "edit") {
            props.setTripToEdit(prevTrip => ({
                ...prevTrip,
                typeID: prevTrip.typeID.includes(typeID)
                    ? prevTrip.typeID.filter(id => id !== typeID)
                    : [...prevTrip.typeID, typeID],
            }));
        }
        else {
            props.setTypesForFinalTrip(prevTypes => {
                if (prevTypes.includes(typeID))
                    return prevTypes.filter(id => id !== typeID);
                else
                    return [...prevTypes, typeID];
            });
        }

    };


    return (
        <Grid item xs={12}>
            <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>

                {props.mode === 'edit' ? 'שינוי סוג/י הטיול:' : 'בחרו את סוג/י הטיול:'}
            </h3>
            <br />
            {dataTypes.map((item) => (
                <Button
                    variant="outlined"
                    key={item.typeId}
                    value={item.typeId}
                    style={{
                        margin: 10,
                        backgroundColor: item.selected ? "#697e42" : "white",
                        color: item.selected ? "white" : "#697e42",
                        borderRadius: 10,
                        padding: 10,
                        zIndex: 1,
                        position: "relative",
                        borderColor: "#697e42",
                    }}
                    onClick={() => {
                        changeButtonType(parseInt(item.typeId));
                    }}
                >
                    {item.typeName}
                </Button>
            ))}
        </Grid>
    )
}
