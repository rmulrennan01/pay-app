


import firebase from "../Firebase.js"; 
import Activity_note from "./Activity_note.js";


const Delete_co = (contract_info, sov, sov_id, index, uid, id) => {
    const firestoreDB = firebase.firestore();
    let batch = firestoreDB.batch(); 
    //let contract_ref = firestoreDB.collection("contracts").doc(id);
    let contract_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts').doc(id); //updated
    let sov_ref = contract_ref.collection("sov").doc(sov_id);
    let co_val = Number(0); 

    let co_list = [];
    for (let i=0; i<sov.length; i++){
        if(sov[i].id == sov_id){
            co_list = JSON.parse(JSON.stringify(sov[i].change_orders)); //CREATE DEEP COPY
            console.log('INDEX', index)
            co_val = co_list[index].value; 
            break;
        }
    }

    co_list.splice(index,1); 
    batch.update(sov_ref, {"change_orders":co_list});//DONE
    batch.update(contract_ref, {"co_value":Number(contract_info.co_value)-Number(co_val)}); //DONE
    batch.update(contract_ref, {"co_count":Number(contract_info.co_count)-Number(1)}); //DONE
    batch.update(contract_ref, {"balance":Number(contract_info.balance)-Number(co_val)}); //DONE


    //RECENT TASKS
    let temp_update = [...contract_info.update];
    temp_update.push(new Date); 
    let temp_tasks = [...contract_info.recent_task];
    temp_tasks.push("Deleted a change order.")
    if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
        temp_update.shift();
        temp_tasks.shift();
    }
    batch.update(contract_ref, {"update":temp_update}); //DONE
    batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE


    batch.commit().then(()=>{
        console.log("Change Order deleted successfully"); 
        alert("Change order deleted successfully."); 
        Activity_note(uid, "Deleted a change order", id, contract_info.name)
        .then(()=>{
            window.location.reload(false);

        })
        .catch((error) =>{
        console.error("Error updating activites", error);
        alert("Failed to delete change order. Please try again later or contact support."); 
        })
    })
    .catch((error) => {
        console.error("Error deleting change order.", error); 
        alert("Failed to delete change order. Please try again later or contact support.")
    });


}

export default Delete_co; 