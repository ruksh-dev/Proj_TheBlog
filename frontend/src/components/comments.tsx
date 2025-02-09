import {useRef} from 'react';
import CommentEditor from './CommentEditor';
import RenderComment from './renderComment';
import CommentCard from './ShowBlog/CommentSection/CommentCard/page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
// import {sampleComments} from './sampleComments';
import arrow_up from '../assets/arrow-up.png';
import arrow_down from '../assets/arrow-down.png';
import chat from '../assets/chat.png';
import React,{ useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import {profileAtom} from './atoms';
import {useRecoilValue} from 'recoil';
import axios from 'axios';
import './comments.css';
const api=axios.create({
    baseURL: 'http://localhost:3000'
})
interface Comment {
    id:string,
    userName:string,
    content:string,
    replies?:Comment[],

}
type setShowAlertType=React.Dispatch<React.SetStateAction<boolean>>;
const Comment=({postId,parentCommentId,commentId,comment,depth=0,setShowMoreReplies, setShowAlert,isAuthenticated})=>{
    
    const [showReply,setShowReply]=useState<boolean>(false);
    const [replies,setReplies]=useState(null);
    const [openEditor,setOpenEditor]=useState<boolean>(false);
    const [isCommentEdit,setIsCommentEdit]=useState<boolean>(false);

    useEffect(()=>{
        if(showReply) {
            const fetchCommentReplies=async()=>{
                const response=await api.get(`/getreplies/${postId}/${commentId}`);
                setReplies(response.data.comments);
            }
            fetchCommentReplies();
        }
    },[showReply]);
    function handleCommentToggle() {
      setShowReply((showReply)=>{
        return showReply?false:true;
      })
      if (!showReply && comment.replies && depth === 1)
      setShowMoreReplies(() => {
        return comment.replies;
      });
    }
    async function handleReplyToggle() {
        if(!isAuthenticated) {
            setShowAlert(true);
            setTimeout(()=>{
                setShowAlert(false);
            },2000);
            return;
        }
        setOpenEditor((value:boolean)=>{return !value});
    }
    return (
        <> 
        <div className="user-comment" style={{marginLeft: `${20*depth+1}px`}}>
        <div className="comment-top">
          <div>
            <img className="img" src="https://static.vecteezy.com/system/resources/previews/009/971/218/non_2x/chat-bot-icon-isolated-contour-symbol-illustration-vector.jpg" alt="avatar" />
          </div>
          <div>
            <strong>{comment.username}</strong>
        </div>
        </div>
         <RenderComment rawContent={comment.content} isEditable={isCommentEdit} parentCommentId={parentCommentId} setIsCommentEdit={setIsCommentEdit} /> 
        <div className="comment-bottom">
          <div>
              <FontAwesomeIcon icon={faThumbsUp} /> 
          </div>
          <div onClick={handleCommentToggle} className='show-comments'> 
              <img src={chat} style={{width: '20px', height: '20px'}}/>
              {showReply?(<img src={arrow_up} />):(<img src={arrow_down} />)}
          </div>
          <div onClick={handleReplyToggle} className={openEditor?'editor-open':'editor-close'}>reply</div>
        </div>
    </div>
    {openEditor && (
        <div className='comment-editor'>
            <CommentEditor  parentCommentId={commentId} />
        </div>
    )}
        {showReply && replies && replies.map((reply)=>(
            <Comment key={reply.id} postId={postId} parentCommentId={comment.id} commentId={reply.id} comment={reply} depth={depth+1} setShowMoreReplies={setShowMoreReplies} setShowAlert={setShowAlert}  isAuthenticated={isAuthenticated}/>
        ))}
    </>
    )
}

const CommentSection = ({setShowAlert}:{setShowAlert: setShowAlertType}) => {
    const [comments, setComments] = useState(null); 
    const [listening,setListening]=useState(false);
    const profile=useRecoilValue(profileAtom);
    const {id}=useParams();
    console.log(comments);
    //useEffect(()=>{
    //    const fetchComments=async ()=>{
    //        const response=await api.get(`/post/getcomments/${id}`);
    //        //console.log(response.data.comments);
    //        setComments(response.data.comments);
    //    }
    //    fetchComments();
    //},[]);
    useEffect(() => {
        let events: EventSource | undefined;
        const fetchComments=async ()=>{
        try{
        if (!listening) {
            events = new EventSource(`http://localhost:3000/events/${id}`,{withCredentials: true});
        events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setComments(parsedData);
        }
        }
        setListening(true);
            }catch(err){
                console.error(err);
            }
        }
        fetchComments();
        return ()=>{
            if(events) {
                events.close();
                console.log('SSE connection closed');
            }
        }
  }, [id]);
  const [showMoreReplies, setShowMoreReplies] = useState(null);
  function handleBtnClick() {
    setShowMoreReplies(null);
  }

  {
    if (showMoreReplies) {
      return (
        <div className="comment-container">
          <div className="repliesSection-top">
            <p>
              <strong>Replies:</strong>
            </p>
            <button onClick={handleBtnClick}>X</button>
          </div>
          {showMoreReplies.map((comment) => (
            <CommentCard
                key={comment.id}
                postId={id}
                parentCommentId={null}
                commentId={comment.id}
              comment={comment}
              setShowMoreReplies={setShowMoreReplies}
              showMoreReplies={showMoreReplies}
              setShowAlert={setShowAlert}
              profile={profile}
            />
          ))}
        </div>
      );
    }
    return (
        <div className="comment-container">
           {profile!=null && (
        <div className='comment-editor'>
            <CommentEditor  parentCommentId={null} />
        </div>
            )} 
        <div className="commentSection-top">
          <strong>Comments:</strong>
        </div>
        {comments &&
            comments.map((comment:any) => (
            <CommentCard
                key={comment.id}
                postId={id}
                parentCommentId={null}
                commentId={comment.id}
              comment={comment}
              setShowMoreReplies={setShowMoreReplies}
              showMoreReplies={showMoreReplies}
              setShowAlert={setShowAlert}
              profile={profile}
            />
          ))}
      </div>
    );
  }
};


// const x=({depth})=>{
//     return (
//         {if(depth===2){
//             <div></div>
//         }}
//     )
// }
export {
    Comment,
    CommentSection
}
