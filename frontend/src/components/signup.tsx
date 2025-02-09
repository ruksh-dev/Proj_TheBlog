import React, {useState} from "react"
export default function Signup(){
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [username,setUsername]=useState<string>("");
    function handleChange(event:React.ChangeEvent<HTMLInputElement>,fn:(value:string)=>void):void{
            fn(event.target.value);
    }
    function SignUpButton(){
        //send username and password to backend
        console.log(username+" "+email+" "+password);
        //code
        setEmail("");
        setUsername("");
        setPassword("");
    }
    return (<>
    <input type="text" placeholder="Enter username" name="usrname" onChange={(e)=>handleChange(e,setUsername)} />
    <input type="text" placeholder="Enter email" name="email" onChange={(e)=>handleChange(e, setEmail)} />
    <input type="password" placeholder="Enter password" name="passwd" onChange={(e)=>handleChange(e,setPassword)} />
    <button onClick={SignUpButton}>Signup</button>
</>)
}
