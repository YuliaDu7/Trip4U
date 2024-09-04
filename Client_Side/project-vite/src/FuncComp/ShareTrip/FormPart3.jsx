import React, { useState, useEffect, useContext } from 'react'
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';

import Tips from './Tips';
import Tags from './Tags';
import Properties from './Properties';
import Types from './Types';
import { ShareContext } from './ContextShare';


export default function FormPart3(props) {

  const shareContext = useContext(ShareContext);


  return (
    <>

      {/* קומפוננטה להוספת סוגים */}
      <Types
        setTypesForFinalTrip={shareContext.setTypesForFinalTrip}
        typesForFinalTrip={shareContext.typesForFinalTrip}
      />

      {/* קומפוננטה להוספת מאפיינים*/}
      <Properties
        setPropsForFinalTrip={shareContext.setPropsForFinalTrip}
        propsForFinalTrip={shareContext.propsForFinalTrip}
      />
      <br /><br />

      {/* קומפוננטה להוספת טיפים */}
      <Tips
        setTrip={shareContext.setTrip}
        trip={shareContext.trip}
      />

      {/* קומפוננטה להוספת תגיות*/}
      <Tags
        dataTags={shareContext.dataTags}
        setDataTags={shareContext.setDataTags}
        tagsForFinalTrip={shareContext.tagsForFinalTrip}
        setTagsForFinalTrip={shareContext.setTagsForFinalTrip}
        newTagsForDB={shareContext.newTagsForDB}
        setNewTagsForDB={shareContext.setNewTagsForDB}
      />

      <Alert style={{ margin: '0 auto', marginTop: '30px',marginBottom:'30px', textAlign: 'center', width: '50%', visibility: props.alertWhenSaving.visibility }} severity="error"> {props.alertWhenSaving.message} </Alert>



    </>
  )
}
