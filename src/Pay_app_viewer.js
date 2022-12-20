import React, {useEffect,useState} from 'react';
import {useParams} from "react-router-dom";
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


//This component builds a pdf view of any payment applications. 
//Requires the Document ID of the contract and the # for the payment application
function Pay_app_viewer(props) {
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState(); 
    const [loading, set_loading] = useState(true); 
    const [cc_line_items, set_cc_line_items] = useState([]); 
    const [no_apps, set_no_apps] = useState(false); 
    const [draw_info, set_draw_info] = useState([]); 
    const [g703_data, set_g703_data] = useState([]); 
    const [g703_totals, set_g703_totals] = useState([]); 
    const table_rows =
        [
            "Total changes approved in previous months by Contractor", 
            "Total approved this Month", 
            "Totals", 
            "Net Changes by Change Order"
        ]; 

    const summary_rows = 
        [   "1. Original Contract Sum:", 
            "2. Net Change by Change Orders",
            "3. Contract Sum to Date",
            "4. Total Completed & Stored to date (Column G)",
            "5. Retainage:",
            "-------> 5% of Completed Work:",
            "6. Total Earned Less Retainage",
            "7. Less Previous Certificates for Payment (Line 6 from prior Certificate)",
            "8. Current Payment Due",
            "9. Balance to Finish including Retaingage ",
        ]; 

    useEffect( () => {
        const fetchData = async () =>{
            const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            set_contract_info(dataList.data()); 
            //console.log(dataList.data()); 
        
            const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
            set_owner_info(dataList2.data()); 

            const tempList = []; 


            const dataList3 = await firestoreDB.collection("contracts").doc(id).collection("sov").get();
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
            
        }
        fetchData(); 

        
    }, []);  

    useEffect(()=>{
        if((sov !=null) && (contract_info !=null)){
            console.log(sov);
            console.log(contract_info);
            build_period_totals();
            sov.map(build_g703_data); 
            console.log("the droids you're looking for", g703_data);
            update_footer_totals(); 
            set_loading(false);
            
        }
    }, [sov, contract_info]); 

  

    const table_styles = StyleSheet.create({
        table:{
            flexWrap: "wrap",
            flexDirection: "row"
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
          },
          cell: {
            width: "50%",
          },
          cell_content: {
             fontSize: 20
          }

    }
    );


    //build table data for g703 sheet
    const build_g703_data = (cost_item, index) => {
        let app_index = app_id-1; 
        console.log("pay app id", app_id)
        //get total of previous draws for this cc
        let temp_cc_line_items = g703_data; 
        //let cost_item = sov[sov_index]; 
        let prev_draws = 0; 
        let co_sum = 0; 
        let payment = 0; 
        let balance = 0; 
 
        //get total of all previous draws applied to this cost item
        for (let i = 0; i<app_id; i++){
            if(i>0){prev_draws += Number(cost_item.pay_apps[i-1])}
        }
        //get total of all CO's applied to this cost item
        if(cost_item.hasOwnProperty('change_orders')){
            for (let a = 0; a<cost_item.change_orders.length; a++){
                if(Number(cost_item.change_orders[a].pay_app) <= app_index+1){ //adjusted
                    co_sum = Number(co_sum) + Number(cost_item.change_orders[a].value);
                }
            }
        }
        let ret = 0; 
        if(contract_info.hasOwnProperty('retention')){
            ret = 1 - contract_info.retention; 
        } 
        else{
            ret = .95; 
        }
        payment=Number(cost_item.pay_apps[app_index])*ret; //ADJUSTED
        balance=Number(cost_item.value)+co_sum-prev_draws*ret-payment;
        
        let completed = prev_draws+Number(cost_item.pay_apps[app_index]);//adjusted
        let percent = Number(completed)/Number(cost_item.value+co_sum)*100; 
        let retained = completed*(1-ret); 
        temp_cc_line_items.push([cost_item.cost_code,index+1,cost_item.description,cost_item.value,co_sum,cost_item.value+co_sum,prev_draws,
                    Number(cost_item.pay_apps[app_index]),completed,percent,balance,retained]); //adjusted
            /*{
                prev:prev_draws, 
                cur: Number(cost_item.pay_apps[app_id]),
                co_sum: co_sum, 
                cost_code:cost_item.cost_code,
                value:cost_item.value,
                description:cost_item.description,
                payment:payment,
                balance:balance
            }); */
        set_g703_data(temp_cc_line_items);
    }


    const styles = StyleSheet.create({
        page_top: {
            flexDirection:'row',
            backgroundColor: '#ffffff'
        },
        row: {
            flexDirection:'row'
        },
        section: {
          margin: 10,
          padding: 10,
          flexGrow: 1
        },
        content: {
            fontSize: 12,
            fontWeight: "light"
        },
        header: {
            fontWeight: "extrabold",
            fontSize: 14,
            marginBottom: 3,
            marginTop: 3
            
        }
    });
    
    //const build_
    


    /*
    address_01
    address_02
    app_count
    balance
    base_contract_value
    city
    co_count
    co_value
    date
    name
    number
    owner_id
    owner_name
    prev_draws
    state
    this_draw
    zip


    */
   

    //builds the content to be passed as a prop to the G702 sheet
    const build_period_totals = () => {
        let temp_app_totals = new Array(contract_info.app_count+1).fill(0); 
        let temp_co_totals = new Array(contract_info.app_count+1).fill(0); 
        let temp_co_pos = new Array(contract_info.app_count+1).fill(0); 
        let temp_co_neg = new Array(contract_info.app_count+1).fill(0); 

        //let temp_app_totals = new Array(app_id).fill(0); 
        //let temp_co_totals = new Array(app_id).fill(0); 
        
        //loop through each sov item
        for (let i = 0; i < sov.length; i++){
          let temp_sov_item = sov[i]; 
          //console.log("temp sov item is: ", temp_sov_item); 
        
          //if it does not exist
          if(!temp_sov_item.hasOwnProperty("pay_apps")){
            set_no_apps(true); 
            break; 
          }
          //create a combined draw total for each pay period   
          else if(temp_sov_item.pay_apps !==0){
            temp_sov_item.pay_apps.map((item,index) => temp_app_totals[index] = Number(temp_app_totals[index])+Number(item))
            
          }
          
          //build totals for each pay period
          if(temp_sov_item.change_orders !==0){
            temp_sov_item.change_orders.map((item) => {
                temp_co_totals[item.pay_app-1] = Number(temp_co_totals[item.pay_app-1])+Number(item.value);
                if(item.value > 0 ){
                    temp_co_pos[item.pay_app-1] = Number(temp_co_pos[item.pay_app-1])+Number(item.value);            
                }
                else{
                    temp_co_neg[item.pay_app-1] = Number(temp_co_neg[item.pay_app-1])+Number(item.value);                }    
            
          }
          )
        }
        }


        if(!no_apps){
            
            let temp_line_item = []; 
            for (let i = 0; i<app_id; i++){
                let temp_info = 
                    {
                    base_contract:0, change_orders:0, change_orders_total:0, revised_contract:0, this_draw:0, 
                    previous_payments:0, balance:0, retention: " ",ret_prev:0,ret_cur:0,
                    co_pos_total:0, co_neg_total:0, prev_pos_co:0, prev_neg_co: 0,
                    }; 
                    temp_info.base_contract=contract_info.base_contract_value;
                    temp_info.change_orders=temp_co_totals[i];
                    temp_info.co_pos_total = temp_co_pos[i]; 
                    temp_info.co_neg_total = temp_co_neg[i];
                    temp_info.this_draw=temp_app_totals[i]; 


                //get totals of prevoious positive & negative change orders
                if(i>0){
                    let prev_pos_co_sum = 0; 
                    let prev_neg_co_sum = 0; 
                    for (let a=0; a<i; a++){
                        prev_pos_co_sum += temp_line_item[a].co_pos_total; 
                        prev_neg_co_sum += Number(temp_line_item[a].co_neg_total); 
                    }
                    
                    temp_info.prev_pos_co = prev_pos_co_sum; 
                    temp_info.prev_neg_co = prev_neg_co_sum;
                };
                
                //temp_line_item[app_-1].change_orders_total = temp_line_item[app_id-1].prev_pos_co - temp_line_item[app_id-1].prev_neg_co +temp_line_item[app_id-1].co_pos_total - temp_line_item[app_id-1].co_neg_total;
                temp_info.change_orders_total = temp_info.prev_pos_co + temp_info.prev_neg_co +temp_info.co_pos_total + temp_info.co_neg_total;
            
                if(i==0){
                    temp_info.previous_payments=0;
                    temp_info.revised_contract=Number(contract_info.base_contract_value)+Number(temp_info.change_orders_total); 
                }
                else{
                    temp_info.previous_payments=Number(temp_line_item[i-1].this_draw)+Number(temp_line_item[i-1].previous_payments); 
                    temp_info.revised_contract=Number(contract_info.base_contract_value)+Number(temp_info.change_orders_total);
                }
                
                if(contract_info.hasOwnProperty('retention')){
                    let ret = 1 - contract_info.retention; 
                    temp_info.balance=Number(temp_info.revised_contract)-Number(temp_info.previous_payments)*ret -Number(temp_info.this_draw)*ret;
                    temp_info.payment=temp_info.this_draw*(1-contract_info.retention);
                    temp_info.ret_prev=temp_info.previous_payments*contract_info.retention;
                    temp_info.ret_cur=temp_info.this_draw*contract_info.retention;
                    temp_info.retention = toString(contract_info.retention*100)+"%";
                }
                else{
                    temp_info.balance=Number(temp_info.revised_contract)-Number(temp_info.previous_payments)*.95-Number(temp_info.this_draw)*.95;
                    temp_info.payment=temp_info.this_draw*.95; 
                    temp_info.ret_prev=temp_info.previous_payments*.05;
                    temp_info.ret_cur=temp_info.this_draw*.05;
                    temp_info.retention = "5%";
                }
                temp_line_item.push(temp_info); 
            }
            

            
            
            console.log("temp line item", temp_line_item); 
            set_draw_info(temp_line_item[app_id-1]); 

          //set_period_info(temp_line_item); 
        }
        //period_info=temp_line_item; 

    }
    



    const update_footer_totals = () => {
        let co_total = 0; 
        let prev_total = 0; 
        let cur_total = 0; 
        let payment_total = 0; 
        let balance_total= 0; 
        g703_data.map((item) => co_total = Number(co_total) + Number(item[4])); 
        g703_data.map((item) => prev_total = Number(prev_total) + Number(item[6]));
        g703_data.map((item) => cur_total = Number(cur_total) + Number(item[7]));
        g703_data.map((item) => payment_total = Number(payment_total) + Number(item[8])); 
        g703_data.map((item) => balance_total = Number(balance_total) + Number(item[10]));
        let rev_total = contract_info.base_contract_value+co_total; 
        let total_complete = Number(prev_total)+Number(cur_total);
        let percent = Number(total_complete/rev_total) *100; 
        let ret = 0; 
        if(contract_info.hasOwnProperty('retention')){
            ret = 1 - contract_info.retention; 
        } 
        else{
            ret = .95; 
        }
        let retained = total_complete *(1-ret)
        set_g703_totals([
            "", "","GRAND TOTALS",contract_info.base_contract_value,co_total,rev_total, prev_total, cur_total, payment_total, percent, balance_total, retained 
        ])
        
    }



    const doc = () => {
        return(
        <PDFViewer showToolbar={true} height={800} width={1600}>
        <Document>
            <Pay_app_viewer_g702
                draw_info={draw_info}
                contract_info={contract_info}
                owner_info={owner_info}
                app_id={app_id}
            />

            <Pay_app_viewer_g703
                g703_data={g703_data}
                g703_totals={g703_totals}
            
            
            /> 
        </Document>
        </PDFViewer>
        )
    }; 


    

    const {id, app_id} = useParams();
    console.log(id); 
    console.log(app_id); 
    return (
        <div>
            {loading ? null: doc()}

            
            

            
        </div>
    )
}

export default Pay_app_viewer
