import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';

import Navbar from './Navbar.js'; 

//Pages
import Job_setup from './Job_setup.js'; 
import Pay_app from './Pay_app.js'; 
import Home from './Home.js'; 
import Contract_browser from './Contract_browser.js'; 
import Contract_page from './Contract_page.js'; 
import Pay_app_viewer from './Pay_app_viewer.js'; 
import Page_G702 from './Pay_app/Page_G702.js'; 
import Page_G703 from "./Pay_app/Page_G703.js";


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
        <Route path="*" element={<Job_setup />} /> 
        <Route path='/contract/:id' element={<Contract_page />} />
        <Route path='/pay_app/:id' element={<Pay_app />} />
        <Route path='/pdf/:id/:app_id' element={<Pay_app_viewer />} />
       
        


        

      </Routes>
      </BrowserRouter>
    
    
    
    
    
    </div> 

  );
}

export default App;
