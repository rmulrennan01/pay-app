import React, {useEffect,useState} from 'react';
import {useParams} from "react-router-dom";
import Sov_item_totals from './Utilities/Sov_item_totals.js'; 
import Totals_by_key from './Utilities/Totals_by_key.js';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import firebase from "./Firebase.js"; 
import PDF_table from "./PDF_Viewer/PDF_table.js";
import Pay_app_viewer_g702 from "./Pay_app_viewer/Pay_app_viewer_g702.js"; 
import Pay_app_viewer_g703 from "./Pay_app_viewer/Pay_app_viewer_g703.js"; 
//import { toolbarPlugin, ToolbarSlot } from "@react-pdf-viewer/toolbar";

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import { FormatBold } from '@material-ui/icons';
import Sov_table from './Pay_app/Sov_table.js';


//This component builds a pdf view of any payment applications. 
//Requires the Document ID of the contract and the # for the payment application
function Pay_app_viewer(props) {
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [contract_info, set_contract_info] = useState([]); 
    const [owner_info, set_owner_info] = useState([]); 
    const [sov, set_sov] = useState([]); 
    const [loading, set_loading] = useState(true); 


    const [line_items, set_line_items] = useState([]);
    const [line_item_totals, set_line_item_totals] = useState({}); 
    const [co_summary, set_co_summary] = useState({}); 

    //const {temp_id,temp_app_id} = useParams();
    const params = useParams(); 
    const [id, set_id] = useState(0); 
    const [app_id, set_app_id] = useState(0); 
    //const {id, app_id} = useParams();



    //NEED TO EITHER FETCH DATA FROM THE DATABASE IF LOADING AN EXISTING APPLICATION OR USE PROPS PASSED IN FOR VIEWING A DRAFT APPLICATION 
    useEffect( () => {
        //fetches from firebase
        const fetchData = async () =>{
            if(params !== undefined){
                const dataList = await firestoreDB.collection("contracts").doc(params.id).get(); //updated
                set_contract_info(dataList.data()); 
                //console.log(dataList.data()); 
            
                const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
                set_owner_info(dataList2.data()); 

                const tempList = []; 


                const dataList3 = await firestoreDB.collection("contracts").doc(params.id).collection("sov").get();
                dataList3.forEach((doc) => {
                    let tempDict = doc.data(); 
                    tempDict["id"] = doc.id; 
                    //tempDict["parent"] = doc.ref.parent.path.slice(0,-4); 
                    tempList.push(tempDict); 
                    //console.log("HERE:" , doc.ref.parent.path.slice(0,-4)); 
                });

                //console.log(tempList); 
                set_sov(tempList); 
                
                //build_period_totals(); 
            };
        }
      
        //case where this is displaying an existing payment application
        if(!props.hasOwnProperty("draft")){
            set_id(params.id); 
            set_app_id(params.app_id);
            fetchData(); 
            //set_line_items(Sov_item_totals(sov,params.app_id,0.05)); 
            //console.log("LINE_ITEMS", line_items); 
        }
        //case where this is a draft payment application to be previewed in the payment application process
        //app_id will be passed as a prop instead of being pulled form the url path
        else {
            set_app_id(props.app_id); 
            set_owner_info(props.owner_info);
            set_contract_info(props.contract_info);
            set_sov(props.sov); 
        }
    }, []);  

  
    useEffect(()=>{
        if((sov !=[]) && (contract_info !=[]) && (owner_info !=[])){
            set_line_items(sov !=null ? Sov_item_totals(sov,params.app_id-1,0.05) : []);
            get_co_summary(); 
           
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
            />

            <Pay_app_viewer_g703
                app_id={app_id}
                line_items={line_items}
                line_item_totals={line_item_totals}
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
