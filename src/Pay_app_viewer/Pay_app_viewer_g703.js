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
        column: {
            flexDirection: "column",
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

 


    const build_columns = (data,index) =>{
        let column_widths = [20,10,50,50,60,20,40,40,40,40,40,40]; 
        return(
            <View style={styles.table}>
            {data.map((item)=>{
                return (
                    <View style={styles.column}>
                        {item.map((cell,ind)=>{
                            return(
                                <Text style={[styles.cell_content, {width:column_widths[index]}, {border:1}]} key={ind+cell}>
                                    {cell}
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
                {build_columns(data[0])}
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
    
    return (
        <Page size="A4" style={styles.page} orientation="landscape">
            {build_columns(my_data)}
        
        </Page> 

    )
}

export default Pay_app_viewer_g703
