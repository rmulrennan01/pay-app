/*Converts an SOV file into a list of JSON objects by each sov costcode with the following output
    description
    base_value
    co_prev
    co_cur
    revised_value
    prev_draws
    cur_draws
    prev_payment
    cur_payment
    retention (.05 is typical)
    balance (exluding retention)
    cost_code
*/

const Sov_item_totals = (sov, app_num, retention) => {
 
    const sov_list = []; 
    console.log("SOV inside utility", sov); 
    
    

    const build_line_items = (item,index) =>{
        let temp_line_item = {};
        temp_line_item.description = item.description;
        temp_line_item.value = item.value; 
        temp_line_item.cost_code = item.cost_code; 
        
        //Calculate total change orders for all previous and current pay periods
        if(item.hasOwnProperty("change_orders") && item.change_orders !==0){
            let prev_co = Number(0); 
            let cur_co = Number(0);
            item.change_orders.map((co) => {
                if(co.pay_app<app_num+1){ 
                    prev_co += Number(co.value); 
                }
                else if(co.pay_app===app_num+1){
                    cur_co += Number(co.value); 
                }
                temp_line_item.co_prev = prev_co; 
                temp_line_item.co_cur = cur_co; 

            })
        }
        else{
            temp_line_item.co_prev = Number(0); 
            temp_line_item.co_cur = Number(0); 
        }

        //Calculate Revised line item contract amount
        temp_line_item.revised_value = temp_line_item.value + temp_line_item.co_prev + temp_line_item.co_cur;

        //Calculate previous and current draw amount for each cost item
        if(item.hasOwnProperty("pay_apps")){
            let draws_prev = Number(0); 

            if(app_num == 0){
                temp_line_item.prev_draws = Number(0); 
                temp_line_item.cur_draw = Number(item.pay_apps[0]);

            }
            else{
                for (let i = 0; i<app_num; i++){
                    draws_prev += Number(item.pay_apps[i]);
                }
                temp_line_item.prev_draws = Number(draws_prev);
                temp_line_item.cur_draw = Number(item.pay_apps[app_num])
            }
        }
        else {
            temp_line_item.prev_draws = Number(0);
            temp_line_item.cur_draw = Number(0);
        }

        //Calculate payments
        temp_line_item.prev_payment = Number(1-retention) * Number(temp_line_item.prev_draws); 
        temp_line_item.cur_payment = Number(1-retention) * Number(temp_line_item.cur_draw)

        //Calculate retention to date
        temp_line_item.retention = Number(retention) * (Number(temp_line_item.prev_draws) + Number(temp_line_item.cur_draw)); 
        temp_line_item.balance = Number(temp_line_item.revised_value) - Number(temp_line_item.prev_draws) - Number(temp_line_item.cur_draw); 


        sov_list.push(temp_line_item); 


        
    }
    

    



    sov.map(build_line_items);
    return sov_list; 
};



export default Sov_item_totals; 