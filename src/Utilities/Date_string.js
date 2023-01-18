const Date_string = (val) =>{
        
    let temp_date = new Date; 
    if(!(val instanceof Date)){
        temp_date = new Date(val.seconds*1000); 
    }
    else{
        temp_date = val; 
    }

    return Number(temp_date.getMonth())+Number(1)+'/'+temp_date.getDate()+'/'+temp_date.getFullYear(); 

}

export default Date_string