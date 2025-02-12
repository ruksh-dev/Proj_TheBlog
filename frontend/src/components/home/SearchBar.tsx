import React,{useRef} from "react";
import "./SearchBar.css";
import search_icon from "./assets/search.png";
import {useRecoilState} from 'recoil';
import {searchBarAtom} from '../atoms';
export const SearchBar: React.FC = () => {
    const [searchTerm,setSearchTerm]=useRecoilState(searchBarAtom);
    const timeoutIdRef=useRef<any>(null);
    console.log("searchTerm: "+searchTerm);
    function handleChange(event:any) {
        if(timeoutIdRef.current!=null) {
            clearTimeout(timeoutIdRef.current);
            }
         timeoutIdRef.current=setTimeout(()=>{
                setSearchTerm(event.target.value);
            },700);
    }
  return (
    <div className="search-bar">
      <img src={search_icon} alt="Search Icon" className="search-icon" />
      <input type="text" placeholder="search..." className="search-input" onChange={handleChange} />
      <div className='slash-icon'>/</div>
    </div>
  );
};
