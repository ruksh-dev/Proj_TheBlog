import React, {useState,useRef,useEffect,useCallback,useMemo} from "react";
import {useNavigate,useParams} from 'react-router-dom';
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import mentions from './Mentions';
import axios from 'axios';
//--Tool plugins
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createLinkifyPlugin from '@draft-js-plugins/linkify';

import createUndoPlugin from '@draft-js-plugins/undo';

import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';

//import createVideoPlugin from '@draft-js-plugins/video';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';

//---

//--- css files
import "@draft-js-plugins/mention/lib/plugin.css";
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import "@draft-js-plugins/emoji/lib/plugin.css";
import "./CommentEditor.css";
import post_icon from '../assets/post.png'
//---
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})
const emojiPlugin = createEmojiPlugin({
  useNativeArt: true,
});
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();
//const inlineToolbarPlugin = createInlineToolbarPlugin();
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;
//const textAlignmentPlugin = createTextAlignmentPlugin();
//const toolbarPlugin = createToolbarPlugin();
const staticToolbarPlugin = createStaticToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
//const videoPlugin = createVideoPlugin();
//-- plugins array

//---
const CustomEmojiButton = () => {
  return (
    <div className="draft-js-toolbar-button" style={{display: 'inline-flex', alignItems: 'center', marginBottom: '4px', marginLeft: '6px'}}>
      <EmojiSelect closeOnEmojiSelect/>
    </div>
  );
};
export default function CommentEditor({parentCommentId}:{parentCommentId: string | null}) {
    const editorRef=useRef<Editor | null>(null);
  const [editorState, setEditorState]=useState(
    ()=>EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
    const navigate = useNavigate();
    const {id}=useParams();
  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent(mentionProps) {
        const { mention } = mentionProps;
        return (
          <span
            className={mentionProps.className}
            onClick={() => navigate(`/view/user/${mention.id}`)} // Navigate to user profile
            style={{ cursor: "pointer", color: "blue" }} // Apply some styles
          >
            {mentionProps.children}
          </span>
        );
      },
    });
    // eslint-disable-next-line no-shadow
      const { MentionSuggestions } = mentionPlugin;
      const plugins = [staticToolbarPlugin,linkifyPlugin, hashtagPlugin,undoPlugin,emojiPlugin,mentionPlugin];
    // eslint-disable-next-line no-shadow
    return { MentionSuggestions, plugins };
  }, [navigate]);
   
    const onOpenChange = useCallback((_open:boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ trigger, value }:{trigger:string, value: string}) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions, trigger));
  }, []);
   
   const handleEditorContent=async ()=>{
        try{
            const rawContent=convertToRaw(editorState.getCurrentContent());
        if(!parentCommentId) {
            const response=await api.post(`/postcomment/${id}`,rawContent);
            console.log(response);
            return;
        }
            const data={
                rawContent,
                parentCommentId
            }
            const response=await api.post(`/commentreply/${id}`,data);
            console.log(response);
            
        }catch(err){
            console.error(err);
        }
    } 
  return (
    <div className="comment-editor-container">
    <div className="editor">
        <Editor
            key="editor"
            ref={editorRef}
        editorState={editorState}
        onChange={(editorState)=>setEditorState(editorState)}
        plugins={plugins}
        placeholder="start typing here....."
        />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
      />
      <EmojiSuggestions /> 
      <UndoButton />
      <RedoButton />
      <Toolbar>
        {
          // may be use React.Fragment instead of div to improve perfomance after React 16
          (externalProps) => (
            <div>
              {/* <EmojiSelect closeOnEmojiSelect /> */}
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
              <CustomEmojiButton />
            </div>
          )
        }
      </Toolbar> 
  </div>
  <div className='editor-post-btn'> 
      <button onClick={handleEditorContent}><img src={post_icon} alt='post' />Post</button>
  </div>
    </div>
  )
}

