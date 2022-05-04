import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';

import Navbar from './Navbar.js'; 

//Pages
import Job_setup from './Job_setup.js'; 
import Home from './Home.js'; 



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
        <Route path="/job_setup" element={<Job_setup />} />
        <Route path="*" element={<Job_setup />} /> 

      </Routes>
      </BrowserRouter>
    
    
    
    
    
    </div> 

  );
}

export default App;
