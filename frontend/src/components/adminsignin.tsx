import {useEffect} from 'react';
export default function AdminSignin(){
    useEffect(()=>{
        const handleSignin=async ()=>{
           window.location.href='http://localhost:3000/admin/auth/google'; 
        };
        handleSignin();
    },[]);
    return (<></>);
}
