import React, {useState} from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { BorderColor } from '@material-ui/icons';
import CurrencyFormat from 'react-currency-format';

function Pay_app_viewer_g703(props) {
    const [line_items, set_line_items] = useState(props.line_items); 
    const column_widths = [60,60,100,60,60,60,60,60,60,60,60,60];
    const type = ["txt","txt","txt","$","$","$","$","$","$","%","$","$"] ;
    const row_height= 20; 
    const header_row_height = 50; 
    const table_headers = ['COST CODE','ITEM NO','DESCRIPTION OF WORK','SCHEDULED VALUE',"BUDGET ADJUSTMENTS & CO'S",'REVISED SCHEDULED VALUES',
    'FROM PREVIOUS APPLICATION (D+E)','THIS PERIOD','TOTAL COMPLETED AND STORED TO DATE','%','BALANCE TO FINISH','RETAINAGE'];
    const column_labels = ['A','B','C','D','E','F','G','H','J','K','L','M'];


    const styles = StyleSheet.create({
        page: {
            flexDirection:'column',
            backgroundColor: '#ffffff',
            margin: 10
        },
        table:{
            flexWrap: "wrap",
            flexDirection: "row"
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
          }
    }); 

    //RETURNS FORMATTED CURRENCY
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


    //HELPER FUNCTION TO FORMAT EACH TABLE CELL. REDUCES AMOUNT OF REPEAT CODE.
    const cell_format = (item, type, cell_width, cell_height) =>{
        switch(type){
            case "txt":
                return  <Text style={[{fontSize:8},{border:1}, {width:cell_width},{height:cell_height}]}>{item} </Text>
            case "$":
                return <Text style={[{fontSize:8},{border:1}, {width:cell_width},{height:cell_height}]}>{currency(item)} </Text>
            case "%":
                return <Text style={[{fontSize:8},{border:1}, {width:cell_width},{height:cell_height}]}>{parseFloat(item).toFixed(2) + "%"}</Text>
            default:
                return <Text style={[{fontSize:8},{border:1}, {width:cell_width},{height:cell_height}]}> </Text>
        }
    }


    //BUILD CELLS FOR G703 TABLE
    const build_table_body = (item,index) => {
        let completed = Number(item.prev_draws)+Number(item.cur_draw); 
        return (
            <View style={[styles.row]} key={index+"row"}> 
                {cell_format(item.cost_code,type[0], column_widths[0], row_height)}
                {cell_format(index+1,type[1], column_widths[1], row_height)}
                {cell_format(item.description,type[2], column_widths[2], row_height)}
                {cell_format(item.value,type[3], column_widths[3], row_height)}
                {cell_format(Number(item.co_prev)+Number(item.co_cur),type[4], column_widths[4], row_height)}
                {cell_format(item.revised_value,type[5], column_widths[5], row_height)}
                {cell_format(item.prev_draws,type[6], column_widths[6], row_height)}
                {cell_format(item.cur_draw,type[7], column_widths[7], row_height)}
                {cell_format(completed,type[8], column_widths[8], row_height)}
                {cell_format(Number(completed)/Number(item.revised_value)*100,type[9], column_widths[9], row_height)}
                {cell_format(item.balance,type[10], column_widths[10], row_height)}
                {cell_format(item.retention,type[11], column_widths[11], row_height)}
            </View> 
        )
    }

 

    //BUILD HEADER TITLES FOR G703 TABLE
    const build_table_headers = (data) => {
        return (
            <View style={[styles.row]} > 
                {data.map((item,index) => {
                    return cell_format(item, "txt", column_widths[index], header_row_height)
                })}
            </View> 

        ); 
    }


    
    
    //BUILD FOOTER TOTALS FOR G703 TABLE
    const build_table_footer = () => {
        let totals = props.line_item_totals; 
        let completed = Number(totals.prev_draws)+Number(totals.cur_draw);
        let percent = Number(completed)/Number(totals.revised_value) *100; 
        return(
            <View style={[styles.row]} > 
                {cell_format("",type[0], column_widths[0], row_height)}
                {cell_format("",type[1], column_widths[1], row_height)}
                {cell_format('GRAND TOTALS',type[2], column_widths[2], row_height)}
                {cell_format(totals.value, type[3], column_widths[3], row_height)}
                {cell_format(totals.co_cur+totals.co_prev,type[4], column_widths[4], row_height)}
                {cell_format(totals.revised_value,type[5], column_widths[5], row_height)}
                {cell_format(totals.prev_draws,type[6], column_widths[6], row_height)}
                {cell_format(totals.cur_draw,type[7], column_widths[7], row_height)}
                {cell_format(completed,type[8], column_widths[8], row_height)}
                {cell_format(percent,type[9], column_widths[9], row_height)}
                {cell_format(totals.balance,type[10], column_widths[10], row_height)}
                {cell_format(totals.retention,type[11], column_widths[11], row_height)}
            </View> 
        )
    }

  
    return (
        <Page size="A4" style={styles.page} orientation="landscape">
            <View style={[{height:50},{flexDirection:"row"}]}>
                <Text>CONTINUATION SHEET</Text>
            </View>
            <View style={[{height:125},{flexDirection:"row"}]}>
                
                <View style={[{flexDirection:'column'}]}>
                    <Text style={[{fontSize:8}]}>In tabulations below, amounts are stated to be the nearest dollar.</Text>
                    <Text style={[{fontSize:8}]}>Use Column I on the Contracts wehre variable retainage for line items may apply</Text>
                </View>
                <View style={[{width:300}]}>

                </View>
                <View style={[{width:200},{flexDirection:'column'}]}>
                    <Text style={[{fontSize:10}]}>Application #</Text>
                    <Text style={[{fontSize:10}]}>Application Date:</Text>
                    <Text style={[{fontSize:10}]}>Period To:</Text>
                </View>
                <View style={[{width:200},{flexDirection:'column'}]}>
                    <Text style={[{fontSize:10}]}>{props.app_id}</Text>
                    <Text style={[{fontSize:10}]}>TODO</Text>
                    <Text style={[{fontSize:10}]}>TODO</Text>
                </View>

            </View>
            <View>
                {build_table_headers(column_labels)}
                {build_table_headers(table_headers)}
                {line_items.map(build_table_body)}
                {build_table_footer()}
               
            </View>
        </Page> 

    )
}

export default Pay_app_viewer_g703
