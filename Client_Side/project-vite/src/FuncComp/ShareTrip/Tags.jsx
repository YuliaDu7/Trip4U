import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Box, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';

export default function Tags(props) {

    const [alert, setAlert] = useState({
        display: 'none', message: ''
    });

    const [newTagTemp, setNewTagTemp] = useState("");
    const [hasTags, setHasTags] = useState(false);


    const checkHasTags = () => {
        if (props.mode === 'edit') {
            return (props.tripToEdit?.tags?.length > 0 || props.newTagsForDB.length > 0);
        } else {
            return props.tagsForFinalTrip?.names?.length > 0;
        }
    };

    useEffect(() => {

        setHasTags(checkHasTags());
    }, [props.tripToEdit?.tags, props.newTagsForDB, props.tagsForFinalTrip]);

    const ChooseTagFromDataTags = (event, selectedOption) => {
        if (selectedOption) {

            if (props.mode === 'edit') {
                props.setDataTags(props.dataTags.filter(tag => tag.tagId !== selectedOption.tagId));
                const updatedTags = [...props.tripToEdit.tags, selectedOption];
                props.setTripToEdit(prevTripToEdit => ({ ...prevTripToEdit, tags: updatedTags }));
            } else {
                props.setDataTags(props.dataTags.filter(tag => tag.tagName !== selectedOption.tagName));
                let names = props.tagsForFinalTrip.names;
                names.push(selectedOption.tagName);
                let ids = props.tagsForFinalTrip.ids;
                ids.push(selectedOption.tagId);
                props.setTagsForFinalTrip({ names: [...names], ids: [...ids] });
            }
        }
        setAlert({ display: 'none', message: '' });
    };

    const AddNewTag = () => {
        let newTag = newTagTemp.trim();

        if (newTag && newTag !== '') {

            setAlert({ display: 'none', message: '' });

            if (props.mode == "edit") {
                if (!props.dataTags.find(item => item.tagName === newTag) &&
                    !props.newTagsForDB.includes(newTag) &&
                    !props.tripToEdit.tags.find(tag => tag.tagName === newTag)) {
                    props.setNewTagsForDB(prevNewTags => [...prevNewTags, newTag]);
                } else {
                    setAlert({ display: 'inline-flex', message: 'יש להכניס תגית שלא קיימת עדיין באחת מהרשימות' });
                }
            }
            else {
                if (!props.dataTags.find(item => item.tagName === newTag) &&
                    !props.newTagsForDB.includes(newTag) &&
                    !props.tagsForFinalTrip.names.includes(newTag)) {
                    props.setNewTagsForDB(prevNewTags => [...prevNewTags, newTag]);
                    let names = props.tagsForFinalTrip.names;
                    names.push(newTag);
                    props.setTagsForFinalTrip((prev) => ({
                        ...prev,
                        names: [...names]
                    }));
                } else {
                    setAlert({ display: 'inline-flex', message: 'יש להכניס תגית שלא קיימת עדיין באחת מהרשימות' });
                }
            }
        }
    };

    const DeleteTag = (tagToDelete) => {
        if (props.mode === 'edit') {

            const updatedTags = props.tripToEdit.tags.filter(tag => tag !== tagToDelete);
            props.setTripToEdit(prevTripToEdit => ({
                ...prevTripToEdit,
                tags: updatedTags,
            }));

            if (props.newTagsForDB.includes(tagToDelete)) {
                const updatedNewTagsForDB = props.newTagsForDB.filter(tag => tag !== tagToDelete);
                props.setNewTagsForDB(updatedNewTagsForDB);
            }


            props.setDataTags(prevDataTags => [...prevDataTags, tagToDelete]);
        } else {

            const updatedNames = props.tagsForFinalTrip.names.filter(tag => tag !== tagToDelete);
            props.setTagsForFinalTrip(prev => ({ ...prev, names: updatedNames }));

            const updatedNewTagsForDB = props.newTagsForDB.filter(tag => tag !== tagToDelete);
            props.setNewTagsForDB(updatedNewTagsForDB);
        }
    };


    //רק במצב עריכה
    //תגיות חדשות שלא מהרשימה
    const DeleteNewTag = (tagToDelete) => {

        const updatedNewTagsForDB = props.newTagsForDB.filter(tag => tag !== tagToDelete);

        props.setNewTagsForDB(updatedNewTagsForDB);
    };


    return (
        <>
            <Grid item xs={12}>
                <br />
                <br />
                <Box style={{ margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px', marginBottom: 1 }}>
                    <Autocomplete
                        disablePortal
                        options={props.dataTags}
                        sx={{ width: '10%' }}
                        style={{ margin: 20 }}
                        getOptionLabel={(option) => option.tagName || ''}
                        renderInput={(params) => <TextField {...params} label="חפש תגיות..." />}
                        onChange={ChooseTagFromDataTags}
                        onInputChange={(event, value) => {
                            if (event.type === 'blur' || (event.type === 'keydown' && event.key === 'Enter')) {
                                AddNewTag(event, value);
                            }
                        }}
                        value={null}
                    />
                    <TextField
                        required
                        placeholder='כתוב תגית חדשה ולחץ "הוסף"... '
                        variant="outlined"
                        multiline
                        maxRows={4}
                        style={{ width: "20%", margin: 20 }}
                        onChange={(e) => {
                            setNewTagTemp(e.target.value);
                            setAlert({ display: 'none', message: '' });
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={AddNewTag}
                        style={{
                            backgroundColor: "#927070",
                            color: "white",
                            width: 100,
                            margin: 20,
                            borderRadius: 10,
                            fontSize: 17
                        }}
                    >
                        הוסף
                    </Button>
                </Box>
                <Alert style={{ margin: '0 auto', marginTop: '5px', textAlign: 'center', width: '50%', display: alert.display }} severity="error"> {alert.message} </Alert>
            </Grid>
            <Grid item xs={12}>
                <br />
                <Box>
                    {hasTags && <strong style={{ color: '#927070' }}>התגיות שנבחרו לטיול:</strong>}
                    <br />
                    <ul style={{ display: 'inline-block', padding: 0, margin: 0 }}>
                        {
                            props.mode === 'edit' ?
                                (
                                    <>
                                        {props.tripToEdit.tags && props.tripToEdit.tags.map((tag, index) => (
                                            <li
                                                style={{ display: 'inline-block', marginRight: '10px' }}
                                                key={index}
                                            >
                                                <IconButton style={{ marginRight: '15px' }} onClick={() => DeleteTag(tag)}>
                                                    <ClearIcon style={{ width: '20px', color: 'black' }} />
                                                </IconButton>
                                                {"#"}{tag.tagName}
                                                <br />
                                            </li>
                                        ))}
                                    </>
                                ) :
                                (
                                    <>
                                        {props.tagsForFinalTrip.names.map((tag, index) => (
                                            <li style={{ display: 'inline-block', marginRight: '10px' }} key={index}>
                                                <IconButton style={{ marginRight: '15px' }} onClick={() => DeleteTag(tag)}>
                                                    <ClearIcon style={{ width: '20px', color: 'black' }} />
                                                </IconButton>
                                                {"#"}{tag}
                                                <br />
                                            </li>
                                        ))}
                                    </>
                                )
                        }

                        {/* // תגיות חדשות בלבד */}
                        {props.mode === 'edit' && props.newTagsForDB && props.newTagsForDB.map((newTag, index) => (
                            <li
                                style={{ display: 'inline-block', marginRight: '10px' }}
                                key={`newTag-${index}`}
                            >
                                <IconButton style={{ marginRight: '15px' }} onClick={() => DeleteNewTag(newTag)}>
                                    <ClearIcon style={{ width: '20px', color: 'black' }} />
                                </IconButton>
                                {"#"}{newTag}
                                <br />
                            </li>
                        ))}
                    </ul>
                </Box>
            </Grid>

        </>
    )
}
