import {useEffect, useState} from 'react';
import axios from 'axios';
import {draftType,draftAtom} from './atoms';
import {useRecoilState} from 'recoil';
import {Link} from 'react-router-dom';
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});



const Draft:React.FC<draftType>=(draft)=> {
    return (
        <Link to={`/drafts/${draft.id}`}>
        <div className='draft'>
            <div className='draft-title'><h1>{draft.title}</h1></div>
            <div className='draft-author'><strong>{draft.author}</strong></div>
            <div className='draft-description'><p>{draft.description}</p></div>
            <div className='draft-tags'>
                {draft.tags.map((tag:string,index:number)=>(
                    <div key={index}>{tag}</div>
                ))}
            </div>
        </div>
        </Link>
    );
}

export default function ShowDrafts() {
    const [drafts,setDrafts]=useRecoilState(draftAtom);
    console.log(drafts);
    useEffect(()=>{
        const getDrafts=async ()=>{
            try{
                const response:any=await api.get('/user/showdrafts');
                setDrafts(response.data.post);
            }catch(err){
                console.error(err);
            }
        }
        getDrafts();
    },[]);
    
    return (
         <div className='showdrafts'>
           {drafts?.map((draft: draftType)=>( 
                 <Draft key={draft.id} {...draft} /> 
             ))} 
         </div> 
    );
}


