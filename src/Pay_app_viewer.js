import React, {useEffect,useState} from 'react';
import {useParams} from "react-router-dom";
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import firebase from "./Firebase.js"; 
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

    React.useEffect( () => {
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
            set_loading(false); 
            
        }
        fetchData(); 

        
    }, []);  

    const build_cc_line_item = (cost_item) => {
        //get total of previous draws for this cc
        let temp_cc_line_items = cc_line_items; 
        //let cost_item = sov[sov_index]; 
        let prev_draws = 0; 
        let co_sum = 0; 
        let payment = 0; 
        let balance = 0; 
 
        //get total of all previous draws applied to this cost item
        for (let i = 0; i<app_id; i++){
            prev_draws += Number(cost_item.pay_apps[i])
        }
        //get total of all CO's applied to this cost item
        if(cost_item.hasOwnProperty('change_orders')){
            for (let a = 0; a<cost_item.change_orders.length; a++){
                if(Number(cost_item.change_orders[a].pay_app) <= Number(app_id)+1){
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
        payment=Number(cost_item.pay_apps[app_id])*ret;
        balance=Number(cost_item.value)+co_sum-prev_draws*ret-payment;
        temp_cc_line_items.push(
            {
                prev:prev_draws, 
                cur: Number(cost_item.pay_apps[app_id]),
                co_sum: co_sum, 
                cost_code:cost_item.cost_code,
                value:cost_item.value,
                description:cost_item.description,
                payment:payment,
                balance:balance
            }); 
        set_cc_line_items(temp_cc_line_items);
    }


    const styles = StyleSheet.create({
        page: {
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

    const page_g702 = () =>{
        return(
            <Page size="A4" style={styles.page} orientation="landscape">
                <View >
                    <Text style={styles.header}>
                        TO OWNER: 
                    </Text>
                    <Text style={styles.content}>
                        {owner_info.address_01+" "+owner_info.address_02}
                    </Text>
                    <Text style={styles.content}>
                        {owner_info.city + ", " + owner_info.state + " " + owner_info.zip}

                    </Text>
  
                    <Text style={styles.header}>
                        FROM CONTRACTOR:
                    </Text>
                    <Text style={styles.content}>
                        {owner_info.address_01+" "+owner_info.address_02}
                    </Text>
                    <Text style={styles.content}>
                        {owner_info.city + ", " + owner_info.state + " " + owner_info.zip}
                    </Text>
                </View>
                <View>
                    <Text style={styles.header}>
                        PROJECT:
                    </Text>
                    <Text style={styles.content}>
                        {contract_info.name}
                    </Text>
                    <Text style={styles.content}>
                        {contract_info.address_01+" "+contract_info.address_02}
                    </Text>
                    <Text style={styles.content}>
                        {contract_info.city + ", " + contract_info.state + " " + contract_info.zip}
                    </Text>
               </View>
               <View>
                    <Text style={styles.content}>
                        APPLICATION NO: {app_id}
                    </Text>
                    <Text style={styles.content}>
                        PERIOD TO: --
                    </Text>
                    <Text style={styles.content}>
                        CONTRACT DATE: --
                    </Text>
               </View>
               <View>
                    <Text style={styles.content}>
                        APPLICATION NO: {app_id}
                    </Text>
                    <Text style={styles.content}>
                        PERIOD TO: --
                    </Text>
                    <Text style={styles.content}>
                        CONTRACT DATE: --
                    </Text>
               </View>

            </Page>
        )
    }

    const page_g703 = () =>{
        return(
            <Page size="A4" style={styles.page} orientation="landscape" className="page_G702">
           
            <div className="page_G702__top">
                <div className="page_G702__top__child">
                    <h4>To Owner:</h4>
                    {owner_info.address_01+" "+owner_info.address_02}<br/>
                    {owner_info.city + ", " + owner_info.state + " " + owner_info.zip}
                    <h4>From Contractor:</h4>
                    {owner_info.address_01+" "+owner_info.address_02}<br/>
                    {owner_info.city + ", " + owner_info.state + " " + owner_info.zip}
                </div>
                <div className="page_G702__top__child">
                    <h4>Project:</h4>
                    {contract_info.name}<br/>
                    {contract_info.address_01+" "+contract_info.address_02}<br/>
                    {contract_info.city + ", " + contract_info.state + " " + contract_info.zip}
                    
                </div>
                <div className="page_G702__top__child">
                    <h4>Application #: {contract_info.app_count}</h4>
                    <h4>Period To:</h4>

                    <h4>Contract Date:</h4>

                    <h4>Contract ID:</h4>

                </div>

                <div className="page_G702__top__child"> 
                    <h4> Distribution to: </h4>
                    [_] Owner:                   <br/>
                    [_] Architect:              <br/>
                    [X] General Contractor:      <br/>
                    [_] Owners Representative:   <br/>
                </div>
            </div> 
            <div className="page_G702__middle">
                <div className="page_G702__middle__child">


                    <div>
                        <div>
                            <h2>CONTRACTOR'S APPLICATION FOR PAYMENT</h2>
                            <h4>Application is made for payment, as shown below, in connection with the Contract. <br/> 
                                Continuation Sheet G703 is attached. 
                            </h4> 

                        </div>
                        <div>
                            {/*
                            <Table size='small'>
                                {content_keys.map(build_table_cell)}
                            </Table>
                            */}
                        </div>
                        <Table>
                            <TableBody>
                                <TableRow>

                                </TableRow>
                            </TableBody>
                        </Table>


                    </div>
                    <div>
                        {/*
                        <Table>
                            <TableHead>
                                <TableRow >
                                    {table_headers.map((item)=><TableCell style={{fontWeight:"bold"}}>{item}</TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {table_rows.map(build_table_body)}
                            </TableBody>
                        </Table>
                        */}

                    </div>
                </div> 
                <div className="page_G702__middle__child">
                    <div> 
                        The undersigned Contractor certifies that to the best of the Contractor's knowledge, <br/>
                        Application is made for payment, as shown below, in connection with the Contract. information and belief the <br/>
                        Work covered by this Application for Payment has been <br/>
                        Continuation Sheet, AIA Document G703, is attached. completed in accordance with the Contract Documents, <br/>
                        that all amounts have been paid by <br/>
                        the Contractor for Work for which previous Certificates for Payment were issued and <br/>
                        payments received from the Owner, and that current payment shown herein is now due.  <br/> <br/><br/>


                        __________________________________<br/>
                        Signature & Date                                       
                    </div>
                    <div> 
                        <h3>ARCHITECT'S CERTIFICATE FOR PAYMENT</h3><br/>
                        Application is made for payment, as shown below, in connection with the Contract.<br/>
                        Continuation Sheet G703 is attached.<br/>
                        In accordance with the Contract Documents, based on on-site observations and the data comprising this<br/>
                        application, The Architect certifies to the Owner that to the best of the Architects knowledge,<br/>
                        information and belief the Work has progressed as indicated the Quality of the work is in accordance<br/>
                        with the Contract documents and the Contractor is entitled to payment of the AMOUNT CERTIFIED<br/><br/>
                        <h4>AMOUNT CERTIFIED............................................................................................................$_____________________</h4><br/>
                        (Attach explanation if amount certified differs from the amount applied. Initial all figures on this<br/>
                        Application and on the Continuation Sheet that are charged to conform with the amount certified)      <br/>   <br/>

                        ARCHITECT:<br/> <br/>
                        By:_______________________________________________Date:_____________ <br/>
                        This Certificate is not negotiable. The AMOUNT CERTIFIED is payable only to the <br/>
                        Contractor named herein. Issuance, payment and acceptance of payment are without prejudice <br/>
                        to any of the rights of the Owner or Contractor under this contract. 


                    </div> 
                </div> 
            </div>

        </Page>
    )






        

        
    }

    const doc = () => {
        return(
        <PDFViewer showToolbar={true} height={800} width={1600}>
        <Document>
            {page_g702()}
          <Page size="A4" style={styles.page} orientation="landscape">
            <View style={styles.section}>
              <Text>Hey there </Text> 
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
          <Page size="A4" style={styles.page} orientation="landscape">
            <View style={styles.section}>
              <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
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

            
            
            PROJECT ID: {id} <br/> 
            PAY APP ID: {app_id}
            
        </div>
    )
}

export default Pay_app_viewer
