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
import User_provider from './User_provider.js'; 
import Login from './Login.js'; 

function App() {

  /*
  dynamic routing 
  <Route path='Furniture/:id' element={<Product_page />} />
  */


  return (
    <div>
      <Navbar /> 
      <User_provider>
      <BrowserRouter> 
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/contract_browser" element={<Contract_browser /> } /> 
        <Route path="/job_setup" element={<Job_setup />} />
        <Route path="*" element={<Job_setup />} /> 
        <Route path='/contract/:id' element={<Contract_page />} />
        <Route path='/pay_app/:id' element={<Pay_app />} />
        <Route path='/pdf/:id/:app_id/:draft' element={<Pay_app_viewer />} />
        
       
        


        

      </Routes>
      </BrowserRouter>
      </User_provider>
    
    
    
    
    
    </div> 

  );
}

export default App;
