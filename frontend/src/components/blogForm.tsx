import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {postStateAtom} from './atoms';
import {useRecoilState} from 'recoil';
import {EditorState,convertToRaw} from 'draft-js';
import './blogForm.css';
const api=axios.create({
    baseURL:'http://localhost:3000',
    withCredentials: true
});
export default function BlogForm() {
    const [postState,setPostState]=useRecoilState(postStateAtom); 
    const navigate=useNavigate();
    if(postState) navigate(`/users/draft/${postState.id}`);
    async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        try{
        event.preventDefault();
        const formData=new FormData(event.target as HTMLFormElement);
        const metaData:{[key:string]: FormDataEntryValue }= {};
        formData.forEach((value,key)=>(metaData[key]=value));
        console.log(metaData);
            // save this data to an atom, and then use this data to RichEditor component and pass it req.body when user submits the blog
        const newState=EditorState.createEmpty();
        const newContent=newState.getCurrentContent();
        const rawContent=JSON.stringify(convertToRaw(newContent));    
            const data={
                metadata: metaData,
                rawContent
            }    
        const response=await api.post('/uploadmetadata', data);
        console.log(response);
        setPostState(response.data);
        //save to atom
        navigate(`/users/draft/${response.data.id}`);
        }catch(err) {
            console.error(err);
        }
    }
    return (
        <div className='container-blogForm'>
            <form onSubmit={handleSubmit}>
            <div className='blogForm'>
                <label>
                    Title:
                </label>
                <input className='input-blogForm' type='text' name='title' required></input>
            </div>
            <div className='blogForm'>
                <label>
                    Author:
                </label>
                <input className='input-blogForm' type='text' name='author' required></input>
            </div>
            <div className='blogForm'>
                <label>
                    Description:
                </label>
                <textarea className='description-blogForm'  name='description' required></textarea>
            </div>    
            <div className='blogForm'>
                <label>
                    Tags:
                </label>
                <input placeholder='enter tags separated by comma' className='input-blogForm' type='text' name='tags' required></input>
            </div>
                <div className='btn-blogForm'>
                    <button type='submit'>Next</button>
                </div>
            </form>
        </div>
    )
}
