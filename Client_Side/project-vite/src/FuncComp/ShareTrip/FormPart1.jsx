import React, { useState, useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { ButtonGroup } from '@mui/material';
import { ShareContext } from './ContextShare';


export default function FormPart1(props) {

    const shareContext = useContext(ShareContext);

    return (
        <div>
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
                {/* Trip Title */}
                <Grid item xs={12}>
                    <TextField
                        required
                        inputProps={{ maxLength: 40 }}
                        placeholder='כותרת הטיול - שדה חובה*'
                        variant="outlined"
                        style={{ width: "50%" }}
                        onChange={(e) => {
                            shareContext.setTrip({ ...shareContext.trip, tripTitle: e.target.value })
                            props.setError({ ...props.errors, title: "" })
                        }}
                        error={props.errors.title !== ""}
                        helperText={props.errors.title}
                        value={shareContext.trip.tripTitle || ""}
                    />
                </Grid>

                {/* Area Selection */}
                <Grid item xs={12}>
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>באיזה חלק של הארץ?</h3>
                    <ButtonGroup
                        style={{
                            border: props.errors.area != "" ? '1px solid #D32F2F' : 'none',
                            borderRadius: '4px',
                            padding: '8px 20px 8px 50px',
                            maxWidth: '100%',
                            margin: '0 auto',
                        }}
                    >
                        {['N', 'C', 'S'].map((value) => (
                            <Button
                                key={value}
                                value={value}
                                onClick={() => {
                                    props.changeAreaSelect(value)
                                    props.setError({ ...props.errors, area: "" })
                                }}
                                style={{
                                    marginRight: 35,
                                    backgroundColor: props.areaSelect === value ? "#697e42" : "white",
                                    color: props.areaSelect === value ? "white" : "#697e42",
                                    border: props.areaSelect === value ? 'none' : '1px solid #697e42',
                                    borderRadius: 10,
                                    padding: "8px 40px",
                                    zIndex: 1,
                                    position: "relative",
                                }}
                            >
                                {value === 'N' ? 'צפון' : value === 'C' ? 'מרכז' : 'דרום'}
                            </Button>
                        ))}
                    </ButtonGroup>
                    {props.errors.area != "" && (
                        <div style={{ color: '#D32F2F', marginTop: '8px', fontSize: '13px', marginRight: '350px' }}>
                            {props.errors.area}
                        </div>
                    )}
                </Grid>

                {/* Trip Description */}
                <Grid item xs={12}>
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>שתפו בתיאור כללי של הטיול</h3>
                    <TextField
                        required
                        placeholder=' תיאור כללי - שדה חובה* '
                        variant="outlined"
                        multiline
                        maxRows={4}
                        style={{ width: "50%" }}
                        onChange={(e) => {
                            shareContext.setTrip({ ...shareContext.trip, tripDescription: e.target.value })
                            props.setError({ ...props.errors, description: "" })
                        }}
                        error={props.errors.description !== ""}
                        helperText={props.errors.description}
                        value={shareContext.trip.tripDescription || ""}
                    />
                </Grid>

                <br /><br /><br /><br /><br />
                {/* כפתורי עונה מועדפת */}
                <Grid item xs={12}>
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>עונה מומלצת לטיול</h3>
                    <div>
                        {[
                            { value: 'ק', label: 'קיץ', icon: "sun" },
                            { value: 'א', label: 'אביב', icon: "flower" },
                            { value: 'ס', label: 'סתיו', icon: "fall" },
                            { value: 'ח', label: 'חורף', icon: "umbrella" }
                        ].map((season) => (
                            <Button
                                key={season.value}
                                value={season.value}
                                onClick={(e) => {
                                    props.changeSeasonSelect(season.value);
                                }}
                                style={{
                                    marginRight: 10,
                                    backgroundColor: props.seasonSelect === season.value ? "#697e42" : "white",
                                    color: props.seasonSelect === season.value ? "white" : "#697e42",
                                    /*  border: props.seasonSelect === season.value ? 'none' : '1px solid #697e42',*/                                    borderRadius: 10,
                                    padding: "8px 20px",
                                    fontSize: 17,
                                    zIndex: 1,
                                    position: "relative",
                                }}
                            >
                                <span style={{ marginLeft: 10 }}>{season.label}</span> <img style={{ height: 30 }} src={`./pictures/${season.icon}${props.seasonSelect == season.value ? "_white" : ""}.png`} />
                            </Button>
                        ))}
                    </div>
                </Grid>

                <br /><br /><br /><br /><br />
                {/* Trip Date */}
                <Grid item xs={12}>
                    <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>מתי היה הטיול?</h3>
                    <TextField
                        type="date"
                        sx={{ width: 220 }}
                        style={{ width: "20%", color:"black" }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ max: '9999-12-31' }}
                        error={props.errors.date !== ""}
                        helperText={props.errors.date}
                        onChange={(e) => {
                            shareContext.setTrip({ ...shareContext.trip, tripDate: e.target.value })
                            props.setError({ ...props.errors, date: "" })
                        }}
                        value={shareContext.trip.tripDate || "" }
                    />
                </Grid>
            </Grid>
        </div>
    )
}
