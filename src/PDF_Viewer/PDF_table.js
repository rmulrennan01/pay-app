import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDF_table_row from './PDF_table_row.js'; 

function PDF_table(props) {
    const styles = StyleSheet.create({
        table:{
            flexWrap: "wrap",
            flexDirection: "row"
        }

    }
    );

    return (
        
        <View style={styles.table}>
            
            <PDF_table_row
                cell_data = {props.cell_data}
                column_width = {props.column_width}
                border = {props.border}
            />

        </View>
        
    )
}

export default PDF_table
