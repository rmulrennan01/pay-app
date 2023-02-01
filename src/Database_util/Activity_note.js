

import firebase from "../Firebase.js"; 



//HELPER FUNCTION FOR UPDATING THE RECENT DRAW ACTIVITY


const Activity_note =  async (uid, activity, contract_id, contract_name) =>{
    
    let account_ref = firebase.firestore().collection('accounts').doc(uid); 
    let data = {
        activity: activity,
        contract_id: contract_id,
        contract_name: contract_name,
        date: new Date()
    }


    account_ref.update({
        activity: firebase.firestore.FieldValue.arrayUnion(data)
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