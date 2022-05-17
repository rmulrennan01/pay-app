import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';

import Navbar from './Navbar.js'; 

//Pages
import Job_setup from './Job_setup.js'; 
import Pay_app from './Pay_app.js'; 
import Home from './Home.js'; 
import Contract_browser from './Contract_browser.js'; 
import Contract_page from './Contract_page.js'; 



function App() {

  /*
  dynamic routing 
  <Route path='Furniture/:id' element={<Product_page />} />
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
        <Route path='contract/:id' element={<Contract_page />} />
        

      </Routes>
      </BrowserRouter>
    
    
    
    
    
    </div> 

  );
}

export default App;
