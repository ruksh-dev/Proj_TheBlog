import { EditorState,ContentBlock,convertToRaw,convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {IframeOption,customBlockRenderer} from "./video";
import { useRecoilState ,useRecoilValue} from 'recoil';
import { editor_State, postStateAtom} from './atoms';
import axios from 'axios';
//css files
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useTrackBlogView} from '../hooks/gtag';
import "./editor.css";
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})
export default function RichEditor() {

  // const [editorState,setEditorState]=useState(
  //   ()=>EditorState.createEmpty()
  // );
    const {id}=useParams<{id:string}>();
    const [editorState,setEditorState]=useState<EditorState | null>(null);
    useTrackBlogView(id!);
    useEffect(()=>{
        const getRawContent=async ()=>{
            try{
                const response=await api.get(`/users/showdrafts/${id}`);
                console.log("response: ",response);
                const contentState=convertFromRaw(JSON.parse(response.data.contentData));
                const newEditorState = EditorState.createWithContent(contentState);
                console.log("new editor state: ",newEditorState);
                setEditorState(newEditorState);
            }catch(err){
                console.error(err);
            }
        }
        getRawContent();
    },[id]);
  
  const onChange=(editorState:EditorState)=>{
    setEditorState(editorState);
      const rawContent=convertToRaw(editorState.getCurrentContent());
      localStorage.setItem('editorContent',JSON.stringify(rawContent));
  }

    const customBlockRendererFn=(block:ContentBlock)=>{

    if(editorState) return customBlockRenderer(block,editorState.getCurrentContent());
  }
  //console.log(convertToRaw(editorState.getCurrentContent()));

  return (
    <>
    <div className="container">
    <Editor
        editorState={editorState!}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
        options: ['inline', 'blockType', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
        }}
        // toolbarStyle={{ border: '2px solid black' }}
        toolbarCustomButtons={[<IframeOption editorState={editorState} onChange={onChange} />]}
        customBlockRenderFunc={customBlockRendererFn}
        onEditorStateChange={onChange}
        placeholder="Write your Blog here..."
      />
      <Buttons id={id}/>
    </div>
    </>
  );
}
function Buttons(id) {
    const postState=useRecoilValue(postStateAtom);
    async function handleSave(state:string) {
        try{
        const rawEditorContent=JSON.parse(localStorage.getItem('editorContent')!);
        console.log(postState);
        const data={
            post_id: id,
            filename: postState?.key,
            rawContent: rawEditorContent,
            state
        }
        const response=await axios.post('http://localhost:3000/saveblog',data);
        console.log(response);
        }catch(err) {
            console.error(err);
        }
    }
    return (
        <div className='editor-btns'>
            <button onClick={()=>{handleSave('draft')}}>Save as draft</button>
            <button onClick={()=>{handleSave('post')}}>Submit</button>
        </div>
    )
}



