 
import firebase from "../Firebase.js"; 
import Activity_update from "./Activity_update.js";

 
 
 //SUBMIT A REVISION TO A PAY APPLICATION
 const Edit_app = (inputs, contract_info, sov, uid, id) =>{
    const firestoreDB = firebase.firestore();

    let batch = firestoreDB.batch(); 
    //let contract_ref = firestoreDB.collection("contracts").doc(id);
    let contract_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts').doc(id); //updated


    //UPDATE THE LAST INDEX OF EACH PAY APP IN THE SOV TO BE THE USER INPUTS
    let temp_sov = JSON.parse(JSON.stringify(sov)); //CREATE A DEEP COPY
    let rev_draw = Number(0); 
    for (let i=0; i<temp_sov.length; i++){
        let temp_sov_ref = contract_ref.collection("sov").doc(temp_sov[i].id);
        temp_sov[i].pay_apps.pop(); 
        temp_sov[i].pay_apps.push(Number(inputs[i]));
        batch.update(temp_sov_ref, {"pay_apps":temp_sov[i].pay_apps});//DONE
        rev_draw += Number(inputs[i]);
    }

    //UPDATE THIS_DRAW & BALANCE IN THE CONTRACT_INFO 
    let balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(contract_info.prev_draws) - rev_draw;
    batch.update(contract_ref, {"balance":balance});//DONE
    batch.update(contract_ref, {"this_draw":rev_draw});//DONE

    //RECENT TASKS
    let temp_update = [...contract_info.update];
    temp_update.push(new Date); 
    let temp_tasks = [...contract_info.recent_task];
    temp_tasks.push("Edited the most recent payment application")
    if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
        temp_update.shift();
        temp_tasks.shift();
    }
    batch.update(contract_ref, {"update":temp_update}); //DONE
    batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE

    /*
    let temp_activity = JSON.parse(JSON.stringify(contract_info.activity)); //DEEP COPY
    batch.update(contract_ref)
    if(activity.length > 25){
        temp_activity.shift();
    }
    */
    
    batch.commit().then(()=>{
        let app_date= new Date(contract_info.pay_app_dates[contract_info.pay_app_dates.length-1].seconds*1000); 
        let adjust = Number(rev_draw) - Number(contract_info.this_draw); 

        Activity_update(uid,app_date,Number(adjust))
        .then(()=>{
            console.log("updated app changes successfully"); 
            alert("Changes to most recent application updated successfully!"); 
            window.location.reload(false);
        })
        .catch((error)=>{
            console.log(error);
        });

    })
    .catch((error) => {
        console.error("Error updating payment applicaiton", error); 
        alert("Failed to submit changes to the payment application. Please try again later or contact support.")
    });

}

export default Edit_app; 