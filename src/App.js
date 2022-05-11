import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';

import Navbar from './Navbar.js'; 

//Pages
import Job_setup from './Job_setup.js'; 
import Pay_app from './Pay_app.js'; 
import Home from './Home.js'; 
import Contract_browser from './Contract_browser.js'; 



function App() {

  /*
  dynamic routing 
  <Route path='Furniture/:id' element={<Product_page />} />
  */

  /*Data Structure

  contracts [id]
  ->name
  ->address_01
  ->address_02
  ->city
  ->state
  ->zip
  ->retention
  ->due_date
  ->contract_date
  ->owner_id //for reference
  ->pay_apps //array of id's
  ->sov
  -->cost_code
  -->description
  -->value
  -->change_orders


  owners [id]
  ->name
  ->address_01
  ->address_02
  ->city
  ->state
  ->zip

  pay_apps
  ->submission_date
  ->period_ending
  ->previous_app //id of previous app
  ->number
  ->draws
  -->value
  -->sov_id
  ->change_orders
  -->description
  -->value
  -->sov_id
  -->note


  */


  return (
    <div>
      <Navbar /> 
    
      <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contract_browser" element={<Contract_browser /> } /> 
        <Route path="/job_setup" element={<Job_setup />} />
        <Route path="/pay_app" element={<Pay_app /> } /> 
        <Route path="*" element={<Job_setup />} /> 
        

      </Routes>
      </BrowserRouter>
    
    
    
    
    
    </div> 

  );
}

export default App;
