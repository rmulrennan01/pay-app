
//This returns the total of all values matched to a specific key in a list of json objects
const Totals_by_key = (obj_list, key) => {
    let total = Number(0); 

    for (let i = 0; i<obj_list.length; i++){
        let temp_obj = obj_list[i]; 
        if(temp_obj.hasOwnProperty(key)){
            total += Number(temp_obj[key]);
            
        }
    }

    return total; 

}


export default Totals_by_key; 