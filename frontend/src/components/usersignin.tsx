import {useEffect} from "react";
export default function UserSignIn(){
    useEffect(()=>{
        const handleSignin=()=>{
            window.location.href='http://localhost:3000/user/auth/google';
        }
        handleSignin();
    },[]);
    return (<></>);
}




