import React from 'react';
import {useParams} from "react-router-dom";


function Pay_app_viewer() {
    const {id, app_id} = useParams();
    console.log(id); 
    console.log(app_id); 
    return (
        <div>
            My Dudes!
        </div>
    )
}

export default Pay_app_viewer
