import React, {useEffect,useState} from 'react';
import {useParams} from "react-router-dom";
import Sov_item_totals from './Utilities/Sov_item_totals.js'; 
import Totals_by_key from './Utilities/Totals_by_key.js';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import firebase from "./Firebase.js"; 
import Pay_app_viewer_g702 from "./Pay_app_viewer/Pay_app_viewer_g702.js"; 
import Pay_app_viewer_g703 from "./Pay_app_viewer/Pay_app_viewer_g703.js"; 


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



    //NEED TO EITHER FETCH DATA FROM THE DATABASE IF LOADING AN EXISTING APPLICATION OR USE PROPS PASSED IN FOR VIEWING A DRAFT APPLICATION 
    useEffect( () => {
        //FUNCTION TO FETCH FROM DATABASE
        const fetchData = async () =>{
            if(params !== undefined){
                const dataList = await firestoreDB.collection("contracts").doc(params.id).get(); //updated
                set_contract_info(dataList.data()); 
            
                const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
                set_owner_info(dataList2.data()); 

                const tempList = []; 


                const dataList3 = await firestoreDB.collection("contracts").doc(params.id).collection("sov").get();
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
            set_draft(true); 
            console.log("SOV INSIDE PAY APP VIEWER", props.sov)
            console.log("APP_ID INSIDE PAY APP VIEWER", props.app_id)
        }
    }, []);  

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
        <PDFViewer showToolbar={true} height={800} width={1600}>
        <Document>
            <Pay_app_viewer_g702
                contract_info={contract_info}
                owner_info={owner_info}
                app_id={app_id}
                line_item_totals={line_item_totals}
                co_summary={co_summary}
                retention={Number(0.05)}
                draft={draft}
            />

            <Pay_app_viewer_g703
                app_id={app_id}
                line_items={line_items}
                line_item_totals={line_item_totals}
                draft={draft}
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
