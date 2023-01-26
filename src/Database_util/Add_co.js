import firebase from "../Firebase.js"; 
    
    
//SUBMIT A NEW CHANGE ORDER
const Add_co = (sov_id, data, contract_info, uid, id) => {
    const firestoreDB = firebase.firestore();


    let rev_contract = Number(contract_info.base_contract_value) + Number(contract_info.co_value) + Number(data.value); 
    let balance = Number(rev_contract) - Number(contract_info.prev_draws) - Number(contract_info.this_draw); 
    
    let batch = firestoreDB.batch(); 

    //let contract_ref = firestoreDB.collection("contracts").doc(id); 
    //let sov_ref = contract_ref.collection("sov").doc(sov_id);
    let contract_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts').doc(id); //updated
    let sov_ref = contract_ref.collection("sov").doc(sov_id);

    //BATCH UPDATE WITH THE CO -> MUST UPDATE CO_COUNT; CO_VALUE; BALANCE; CO INSIDE SOV
    batch.update(sov_ref, {"change_orders": firebase.firestore.FieldValue.arrayUnion({description: data.description, value: Number(data.value), pay_app: Number(data.pay_app)})});//DONE
    batch.update(contract_ref, {"co_value":Number(contract_info.co_value)+Number(data.value)}); //DONE
    batch.update(contract_ref, {"co_count":Number(contract_info.co_count)+Number(1)}); //DONE
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


    batch.commit().then(()=>{
        console.log("updated co total successfully"); 
        alert("Change Order Added Successfully"); 
        window.location.reload(false);
    })
    .catch((error) => {
        console.error("Error adding change order", error); 
        alert("Failed to submit change order. Please try again later or contact support.")
    });
} 

export default Add_co; 