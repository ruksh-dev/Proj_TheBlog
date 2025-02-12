import React from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./Header.css";
import sun_icon from "./assets/sun.png";
import moon_icon from "./assets/moon.png";
import { useRecoilState } from "recoil";
import { profileAtom } from "../atoms";
const user_signin_path='http://localhost:3000/user/auth/google';
const admin_signin_path='http://localhost:3000/admin/auth/google';
const logout_path='http://localhost:3000/logout';
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});
export const Header: React.FC = () => {
  const [profile,setProfile]=useRecoilState(profileAtom);
    const navigate=useNavigate();
    const handleLogout=async()=>{
      try{
      const response=await api.get('/logout');
      console.log(response);
      setProfile(null);
      }catch(err){
        console.log(err);
      }
    }
  return (
    <header className="header">
      <nav className="navbar">
      {profile?(
          <div className="menu">
              <button className='menu-btn' onClick={()=>{navigate('/')}}>Home</button>
              <button className="menu-btn" onClick={()=>{navigate('/blogform')}}>Create</button>
              <button className="menu-btn" onClick={()=>{navigate('/showdrafts')}}>Drafts</button>
              <button className="menu-btn" onClick={handleLogout}>Logout</button>
          <button className="menu-btn">Newsletter</button>
      </div>
  ):(
      <div className='menu'>
          <button className='menu-btn' onClick={()=>{navigate('/')}}>Home</button>
          <button className="menu-btn" onClick={()=>navigate('/signin')}>User Signin</button>
          <button className="menu-btn" onClick={()=>{window.location.href=`${admin_signin_path}`}}>Admin Signin</button>
          <button className="menu-btn">About</button>
          <button className="menu-btn">Newsletter</button>
      </div>
            )} 
          <div className="toggle-mode">
            <img src={sun_icon} alt="Sun Icon" />
            <img src={moon_icon} alt="Moon Icon" />
          </div>
      </nav>
        <div className='navbar-bottom'></div>
    </header>
  );
};
