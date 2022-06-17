import React from 'react'; 
import Button from '@mui/material/Button';


function Pay_app_table(props) {
  return (
    <div>
      <Button variant="contained" onClick={()=>window.location='/pay_app/'+ String(props.id)}> Create Application </Button>


    </div>
  )
}

export default Pay_app_table