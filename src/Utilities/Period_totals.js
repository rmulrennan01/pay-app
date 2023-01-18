


const Period_totals = (base_contract, sov, app_num, retention) => {



    let temp_period = 
        {
            base_contract: Number(base_contract), 
            co: Number(0),
            revised_value: Number(0),
            prev_draws: Number(0),
            cur_draw: Number(0), 
            payment: Number(0),
            retention: Number(0),
            balance: Number(0)
            
        }; 
    temp_period.base_contract = base_contract; 
    

    //loop through each sov item
    for (let i = 0; i<sov.length; i++){
        
        let item = JSON.parse(JSON.stringify(sov[i]));; //CREATE A DEEP COPY

        //Get total of change orders for period i
        if(item.hasOwnProperty("change_orders") && item.change_orders !==0){
            let temp_co = Number(0); 
            item.change_orders.map((co) => {
                if(co.pay_app<=app_num){ 
                    temp_co += Number(co.value); 
                }
                
            })
            temp_period.co += Number(temp_co); 
            
        }
     



        //Calculate previous and current draw amount for period i
        if(item.hasOwnProperty("pay_apps")){
            let draws_prev = Number(0); 

            if(app_num === 1){
                temp_period.prev_draws += Number(0); 
                temp_period.cur_draw += Number(item.pay_apps[0]);

            }
            else{
                for (let k = 0; k<app_num-1; k++){
                    draws_prev += Number(item.pay_apps[k]);
                }
                temp_period.prev_draws += draws_prev;
                temp_period.cur_draw += Number(item.pay_apps[app_num-1])
            }
        }
   




     
    }

    //Set revsied_value
    temp_period.revised_value = Number(temp_period.base_contract) + Number(temp_period.co); 

    //Set actual payment for period
    temp_period.payment = Number(temp_period.cur_draw)*Number(1-retention); 

    //Set retention for period
    temp_period.retention = (temp_period.prev_draws + temp_period.cur_draw) * Number(retention); 

    //Set balance without retention for period
    temp_period.balance = Number(temp_period.revised_value) - Number(temp_period.prev_draws) - Number(temp_period.cur_draw); 
    
    


    return(temp_period); 


}

export default Period_totals