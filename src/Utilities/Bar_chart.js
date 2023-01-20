import React from 'react'
import { BarChart, BarSeries, Bar } from 'reaviz';


function Bar_chart(props) {

    const today = new Date(); 
    const prev_mo_1 = new Date(today.getFullYear(),today.getMonth()-1);
    const prev_mo_2 = new Date(prev_mo_1.getFullYear(),prev_mo_1.getMonth()-1);
    const prev_mo_3 = new Date(prev_mo_2.getFullYear(),prev_mo_2.getMonth()-1);

    
    const data=[
        { key: prev_mo_3.toDateString().split(" ")[1], data: 52 },
        { key: prev_mo_2.toDateString().split(" ")[1], data: 7 },
        { key: prev_mo_1.toDateString().split(" ")[1], data: 20 },
        { key: today.toDateString().split(" ")[1], data: 17 },
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
