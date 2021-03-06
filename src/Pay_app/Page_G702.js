import React, {useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';

import './Page_G702.css'; 

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';

import Button from '@mui/material/Button';
import CurrencyFormat from 'react-currency-format';



function Page_G702(props) {
    //const [total_earned, set_total_earned] = useState(0); 
    const [content, set_content] = useState(
       { 
           base_contract:props.contract_info.base_contract_value,
           co_total:props.contract_info.co_value, 
           total_contract:Number(props.contract_info.base_contract_value)+Number(props.contract_info.co_value),
           completed:Number(props.this_draw_total)+Number(props.prev_draws_total), 
           space:null,
           retention:(Number(props.this_draw_total)+Number(props.prev_draws_total))*.05, 
           earned:Number(props.this_draw_total)+Number(props.prev_draws_total)-(Number(props.this_draw_total)+Number(props.prev_draws_total))*.05,
           prev_pay: props.prev_draws_total*.95,
           due:Number(props.this_draw_total)+Number(props.prev_draws_total)-(Number(props.this_draw_total)+Number(props.prev_draws_total))*.05-props.prev_draws_total*.95, 
           balance: props.balance

        }
    );

    

    const content_keys = ["base_contract","co_total","total_contract", "completed", "space", "retention", "earned", "prev_pay", "due","balance"]

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

    const table_headers = ["CHANGE ORDER SUMMARY", "ADDITIONS", "DEDUCTIONS"]; 

 
    const [co_adds, set_co_adds] = useState([]); 
    const [co_deducts, set_co_deducts] = useState([]); 
    
    useEffect(() => {
        let prev_co_add = 0; 
        let prev_co_deduct = 0; 
        let cur_co_add = 0; 
        let cur_co_deduct = 0; 
        

        props.sov.map((cost_item)=>{
            if(cost_item.change_orders){
                cost_item.change_orders.map((co)=>{
                    //get cur month co additions
                    if(co.value>0 && co.pay_app>props.contract_info.app_count){
                        cur_co_add += Number(co.value);
                    }
                    //get cur month co deducts
                    else if(co.value<0 && co.pay_app>props.contract_info.app_count){
                        cur_co_deduct += Number(co.value)*-1;
                    }
                    //get prev month co additions
                    else if(co.value>0 && co.pay_app<=props.contract_info.app_count){
                        prev_co_add += Number(co.value);
                    }
                    //get prev month co deducts
                    else if(co.value<0 && co.pay_app<=props.contract_info.app_count){
                        prev_co_deduct += Number(co.value)*-1;
                    }

                }
                );
            } 
        } 
        )
        set_co_adds([prev_co_add, cur_co_add, Number(prev_co_add)+Number(cur_co_add)]); 
        set_co_deducts([prev_co_deduct, cur_co_deduct, Number(prev_co_deduct)+Number(cur_co_deduct)]);


        
    }, [])


    const build_table_body = (item,index) => {
        return(
            <TableRow>
                <TableCell>
                    {item}
                </TableCell>
                <TableCell>
                    
                    <CurrencyFormat 
                        value={co_adds[index]}
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                </TableCell>
                <TableCell>
                    <CurrencyFormat 
                        value={co_deducts[index]}
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                    
                </TableCell>
            </TableRow>


        )
    }

    /*
    const get_input_total = () => {
        let temp = 0; 
        let temp_arry = content; 
        props.saved_inputs.map((item) => temp += Number(item)); 
        temp_arry['completed']= Number(temp_arry['completed'])+Number(temp); 
        set_content(temp_arry); 
        console.log(content); 
        
        console.log("total earned: ", temp); 
    }
    */

    const build_table_cell = (item,index) =>{
        if(content[item]==null){
            return(
                <TableRow>
                    <TableCell>
                        {summary_rows[index]}
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                </TableRow>
    
            )
        }

        return(
            <TableRow>
                <TableCell>
                    {summary_rows[index]}
                </TableCell>
                <TableCell align='right'>
                    <CurrencyFormat value={content[item]} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                </TableCell>
            </TableRow>
        )

    }


    //contract_info={contract_info} owner_info={owner_info} sov={sov} prev_draws={prev_draws} co_sums={co_sums} balance={balance}
    return (
        <div className="page_G702">
            {console.log(props.contract_info)}
            <div className="page_G702__top">
                <Paper className="page_G702__top__child">
                    <h4>To Owner:</h4>
                    {props.owner_info.address_01+" "+props.owner_info.address_02}<br/>
                    {props.owner_info.city + ", " + props.owner_info.state + " " + props.owner_info.zip}
                    <h4>From Contractor:</h4>
                    {props.owner_info.address_01+" "+props.owner_info.address_02}<br/>
                    {props.owner_info.city + ", " + props.owner_info.state + " " + props.owner_info.zip}
                </Paper>
                <Paper className="page_G702__top__child">
                    <h4>Project:</h4>
                    {props.contract_info.name}<br/>
                    {props.contract_info.address_01+" "+props.contract_info.address_02}<br/>
                    {props.contract_info.city + ", " + props.contract_info.state + " " + props.contract_info.zip}
                    
                </Paper>
                <Paper className="page_G702__top__child">
                    <h4>Application #: {props.contract_info.app_count}</h4>
                    <h4>Period To:</h4>

                    <h4>Contract Date:</h4>

                    <h4>Contract ID:</h4>

                </Paper>

                <Paper className="page_G702__top__child"> 
                    <h4> Distribution to: </h4>
                    [_] Owner:                   <br/>
                    [_] Architect:              <br/>
                    [X] General Contractor:      <br/>
                    [_] Owners Representative:   <br/>
                </Paper>
            </div> 
            <div className="page_G702__middle">
                <div className="page_G702__middle__child">


                    <Paper>
                        <div>
                            <h2>CONTRACTOR'S APPLICATION FOR PAYMENT</h2>
                            <h4>Application is made for payment, as shown below, in connection with the Contract. <br/> 
                                Continuation Sheet G703 is attached. 
                            </h4> 

                        </div>
                        <div>
                            <Table size='small'>
                                {content_keys.map(build_table_cell)}
                            </Table>
                        </div>
                        <Table>
                            <TableBody>
                                <TableRow>

                                </TableRow>
                            </TableBody>
                        </Table>


                    </Paper>
                    <Paper>
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

                    </Paper>
                </div> 
                <div className="page_G702__middle__child">
                    <Paper> 
                        The undersigned Contractor certifies that to the best of the Contractor's knowledge, <br/>
                        Application is made for payment, as shown below, in connection with the Contract. information and belief the <br/>
                        Work covered by this Application for Payment has been <br/>
                        Continuation Sheet, AIA Document G703, is attached. completed in accordance with the Contract Documents, <br/>
                        that all amounts have been paid by <br/>
                        the Contractor for Work for which previous Certificates for Payment were issued and <br/>
                        payments received from the Owner, and that current payment shown herein is now due.  <br/> <br/><br/>


                        __________________________________<br/>
                        Signature & Date                                       
                    </Paper>
                    <Paper> 
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


                    </Paper> 
                </div> 
            </div>

        </div>
    )
}

export default Page_G702
