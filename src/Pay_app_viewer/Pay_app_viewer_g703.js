import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { BorderColor } from '@material-ui/icons';
import CurrencyFormat from 'react-currency-format';

function Pay_app_viewer_g703(props) {
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

 


    const build_rows = (data,text,row_height) =>{
        let column_widths = [60,100,60,60,60,60,60,60,60,60,60,60]; 
        return(
            <View style={styles.table}>
            {data.map((item,index)=>{
                return (
                    <View style={[styles.row]}>
                        {item.map((cell,indt)=>{
                            return(
                                <Text style={[{fontSize:8},{border:1}, {width:column_widths[index]},{height:row_height}]} key={indt+cell}>
                                    {text ? cell : (index==9 ? cell+'%' : cell)}
                                </Text> 
                            );
                            }
                        )} 
                    </View>
                    
                )})

            }
            </View>
        );
        }
        

    

    
    

    const build_table = (data) => {
        return(
            <View style={styles.table}>
                {build_rows(data[0])}
            </View>
        )
    }
    

   /* return (
        
        <View style={styles.table}>
            
            <PDF_table_row
                cell_data = {props.cell_data}
                column_width = {props.column_width}
                border = {props.border}
            />

        </View>
        
    )
} */
    const my_data = [[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20,21],[22,23,24],[25,26,27],[28,29,30],[31,32,33],[34,35,36]];
    const table_headers = [['CODE','ITEM NO','DESCRIPTION OF WORK','SCHEDULED VALUE',"BUDGET ADJUSTMENTS & CO'S",'REVISED SCHEDULED VALUES',
        'FROM PREVIOUS APPLICATION (D+E)','THIS PERIOD','TOTAL COMPLETED AND STORED TO DATE','%','BALANCE TO FINISH','RETAINAGE']];
    const column_labels = [['A','B','C','D','E','F','G','H','J','K','L','M']];
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
                    <Text style={[{fontSize:10}]}>TODO</Text>
                    <Text style={[{fontSize:10}]}>TODO</Text>
                    <Text style={[{fontSize:10}]}>TODO</Text>
                </View>

            </View>
            <View>
                {build_rows(column_labels,true,35)}
                {build_rows(table_headers,true,35)}
                {build_rows(props.g703_data,false,15)}
            </View>
        </Page> 

    )
}

export default Pay_app_viewer_g703
