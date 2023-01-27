

import firebase from "../Firebase.js"; 

const fetchData = async (id) =>{
    let account_ref = firebase.firestore().collection('accounts').doc(id); 
    const account = await account_ref.get();
    return account.data(); 
}


//HELPER FUNCTION FOR UPDATING THE RECENT DRAW ACTIVITY
const Activity_update =  async (uid, name, task, date) =>{
    let account = await fetchData(uid);
    
    let account_ref = firebase.firestore().collection('accounts').doc(uid); 
    let updates = account.activity
    updates.push({
        name: name, 
        recent_task: task, 
        date: date

    })
    
    
    account_ref.update({
        activity: updates
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


export default Activity_note; 