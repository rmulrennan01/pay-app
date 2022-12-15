import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { BorderColor } from '@material-ui/icons';
import CurrencyFormat from 'react-currency-format';



function Pay_app_viewer_g702(props) {
    

        const styles = StyleSheet.create({
            page: {
                flexDirection:'column',
                backgroundColor: '#ffffff',
                margin: 10
            },
            r1: {
                flexDirection:'row',
                borderBottom: 2,
                marginTop: 20
                
            },
            r2: {
                flexDirection:'row',
                borderBottom: 2
            },
            r3: {
                flexDirection:'row',
                borderBottom: 2
            },
            r3_c1:{
                width: 400,
                flexDirection: 'col'

            },
            r3_c2:{
                width: 400,
                flexDirection: 'col',
                marginLeft: 10

            },
            r3_c1_top:{
                marginBottom:20

            },
            r3_c1_middle:{
                flexDirection: 'row'

            },
            r3_c1_bottom:{
                marginTop: 20

            },
            r3_c1_middle_left:{
                flexDirection: 'col',
                width: 400

            },
            r3_c1_middle_right:{
                flexDirection: 'col'

            },
            r2_section:{
                flexDirection:'column',
                width: 220
            },
            table_row:{
                flexDirection:'row'

            },
            table_c1:{
                border:1,
                width: 160,
                fontSize: 10

            },
            table_c2:{
                border:1,
                width: 120,
                fontSize: 10

            },
            table_c3:{
                border:1,
                width: 120,
                fontSize: 10

            },
            section: {
              margin: 10,
              padding: 10,
              flexGrow: 1
            },
            content: {
                fontSize: 10,
                fontWeight: "light"
            },
            header: {
                fontWeight: "extrabold",
                fontSize: 14,
                marginBottom: 3,
                marginTop: 3
                
            }

        });

        /*
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


        ​​
            balance: 9643.100000000006
            ​​base_contract: 37100
            change_orders: 14000
            payment: 30495
            previous_payments: 26802
            retention: 0
            ​​revised_contract: 65600
            this_draw: 32100
        */
    

    //function for formatting values to display on the pay app
    const currency = (val) =>{
        return(
            <CurrencyFormat 
            value={val}
            displayType={'text'} 
            thousandSeparator={true} 
            prefix={'$'} 
            fixedDecimalScale={true} 
            decimalScale={2}
            renderText={value => <>{value}</>} 
            />
            

        )
    }

    return (
        <Page size="A4" style={styles.page} orientation="landscape">
         
            <View style={styles.r1}>
                <Text style={{fontSize:14}}> APPLICATION FOR PAYMENT</Text>
            </View>
            <View style={styles.r2}>
                <View style={styles.r2_section}>
                    <Text style={styles.content}> TO OWNER: </Text>
                    <Text style={styles.content}> {props.owner_info.address_01+" "+props.owner_info.address_02}</Text>
                    <Text style={styles.content}> {props.owner_info.city + ", " + props.owner_info.state + " " + props.owner_info.zip}</Text>
                    <Text style={[styles.content, {marginTop:12}]}> FROM CONTRACTOR: </Text>
                    <Text style={styles.content}> {props.owner_info.address_01+" "+props.owner_info.address_02}</Text>
                    <Text style={styles.content}> {props.owner_info.city + ", " + props.owner_info.state + " " + props.owner_info.zip}</Text>
                </View> 
                <View style={styles.r2_section}>
                    <Text style={styles.content}> PROJECT ADDRESS: </Text>
                    <Text style={styles.content}> TODO</Text>
                    <Text style={styles.content}> TODO</Text>
                    <Text style={styles.content}> TODO</Text>
                </View> 
                <View style={styles.r2_section}>
                    <Text style={styles.content}> APPLICATION NO: {props.app_id}</Text>
                    <Text style={styles.content}> PERIOD TO: </Text>
                    <Text style={styles.content}> CONTRACT FOR: </Text>
                    <Text style={styles.content}> CONTRACT DATE: </Text>
                    <Text style={styles.content}> PROJECT NO: </Text>
                </View> 
                <View style={styles.r2_section}>
                    <Text style={styles.content}> DISTRIBUTION TO: </Text>
                    <Text style={styles.content}> [_] OWNER</Text>
                    <Text style={styles.content}> [_] ARCHITECT </Text>
                    <Text style={styles.content}> [X] GENERAL CONTRACTOR </Text>
                    <Text style={styles.content}> [_] OWNER REPRESENTATIVE</Text>

                </View> 
            </View>
            <View style={styles.r3}>
                <View style={styles.r3_c1}>
                    <View style={styles.r3_c1_top}>
                        <Text style={styles.content}>CONTRACTOR'S APPLICATION FOR PAYMENT</Text>
                        <Text style={[styles.content, {flexWrap:"wrap"}]}> Application is made for payment, as shown below, in connection with the Contract. Continuation Sheet G703 is attached. </Text>
                    </View>
                    <View style={styles.r3_c1_middle}>
                        <View style={styles.r3_c1_middle_left}>
                            <Text style={styles.content}>1. Original Contract Sum</Text>
                            <Text style={styles.content}>2. Net change by Change Orders</Text>
                            <Text style={styles.content}>3. Contract Sum to Date</Text>
                            <Text style={styles.content}>4. Total Completed & Stored to Date</Text>
                            <Text style={styles.content}>5a. Retainage (%)</Text>
                            <Text style={styles.content}>5b. Retainage ($)</Text>
                            <Text style={styles.content}>6. Total Earned Less Retainage</Text>
                            <Text style={[styles.content, {marginLeft:10}]}>   (Line 4 Less Line 5 Total)</Text>
                            <Text style={styles.content}>7. Less Previous Certificates for Payment</Text>
                            <Text style={[styles.content, {marginLeft:10}]}>   (Line 6 from Prior Certificate)</Text>
                            <Text style={styles.content}>8. Current Payment Due</Text>
                            <Text style={styles.content}>9. Balance to Finish including Retainage</Text>
                            <Text style={[styles.content, {marginLeft:10}]}>   (Line 3 less 6)</Text>


                        </View>
                        <View style={styles.r3_c1_middle_right}>
                            {console.log(props.draw_info)}
                            <Text style={styles.content}>{currency(props.draw_info.base_contract)}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.change_orders)}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.revised_contract)}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.this_draw+props.draw_info.previous_payments)}</Text>
                            <Text style={styles.content}>{props.draw_info.retention}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.ret_cur+props.draw_info.ret_prev)}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.this_draw+props.draw_info.previous_payments-props.draw_info.ret_cur-props.draw_info.ret_prev)} </Text>
                            <Text style={styles.content}>{" "}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.previous_payments-props.draw_info.ret_prev)} </Text>
                            <Text style={styles.content}>{" "}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.payment)}</Text>
                            <Text style={styles.content}>{currency(props.draw_info.revised_contract- props.draw_info.this_draw -props.draw_info.previous_payments + props.draw_info.ret_cur+props.draw_info.ret_prev)}</Text>

                        </View>

                    </View>
                    <View style={styles.r3_c1_bottom}>
                        <View style={styles.table_row}>
                            <Text style={styles.table_c1}> CHANGE ORDER SUMMARY</Text>
                            <Text style={styles.table_c2}> ADDITIONS </Text>
                            <Text style={styles.table_c3}> DEDUCTIONS </Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={styles.table_c1}> Total changes approved in previous months by Contractor</Text>
                            <Text style={styles.table_c2}> $ </Text>
                            <Text style={styles.table_c3}> $ </Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={styles.table_c1}> Total approved this Month</Text>
                            <Text style={styles.table_c2}> $ </Text>
                            <Text style={styles.table_c3}> $ </Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={styles.table_c1}> Totals</Text>
                            <Text style={styles.table_c2}> $ </Text>
                            <Text style={styles.table_c3}> $ </Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={styles.table_c1}> Net Changes by Change Orders</Text>
                            <Text style={styles.table_c2}> $ </Text>
                            <Text style={styles.table_c3}> $ </Text>
                        </View>

                    </View>

                </View>
                
                <View style={styles.r3_c2}>
                    <Text style={{fontSize:8, marginBottom:20}}> 
                        The undersigned Contractor certifies that to the best of the Contractor's knowledge,
                        Application is made for payment, as shown below, in connection with the Contract. information and belief the
                        Work covered by this Application for Payment has been
                        Continuation Sheet, AIA Document G703, is attached. completed in accordance with the Contract Documents,
                        that all amounts have been paid by
                        the Contractor for Work for which previous Certificates for Payment were issued and
                        payments received from the Owner, and that current payment shown herein is now due.
                    </Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:10, borderTop:1, width: 200, marginRight:50}}> Signature </Text>
                        <Text style={{fontSize:10, borderTop:1, width: 100}}> Date </Text>
                    </View>
                    <Text style={{fontSize:12, marginTop:20}}>
                        ARCHITECT'S CERTIFICATE FOR PAYMENT  
                    </Text>
                    <Text style={{fontSize:10}}>
                        Application is made for payment, as shown below, in connection with the Contract.
                        Total Retainage (Lines 5a + 5b or Continuation Sheet G703 is attached. 
                    </Text>
                    <Text style={{fontSize:10}}>
                        In accordance with the Contract Documents, based on on-site observations and the data comprising this
                        application, The Architect certifies to the Owner that to the best of the Architects knowledge,
                        information and belief the Work has progressed as indicated the Quality of the work is in accordance
                        with the Contract documents and the Contractor is entitled to payment of the AMOUNT CERTIFIED
                    </Text>
                    <Text style={{fontSize:12, marginTop:20}}>
                        AMOUNT CERTIFIED............................................$XXXX.XX  
                    </Text>
                    <Text style={{fontSize:10}}>
                        (Attach explanation if amount cerfied differs from the amount applied. Initial all figures on this Application and
                        on the Continuation Sheet that are charged to conform with the amount certified)
                    </Text>
                    
                    <Text style={{fontSize:12, marginTop:20}}>Architect:        </Text>
                    
                    <Text style={{fontSize:12, marginTop:20}}>By:_________________________________ Date:____________ </Text>
                    <Text style={{fontSize:10, marginTop:10}}>
                        This Certificate is not negotiable. The AMOUNT CERTIFIED is payable only to the Contractor named herein. Issurance, payment
                        and acceptance of payment are without prejudice to any of the rights of the Owner or Contractor under this contract. 
                    </Text>
                </View>
            </View>




        </Page>
    )
}

export default Pay_app_viewer_g702
