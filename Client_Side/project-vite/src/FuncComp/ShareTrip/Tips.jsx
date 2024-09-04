import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export default function Tips(props) {
  return (
    <Grid item xs={12}>
      <br />
      <br />
      <h3 style={{ color: "black", textAlign: "right", position: 'relative', right: '25%', fontSize: 19 }}>
        {props.mode === 'edit' ? 'שינוי טיפים לטיול:' : 'רשמו כמה טיפים למטיילים:'}
      </h3>

      <TextField
        required
        placeholder={props.mode === 'edit' ? "" : "טיפים למטיילים"}
        variant="outlined"
        multiline
        maxRows={4}
        style={{ width: "50%" }}

        defaultValue={props.mode === 'edit' ? props.tripToEdit.tips : ""}

        onChange={(e) => {

          if (props.mode === 'edit') {
            props.setTripToEdit({ ...props.tripToEdit, tips: e.target.value });
          } else {
            props.setTrip({ ...props.trip, tips: e.target.value });
          }

        }}
      />
    </Grid>
  )
}
