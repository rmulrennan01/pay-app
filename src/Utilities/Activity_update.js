

import firebase from "../Firebase.js"; 
import { UpdateSharp } from "@material-ui/icons";

const fetchData = async (id) =>{
    let account_ref = firebase.firestore().collection('accounts').doc(id); 
    const account = await account_ref.get();
    return account.data(); 
}


//HELPER FUNCTION FOR UPDATING THE RECENT DRAW ACTIVITY
const Activity_update =  async (uid, date, value) =>{
    let account = await fetchData(uid);
    
    let account_ref = firebase.firestore().collection('accounts').doc(uid); 
    let updates = account.draws
    let date_key = String(date.getMonth()) + '/' + String(date.getFullYear());
    
    if(updates[date_key] === undefined){
        updates[date_key] = Number(value);
    }
    else{
        updates[date_key] += Number(value); 

    }
    
    
    account_ref.update({
        draws: updates
    })
    .then(()=>{
        console.log('UPDATE SUCCESS')
        return true;
    })
    .catch((error) => {
        console.log('ERROR UPDATING', error); 
        return false; 

    });
    


}


export default Activity_update; 