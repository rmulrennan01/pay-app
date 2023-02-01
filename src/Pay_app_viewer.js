import React, {useEffect,useState} from 'react';
import {useParams} from "react-router-dom";
import Sov_item_totals from './Utilities/Sov_item_totals.js'; 
import Totals_by_key from './Utilities/Totals_by_key.js';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import firebase from "./Firebase.js"; 
import Pay_app_viewer_g702 from "./Pay_app_viewer/Pay_app_viewer_g702.js"; 
import Pay_app_viewer_g703 from "./Pay_app_viewer/Pay_app_viewer_g703.js"; 
//AUTH
import {useContext} from 'react'; 
import { UserContext } from "./User_provider";

//THIS COMPONENT BUILDS A PDF VERSION OF THE AIA PAYMENT APPLICAITON
function Pay_app_viewer(props) {
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [contract_info, set_contract_info] = useState([]); 
    const [owner_info, set_owner_info] = useState([]); 
    const [sov, set_sov] = useState([]); 
    const [loading, set_loading] = useState(true); 


    const [line_items, set_line_items] = useState([]);
    const [line_item_totals, set_line_item_totals] = useState({}); 
    const [co_summary, set_co_summary] = useState({}); 

    const params = useParams(); 
    const [id, set_id] = useState(0); 
    const [app_id, set_app_id] = useState(0); 
    const [draft, set_draft] = useState(false); 
    const [app_date, set_app_date] = useState(new Date); 
    const [end_date, set_end_date] = useState(new Date((new Date).getFullYear(),(new Date).getMonth()+1,0)); 


    //auth
    const [uid, set_uid] = useState(0); 
    const user = useContext(UserContext);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(uid==0){set_uid(user.uid); }
            console.log('signed in', user.uid);

        } else {
            console.log('signed out', user);
            window.location='/login/';
        }
    });

    //NEED TO EITHER FETCH DATA FROM THE DATABASE IF LOADING AN EXISTING APPLICATION OR USE PROPS PASSED IN FOR VIEWING A DRAFT APPLICATION 
    useEffect( () => {

        //FUNCTION TO FETCH FROM DATABASE
        const fetchData = async () =>{
            if(params !== undefined){

                let job_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts');
                let owner_ref = firestoreDB.collection('contacts').doc(uid).collection('owners'); 
    
                const dataList = await job_ref.doc(params.id).get(); //updated
                set_contract_info(dataList.data()); 
                let date = dataList.data().pay_app_dates[Number(params.app_id)-1];
                let temp_date = new Date; 
                //CONVERT FROM GOOGLE TIMESTAMP TO DATE OBJECT
                if(!(date instanceof Date)){
                    temp_date = new Date(date.seconds*1000); 
                }
                else{
                    temp_date = new Date(date); 
                }
                set_app_date(temp_date);
                set_end_date(new Date(temp_date.getFullYear(),temp_date.getMonth()+1,0));

            
                const dataList2 = await owner_ref.doc(dataList.data().owner_id).get(); //updated
                set_owner_info(dataList2.data()); 

                const tempList = []; 


                const dataList3 = await job_ref.doc(params.id).collection("sov").get();
                dataList3.forEach((doc) => {
                    let tempDict = doc.data(); 
                    tempDict["id"] = doc.id; 
                    tempList.push(tempDict); 
                });
                set_sov(tempList); 
            };
        }
      
        //USE CASE FOR VIEWING AN ALREADY COMPLETED PAYMENT APPLICATION FROM THE DATABASE PER DATABASE ID FROM PARAM
        if(!props.hasOwnProperty("draft")){
            set_id(params.id); 
            set_app_id(params.app_id);
            fetchData(); 
            //set_line_items(Sov_item_totals(sov,params.app_id,0.05)); 
            //console.log("LINE_ITEMS", line_items); 
        }
        //USE CASE FOR VIEWING A DRAFT OF A PAYMENT APPLICATION. ALL DATA IS PASSED AS A PROP (I.E. NOT A PARAM)
        else {
            console.log("BUILDING DRAFT PDF")
            set_app_id(props.app_id); 
            set_owner_info(props.owner_info);
            set_contract_info(props.contract_info);
            set_sov(props.sov); 
            set_app_date(props.app_date); 
            set_end_date(new Date(props.app_date.getFullYear(),props.app_date.getMonth()+1,0)); 
            set_draft(true); 

        }
    }, [uid]);  

    //TO LIMIT RE-RENDERS WE ONLY NEED TO BUILD THE LINE_ITEMS FOR THE CHILD COMPONENTS ONCE SOV, CONTRACT_INFO, AND OWNER_INFO ARE POPULATED
    useEffect(()=>{
        if((sov !=[]) && (contract_info !=[]) && (owner_info !=[])){
            set_line_items(sov !=null ? Sov_item_totals(sov,app_id-1,0.05) : []);
            get_co_summary(); 
            console.log("LINE_ITEMS_DRAFT", line_items)
        }
    }, [sov, contract_info, owner_info]); 

    useEffect(()=>{
        console.log("LINE_ITEMS", line_items)
        if(line_items.length > 0){
            set_line_item_totals(Totals_by_key(line_items,'*'));
            set_loading(false);
        }
    }, [line_items]); 

  
    //HELPER FUNCTION TO CATEGORIZE CO'S BY NEGATIVE AND POSITIVE BUCKETS FOR USE IN THE G702 CO SUMMARY TABLE
    const get_co_summary = () => {
        let temp_info = {co_prev_pos:Number(0), co_prev_neg:Number(0), co_cur_pos:Number(0), co_cur_neg:Number(0)}; 
        for (let i = 0; i < sov.length; i++){
            let temp_item = sov[i]; 
            if(temp_item.hasOwnProperty('change_orders') && typeof temp_item.change_orders =='object'){
                let co_list = temp_item.change_orders;
                for (let j = 0; j<co_list.length; j++){
                    if(Number(co_list[j].value) > 0 && co_list[j].pay_app < app_id){
                        temp_info.co_prev_pos += Number(co_list[j].value); 
                    }
                    else if(Number(co_list[j].value) < 0 && co_list[j].pay_app < app_id){
                        temp_info.co_prev_neg -= Number(co_list[j].value); 
                    }
                    else if(Number(co_list[j].value) > 0 && co_list[j].pay_app == app_id){
                        temp_info.co_cur_pos += Number(co_list[j].value); 

                    }
                    else if(Number(co_list[j].value) < 0 && co_list[j].pay_app == app_id){
                        temp_info.co_cur_neg -= Number(co_list[j].value); 
                    }
                }
            }
        }
        temp_info.co_total_pos = Number(temp_info.co_prev_pos) + Number(temp_info.co_cur_pos);
        temp_info.co_total_neg = Number(temp_info.co_prev_neg) + Number(temp_info.co_cur_neg);
        temp_info.total = Number(temp_info.co_total_pos) - Number(temp_info.co_total_neg); 
        set_co_summary(temp_info); 
    }

    //GENERATES THE PDF DOCUMENT. CONSISTS OF TWO PDF PAGES -> G702 (1) AND G703 (1)
    const doc = () => {
        return(
        <PDFViewer showToolbar={true} height={800} width={1200}>
        <Document>
            <Pay_app_viewer_g702
                contract_info={contract_info}
                owner_info={owner_info}
                app_id={app_id}
                line_item_totals={line_item_totals}
                co_summary={co_summary}
                retention={Number(0.05)}
                draft={draft}
                app_date={app_date}
                end_date={end_date}
            />

            <Pay_app_viewer_g703
                app_id={app_id}
                line_items={line_items}
                line_item_totals={line_item_totals}
                draft={draft}
                app_date={app_date}
                end_date={end_date}
            /> 
        </Document>
        </PDFViewer>
        )
    }; 



    return (
        <div>
            {loading ? null: doc()}
        </div>
    )
}

export default Pay_app_viewer
