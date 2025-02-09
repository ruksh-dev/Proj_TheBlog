import {useNavigate,useParams} from 'react-router-dom';
import {useState,useMemo,useCallback,useEffect} from 'react';
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,convertFromRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import createUndoPlugin from '@draft-js-plugins/undo';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import mentions from './Mentions';
import axios from 'axios';

import "@draft-js-plugins/mention/lib/plugin.css";
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import "@draft-js-plugins/emoji/lib/plugin.css";
import post_icon from '../assets/post.png';
import './CommentEditor.css';

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

const CustomEmojiButton = () => {
  return (
    <div className="draft-js-toolbar-button" style={{display: 'inline-flex', alignItems: 'center', marginBottom: '4px', marginLeft: '6px'}}>
      <EmojiSelect closeOnEmojiSelect/>
    </div>
  );
};
export default function RenderComment({rawContent,isEditable, parentCommentId,setIsCommentEdit}:{rawContent: any,isEditable: boolean, parentCommentId: string | null, setIsCommentEdit: any}) {
    
    const [editorState,setEditorState]=useState(
        ()=>EditorState.createEmpty()
    );
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);
    const navigate=useNavigate();
    const {id}=useParams();
    useEffect(()=>{
        const contentState = convertFromRaw(rawContent); 
        const oldEditorState = EditorState.createWithContent(contentState);
        setEditorState(oldEditorState);
    },[]);
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
      const { MentionSuggestions } = mentionPlugin;
      const plugins = [staticToolbarPlugin,linkifyPlugin, hashtagPlugin,undoPlugin,emojiPlugin,mentionPlugin];
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
            const response=await api.post(`/post/blogcomment/${id}`,rawContent);
            console.log(response);
            return;
        }
            const data={
                rawContent,
                parentCommentId
            }
            const response=await api.post(`/post/replycomment/${id}`,data);
            console.log(response);
            setIsCommentEdit(false);
            
        }catch(err){
            console.error(err);
        }
    } 

    if(isEditable) {
        return (
           <div className="editor">
        <Editor
            key="editor"
        editorState={editorState}
        onChange={(editorState)=>setEditorState(editorState)}
        plugins={plugins} 
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
    <div className='editor-post-btn'>
        <button onClick={handleEditorContent}><img src={post_icon} alt='save edit' />Save Edit</button>
     </div>
  </div> 
        );
    }
    return (
        <div className='comment-render-container'>
            <Editor key='editor' editorState={editorState} 
                onChange={(editorState)=>setEditorState(editorState)}
                plugins={plugins}
                readOnly={true} 
            />
        </div>
    )

}


