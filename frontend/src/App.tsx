import {Routes,Route} from "react-router-dom";
import Home from './components/home';
import ShowBlog from "./components/ShowBlog/page";
import RichEditor from "./components/Editor.tsx";
import BlogForm from  './components/blogForm';
import ShowDrafts from './components/showDrafts';
import { useRecoilState} from "recoil";
import SignIn from './components/sign-in/SignIn.tsx';
import SignUp from './components/sign-up/SignUp.tsx';
import NavBar from './components/NavBar/page.tsx'
import { profileAtom } from './components/atoms.ts';
import { useEffect } from "react";
import axios from 'axios';
export interface profileProps {
    id: string;
    username: string;
    email:string;
}
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});
const ProfileComponent=()=>{
    return (
        <div></div>
    )
}
function App() {
    const [profile,setProfile]=useRecoilState(profileAtom);
    console.log("profile",profile); 
    const checkAuth=async()=>{
        const response=await api.get('/auth/check');
        console.log(response);
        setProfile(response.data.profile);
    }
    useEffect(()=>{
        checkAuth();
    },[]);
    return (
        <>
      <NavBar ProfileComponent={ProfileComponent} />
      <div style={{paddingTop: '7rem'}}>
          
          <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path="/blogform" element={<BlogForm />} />
                  <Route path="/users/draft/:id" element={<RichEditor />} />
                  <Route path="/posts/:id" element={<ShowBlog />} />
                  <Route path="/showdrafts" element={<ShowDrafts />} />
                  <Route path="/drafts/:id" element={<RichEditor />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
              </Routes>
          </div>
      </>
  )
}



export default App
