import React from 'react'
import { BarChart, BarSeries, Bar } from 'reaviz';


function Bar_chart(props) {

 
 
    
    const data=[
        { key: 'DLP', data: 13 },
        { key: 'SIEM', data: 2 },
        { key: 'Endpoint', data: 7 },
        { key: 'Extra', data: 17 }
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
