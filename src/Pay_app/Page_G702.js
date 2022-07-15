import React, {useState} from 'react';
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


function Page_G702(props) {
    const [content, setContent] = useState(
       [{ 
           base_contract:0,
           co_total:0, 
           total_contract:0,
           completed:0, 
           space:"",
           retention:0, 
           earned:0,
           prev_pay:0,
           due:0,
           balance:0

        }]
    );

    const table_rows =
        [
            "Total changes approved in previous months by Contractor", 
            "Total approved this Month", 
            "Totals", 
            "Net Changes by Change Order"
        ]; 

    const table_headers = ["CHANGE ORDER SUMMARY", "ADDITIONS", "DEDUCTIONS"]; 



    const build_table_body = (item,index) => {
        return(
            <TableRow>
                <TableCell>
                    {item}
                </TableCell>
                <TableCell>
                    {index}
                </TableCell>
                <TableCell>
                    {index}
                </TableCell>
            </TableRow>


        )

    }



    return (
        <div className="page_G702">
            <div className="page_G702__top">
                <Paper className="page_G702__top__child">
                    <h4>To Owner:</h4>

                    <h4>From Contractor:</h4>
                    
                </Paper>
                <Paper className="page_G702__top__child">
                    <h4>Project:</h4>
                    
                </Paper>
                <Paper className="page_G702__top__child">
                    <h4>Application #:</h4>
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
                            1. Original Contract Sum <br/>
                            2. Net Change by Change Orders <br/> 
                            3. Contract Sum to Date <br/> 
                            4. Total Completed & Stored to date (Column G) <br/>
                            5. Retainage: <br/>
                                <div style={{ color: 'blue', marginLeft: 25 }}> a. 5% of Completed Work: ____TODO____ </div> 
                                
                            6. Total Earned Less Retainage <br/> 
                            7. Less Previous Certificates for Payment (Line 6 from prior Certificate) <br/>
                            8. Current Payment Due <br/>
                            9. Balance to Finish including Retaingage <br/><br/><br/><br/>
                        </div>
                        <div>
                            <Table>
                                {/*content.map((item)=><TableRow><TableCell>item</TableCell></TableRow>)*/}
                            </Table>
                        </div>


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
