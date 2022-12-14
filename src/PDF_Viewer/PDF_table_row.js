import React, {Fragment} from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';


function PDF_table_row(props) {
    const styles = StyleSheet.create({
        row: {
          flexDirection: "row",
          alignItems: "center",
        },

        cell_content: {
            
       
        }
        
    });

    const build_rows = (item,index) => {
        return (
            <View style={styles.row} key={index+"row"}>
                {item.map((cell,ind)=>{
                    return(
                    <Text style={styles.cell_content, {width:props.column_width[ind]}, {border:props.border}} key={index+cell}>
                        
                        {cell}
                        
                    </Text> )
                }
                )} 

            </View>
        );

    };


    return (
        <View>
         
            {props.cell_data.map(build_rows)}
        </View>
        
    )
}

export default PDF_table_row
