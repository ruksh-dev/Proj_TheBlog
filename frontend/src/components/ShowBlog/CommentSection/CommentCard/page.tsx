import type React from "react"
import { useState, useEffect } from "react"
import { MessageCircle, Reply } from "lucide-react"
import CommentEditor from "../../../CommentEditor"
import RenderComment from "../../../renderComment"
import { moreRepliesAtom } from "../../../atoms"
import { useSetRecoilState } from "recoil"
import axios from 'axios';
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})


const CommentCard: React.FC<any> = ({
  postId,
  parentCommentId,
  comment,
  depth=0,
  setShowAlert,
  profile}) => {

      const [showReply,setShowReply]=useState<boolean>(false);
      const [replies,setReplies]=useState(null);
      const [openEditor,setOpenEditor]=useState<boolean>(false);
      const [isCommentEdit,setIsCommentEdit]=useState<boolean>(false);
      const [isLiked, setIsLiked] = useState(false)
      const setMoreReplies=useSetRecoilState(moreRepliesAtom);
      console.log("depth is: ",depth);

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

      useEffect(()=>{
              if(showReply) {
                  const fetchCommentReplies=async()=>{
                      console.log("fetching comments for postId: ",postId," and commentId: ",comment.id," ....");
                      const response=await api.get(`/getreplies/${postId}/${comment.id}`);
                      console.log("done fetching replies!, response: ",response)
                      setReplies(response.data.comments);
                  }
                  fetchCommentReplies();
                  if (showReply && comment.replies && depth>1) {
                    console.log("setting MoreReplies value for commentId: ",comment.id," and parentId: ",parentCommentId ," to: ",comment.replies);
                    setMoreReplies(comment.replies);
                }
              }
          },[showReply,comment.id]);
           function handleCommentToggle() {
            setShowReply((showReply)=>{return !showReply})
          }
          async function handleReplyToggle() {
              if(!profile) {
                  setShowAlert(true);
                  setTimeout(()=>{
                      setShowAlert(false);
                  },2000);
                  return;
              }
              setOpenEditor(!openEditor);
          }

  return (
    <>
    <div className="rounded-lg p-1 mb-4 shadow-md" style={{marginLeft: `${20*depth+1}px`}}>
      <div className="flex items-start space-x-4">
        {/* <Avatar src={"https://static.vecteezy.com/system/resources/previews/009/971/218/non_2x/chat-bot-icon-isolated-contour-symbol-illustration-vector.jpg"} alt={comment.username} /> */}
        <ProfilePhoto />
        <div className="flex-1">
          <div className="flex items-center ">
            <h3 className="text-lg font-semibold mr-2">{comment.username}</h3>
            <span className="text-sm text-gray-400">{comment.formatted_created_at}</span>
          </div>
          {/* <p className="text-gray-300 mb-4">{content}</p> */}
          <RenderComment rawContent={comment.content} isEditable={isCommentEdit} parentCommentId={parentCommentId} setIsCommentEdit={setIsCommentEdit} />
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className={`text-gray-400 hover:text-white ${isLiked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <Heart />
              {/* {comment.likes} */}
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={handleCommentToggle}>
              <MessageCircle className="w-4 h-4 mr-2 inline" />
              {/* {showReply? "Reply" : "Replies"}   fix this!*/}
              Replies
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={handleReplyToggle}>
              <Reply className="w-4 h-4 mr-2 inline" />
              Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
    {openEditor && (
            <div className='comment-editor'>
                <CommentEditor  parentCommentId={comment.id} />
            </div>
        )}
            {showReply && replies && replies.map((reply)=>(
                <CommentCard 
                  key={reply.id} 
                  postId={postId} 
                  parentCommentId={comment.id} 
                  comment={reply} 
                  depth={depth+1}
                  setShowAlert={setShowAlert}  
                  profile={profile}/>
            ))}
    </>
  )
}

export default CommentCard

const ProfilePhoto=()=>{
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
  <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
</svg>

}

const Heart=()=>{
  return (
      <div className="flex items-center justify-between">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
    <div>2</div>
      </div>
   )

}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "ghost" | "default" }> = ({
children,
className,
variant = "default",
...props
}) => {
const baseClasses =
  "px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
const variantClasses =
  variant === "ghost" ? "bg-transparent hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700 text-white"

return (
  <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
    {children}
  </button>
)
}