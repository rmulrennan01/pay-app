import React, {useState} from 'react'
import { BarChart, BarSeries, Bar } from 'reaviz';


function Bar_chart(props) {

    const today = new Date(); 
    const prev_mo_1 = new Date(today.getFullYear(),today.getMonth()-1);
    const prev_mo_2 = new Date(prev_mo_1.getFullYear(),prev_mo_1.getMonth()-1);
    const prev_mo_3 = new Date(prev_mo_2.getFullYear(),prev_mo_2.getMonth()-1);

    const data2 = [];


    const app_index = [-1,-1,-1,-1];
    const dates = props.dates;
    /*
    //FIND INDEXES OF APPS THAT HAVE MATCHING DATES AS CURRENT AND PREVIOUS THREE MONTHS
    for (let i = dates.length-1; i>-1; i--){
        let temp = dates[i].toDate();
        if(temp.getMonth() == today.getMonth() && temp.getFullYear() == today.getFullYear()){
            app_index[3] = i; 
        }
        else if(temp.getMonth() == prev_mo_1.getMonth() && temp.getFullYear() == prev_mo_1.getFullYear()){
            app_index[2] = i; 
        }
        else if(temp.getMonth() == prev_mo_2.getMonth() && temp.getFullYear() == prev_mo_2.getFullYear()){
            app_index[1] = i; 
        }
        else if(temp.getMonth() == prev_mo_3.getMonth() && temp.getFullYear() == prev_mo_3.getFullYear()){
            app_index[0] = i; 
            break; 
        }
    }
    */
    
    console.log('index', app_index);

    let result = [0,0,0,0];
    for (let i = 0; i < app_index.length; i++){
        if(app_index[i] === -1){
            result.push(Number(0))
        }
        else{
            console.log(props.data[app_index[i]])
            //result.push(Number(1)); 
            result.push(Number(props.data[app_index[i]][props.key]))
        }
    }
    
    const data=[
        { key: prev_mo_3.toDateString().split(" ")[1], data: result[0] },
        { key: prev_mo_2.toDateString().split(" ")[1], data: result[1] },
        { key: prev_mo_1.toDateString().split(" ")[1], data: result[2] },
        { key: today.toDateString().split(" ")[1], data: result[3] },
      ]; 

    

    return (
      <BarChart
        width={400}
        height={350}
        data={data}
        series={
          <BarSeries
            colorScheme={'cybertron'}
            padding={0.1}
          
          />
        }
      />
    );
  
}

export default Bar_chart
