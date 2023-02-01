import firebase from "../Firebase.js"; 
    
    
//SUBMIT A NEW CHANGE ORDER
const Add_co = (uid, contract_id, contract_info, sov_id, sov, rev_co) => {

    const firestoreDB = firebase.firestore();
    let contract_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts').doc(contract_id); //updated
    let sov_ref = contract_ref.collection("sov").doc(sov_id);

    let batch = firestoreDB.batch(); 
   
    
    //UPDATE CO LIST INSIDE THE SPECIFIC SOV
    let new_co_list = []
    let co_difference = Number(0); 
    let sov_item = [];

    for(let i = 0; i<sov.length; i++){
        if(sov[i].id == sov_id){
            sov_item = sov[i]
            break;
        }
    }

    

    batch.update(sov_ref, {"change_orders": new_co_list});//DONE


    //UPDATE BALANCE && CO AMOUNT IN CONTRACT INFO
    batch.update(contract_ref, {"co_value":Number(contract_info.co_value)+Number(data.value)}); //DONE
    batch.update(contract_ref, {"balance":Number(balance)}); //DONE




    //UPDATE RECENT TASKS
    let temp_update = [...contract_info.update];
    temp_update.push(new Date); 
    let temp_tasks = [...contract_info.recent_task];
    temp_tasks.push("Added a change order for "+ data.description)
    if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
        temp_update.shift();
        temp_tasks.shift();
    }
    batch.update(contract_ref, {"update":temp_update}); //DONE
    batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE


} 

export default Edit_co; 