import { useState } from "react";
import ProfileCard from "./ProfileCard/page";

const ProfileComp=()=>{
    const [open,setOpen]=useState<boolean>(false);
    const handleToggle=()=>{
        setOpen(!open)
    }
    return (
        <div className="relative">
        <div className={`w-22 h-12 flex rounded-full ${open?'bg-sky-300':'bg-gray-100'} items-center justify-around shadow-lg`} onClick={handleToggle}>
            <div className="flex items-center justify-center" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            </div>
            <div className="flex items-center justify-center">
                {!open?
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>}
            </div>
        </div>
        {open && <ProfileCard />}
        </div>
    )
}
export default ProfileComp;