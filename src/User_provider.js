import React, {useState, useEffect,  createContext} from "react";
import { auth } from "./Firebase.js"
export const UserContext = createContext({user: null})
export default (props) => {
  const [user, setuser] = useState(null)
  useEffect(() => {
auth.onAuthStateChanged(async (user) => {
    if(user == null){
        setuser(null);
    }
    else{
        let { displayName, email }  = user;
        setuser({
            displayName,
            email
    })}
})
  },[])
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  )
}
