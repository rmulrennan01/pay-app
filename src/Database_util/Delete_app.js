import firebase from "../Firebase.js"; 
import Activity_update from "./Activity_update.js";
import Activity_note from "./Activity_note.js";

const Delete_app = (contract_info, sov, uid, id) => {
    const firestoreDB = firebase.firestore();

    let batch = firestoreDB.batch(); 
    //let contract_ref = firestoreDB.collection("contracts").doc(id);
    let contract_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts').doc(id); //updated


    //UPDATE THE LAST INDEX OF EACH PAY APP IN THE SOV TO BE THE USER INPUTS
    let temp_sov = JSON.parse(JSON.stringify(sov)); //CREATE A DEEP COPY
    let app_dates = JSON.parse(JSON.stringify(contract_info.pay_app_dates)); //CREATE A DEEP COPY
    let old_date = new Date(app_dates[app_dates.length-1].seconds*1000);
    app_dates.pop(); 
    let this_draw = Number(0); 
    let prev_draw = Number(0); 
    let balance = Number(0); 
    let old_draw = contract_info.this_draw;
    
    

    for (let i=0; i<temp_sov.length; i++){
        temp_sov[i].pay_apps.pop(); //REMOVE THE LAST APP VALUE
        let temp_apps = temp_sov[i].pay_apps; 
        this_draw += Number(temp_apps[temp_apps.length-1]) //NEED TO TOTAL THE LAST APP VALUE
        
        //GENERATE BATCH ITEM FOR EACH SOV
        let temp_sov_ref = contract_ref.collection("sov").doc(temp_sov[i].id);
        batch.update(temp_sov_ref, {"pay_apps":temp_sov[i].pay_apps});//DONE
    }
    if(contract_info.app_count == 1){
        prev_draw = Number(0); 
        balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value); 
        this_draw = Number(0); 
    }
    else{
        prev_draw = Number(contract_info.prev_draws) - Number(this_draw); 
        balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(this_draw) - Number(prev_draw); 
    }
    
    //UPDATE THIS_DRAW & BALANCE IN THE CONTRACT_INFO 
    batch.update(contract_ref, {"balance":balance});//DONE
    batch.update(contract_ref, {"this_draw":this_draw});//DONE
    batch.update(contract_ref, {"prev_draws":prev_draw});//DONE
    batch.update(contract_ref, {"app_count": Number(contract_info.app_count)-1}); 
    batch.update(contract_ref, {"pay_app_dates": app_dates}); 


    //RECENT TASKS
    let temp_update = [...contract_info.update];
    temp_update.push(new Date); 
    let temp_tasks = [...contract_info.recent_task];
    temp_tasks.push("Deleted the most recent payment application")
    if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
        temp_update.shift();
        temp_tasks.shift();
    }
    batch.update(contract_ref, {"update":temp_update}); //DONE
    batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE

    
    batch.commit().then(()=>{
        let app_date= new Date(contract_info.pay_app_dates[contract_info.pay_app_dates.length-1].seconds*1000); 

        Activity_update(uid,old_date,-Number(old_draw))
        .then(()=>{
            console.log("Payment application deleted successfully"); 
            alert("Payment application deleted successfully."); 
            Activity_note(uid, "Deleted a payment application", id, contract_info.name)
            .then(()=>{
                window.location.reload(false);
    
            })
            .catch((error) =>{
            console.error("Error updating activites", error);
            alert("Failed to delete payment application. Please try again later or contact support."); 
            })
        })
        .catch((error)=>{
            console.log(error);
        });

    })
    .catch((error) => {
        console.error("Error deleting payment applicaiton", error); 
        alert("Failed to delete payment application. Please try again later or contact support.")
    });
}

export default Delete_app;