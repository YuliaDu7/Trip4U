import { createContext, useEffect, useState, useContext } from "react"
import { DataContext } from '../ContextProvider';

export const ShareContext = createContext();
export default function ContextShare(props) {
   
    const dataContext = useContext(DataContext);
    let loggedUserName; 
    
    useEffect(()=>{

        loggedUserName = dataContext.loggedUser.userName;
        setTrip({ ...trip, userName: loggedUserName })

    },[dataContext.loggedUser])

    const [trip, setTrip] = useState({
        tripTitle: "",
        area: null,
        tripDescription: "",
        tripDate: null,
        season: null,
        tips: "",
        userName: "",
        tagId: [],
        placesInTrip: [],
        restInTrip: [],
        propID: [],
        typeID: [],
        groupId: null

    });

    //מערך סוגים לטיול
    const [typesForFinalTrip, setTypesForFinalTrip] = useState([])
    //מערך מאפיינים לטיול
    const [propsForFinalTrip, setPropsForFinalTrip] = useState([])
    //רשימה של המקומות ליוזר
    const [placesForFinalTrip, setPlacesForFinalTrip] = useState([])
    //רשימה של המסעדות ליוזר
    const [restsForFinalTrip, setRestsForFinalTrip] = useState([])

    //רשימת תגיות חדשות להכנסה לדאטא בייס
    const [newTagsForDB, setNewTagsForDB] = useState([])
    const [dataTags, setDataTags] = useState([])
    //מערך תגיות לטיול הסופי
    const [tagsForFinalTrip, setTagsForFinalTrip] = useState({ names: [], ids: [] })

    //סטייט שמכיל את כל הקומפוננטות של מסעדה ומקום חדש
    const [components, setComponents] = useState([]);

    const [initialLoad, setInitialLoad] = useState(true);

    return (
        <ShareContext.Provider value={{ 
            trip, setTrip, typesForFinalTrip, setTypesForFinalTrip, propsForFinalTrip, setPropsForFinalTrip,
            placesForFinalTrip, setPlacesForFinalTrip, restsForFinalTrip, setRestsForFinalTrip,
            newTagsForDB, setNewTagsForDB, dataTags, setDataTags, tagsForFinalTrip, setTagsForFinalTrip,
            components, setComponents, initialLoad, setInitialLoad
        }} >{props.children} </ShareContext.Provider>
    )
}
