
//This returns the total of all values matched to a specific key in a list of json objects
const Totals_by_key = (obj_list, key) => {
    let total = Number(0); 
    let total_list = {};

    //CASE FOR WHEN THE KEY PROVIDED IS JUST ONE KEY REPRESENTED BY A STRING
    if(typeof(key)== 'string' && key!=='*'){
        for (let i = 0; i<obj_list.length; i++){
            let temp_obj = obj_list[i]; 
            if(temp_obj.hasOwnProperty(key)){
                total += Number(temp_obj[key]);
                
            }
        }

        return total; 
    }

    //CASE FOR WHEN THE KEY PROVIDED IS A LIST OF MULTIPLE KEYS REPRESENTED BY A STRING
    if(typeof(key) == 'string' && key === '*'){
        let key_list = Object.keys(obj_list[0]); //GET ALL KEYS
        for (let i = 0; i<obj_list.length; i++){
            let temp_obj = obj_list[i]; 
                for (let k=0; k<key_list.length; k++){
                    let temp_key = key_list[k]; 
                    //console.log("TEMP_KEY", temp_key); 
                    if(total_list.hasOwnProperty(temp_key)){
                        total_list[temp_key] += Number(temp_obj[temp_key]);
                    }
                    else{
                        total_list[temp_key] = Number(temp_obj[temp_key]);
                    }
                }              
            
        }
        return total_list;
    }


}


export default Totals_by_key; 