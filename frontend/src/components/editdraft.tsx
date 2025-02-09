import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

export default function EditDraft() {
    const { id } = useParams<{id: string}>();
    useEffect(()=>{
        const getData=async ()=>{
            try{
                const response=await api.get(`/user/showdrafts/${id}`);
                console.log(response.data);
            }catch(err){
                console.error(err);
            }
        }
        getData();
    },[id]);
    return (
        <></>
    )
}

// instructions:
// edit Editor.tsx, first make its route to: /users/draft/id
// and the use useEffect to set the editorState using converFromRaw
