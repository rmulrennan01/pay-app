import firebase from "../Firebase.js"; 
import Activity_update from './Activity_update.js'
import Activity_note from "./Activity_note.js";


const Add_app = (contract_info, sov, saved_inputs, app_date, uid, id) =>{
    const submission_success = () => {
        console.log("submission", saved_inputs); 
        alert("Pay App Added Successfully. You will now be redirected to the contract page"); 
        window.location='/contract/'+ String(id)
    
    }


    const firestoreDB = firebase.firestore();

    let batch = firestoreDB.batch(); 
    let contract_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts').doc(id); //updated
    let sov_ref = contract_ref.collection("sov"); 
    let draw_total = Number(0);
    console.log('SAVED_INPUTS', saved_inputs)
    //LOOP THROUGH AND CREATE A NEW PAY APP LIST TO INCLUDE INPUTS AND UPDATE
    for (let i=0; i<sov.length; i++){
        let temp_apps = [];
        temp_apps.push(...sov[i].pay_apps) //SHALLOW COPY
        console.log('TEST-INPUT', saved_inputs[i]); 
        if(saved_inputs.length === 0){
            temp_apps.push(Number(0));
        }
        else if(saved_inputs[i] == ""){
            temp_apps.push(Number(0));
        }
        else{
            temp_apps.push(Number(saved_inputs[i]));
            draw_total += Number(saved_inputs[i]); 
        }
        batch.update(sov_ref.doc(sov[i].id), {"pay_apps": temp_apps}); 

    }


    

    let date = new Date();
    let rev_prev_draws = Number(contract_info.prev_draws)+Number(contract_info.this_draw);
    let period_balance = Number(contract_info.base_contract_value)+Number(contract_info.co_value)-Number(rev_prev_draws)-Number(draw_total); 


    batch.update(contract_ref, {"prev_draws":rev_prev_draws});
    batch.update(contract_ref, {"this_draw":Number(draw_total)});
    batch.update(contract_ref, {"balance":period_balance});
    batch.update(contract_ref, {"app_count":Number(contract_info.app_count + Number(1))});
    batch.update(contract_ref, {"pay_app_dates": firebase.firestore.FieldValue.arrayUnion(app_date)}); 

    //RECENT TASKS
    let temp_update = [...contract_info.update];
    temp_update.push(new Date); 
    let temp_tasks = [...contract_info.recent_task];
    temp_tasks.push("Submitted a payment application")
    if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
        temp_update.shift();
        temp_tasks.shift();
    }
    batch.update(contract_ref, {"update":temp_update}); //DONE
    batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE
     
    batch.commit().then(()=>{
        //UPDATES THE USER ACCOUNT FOR QUICK ACCESS TO MONTHLY DRAWS
        Activity_update(uid,app_date,Number(draw_total))
        .then(()=>{
            Activity_note(uid, "Added a payment application", id, contract_info.name)
            .then(()=>{
                submission_success();    
            })
            .catch((error) =>{
            console.error("Error updating activites", error);
            alert("Failed to submit payment application. Please try again later or contact support."); 
            })
            
        })
        .catch((error) => {
            console.log('ERROR UPDATING ACCOUNT INTO', error); 
        });

    })
    .catch((error) => {
        console.error("Error adding pay app", error); 
        alert("Failed to submit payment application. Please try again later.")
    });

    



}

export default Add_app; 