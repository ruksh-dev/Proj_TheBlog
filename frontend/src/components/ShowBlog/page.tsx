import React,{useEffect,useState} from "react";
import {useRecoilValue} from 'recoil';
import {isAuthenticatedAtom} from '../atoms';
import {useParams, useLocation, Link} from 'react-router-dom';
import "../blog.css";
import SkeletonShowBlog from '../../skeletons/skeletonShowBlog';
import draftToHtml from "draftjs-to-html";
import { customEntityTransform } from "../utils";
import CommentSection from './CommentSection/page';
import axios from 'axios';
import UserData from "./UserData/page";
import Content from "./Content/page";
// import clap_icon from '../home/assets/clap.png';
// import message_icon from '../../assets/messenger.png';
// import bookmarked_icon from '../../assets/bookmark.png';
// import bookmark_icon from '../../assets/save-instagram.png';
// import clapped_icon from '../../assets/clap_dark.png';
import '../isAuthNotification.css'; 
const Notification = () => {
    return (  
        <div className="notification"> 
            <div className="notification-content">User not signed in</div> 
        </div> 
    );
}

const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

export default function ShowBlog() {
  //const editorState = useRecoilValue(editor_State);
    const [htmlContent, setHtmlContent] = useState(''); 
    const [userId,setUserId]=useState('');
    const [blogMetaData,setBlogMetaData]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    const [showMessages,setShowMessages]=useState(false);
    const [isPostLiked,setIsPostLiked]=useState(false);
    const [isBookmarked,setIsBookmarked]=useState(false);
    const [showAlert,setShowAlert]=useState(false);
    const isAuthenticated=useRecoilValue(isAuthenticatedAtom);
    const {id}=useParams<{id:string}>();
    const location = useLocation();
    const { state } = location;
    
    // Type-safe way to access state
    const created_at = state?.created_at;
    const likes = state?.likes;
    const author = state?.author;
    const title=state?.title;
    //console.log("html content: ",htmlContent);
    console.log(created_at+' '+likes+' '+author);
  useEffect(() => {
      const fetchData=async ()=>{
          try{
        setIsLoading(true);
              const response =await api.get(`/posts/${id}`);
              console.log(response);
        const rawContent=JSON.parse(response.data.rawContent);
        const markup = draftToHtml(
          rawContent,
          {},
          true,
          customEntityTransform
        );
        // console.log(markup);
          //const parser = new DOMParser();
              //const newParsedHtml= parser.parseFromString(markup, 'text/html');
              // const metadata={
              //     likes: response.data.metadata.likes,
              //     author: response.data.metadata.username,
              //     title: response.data.metadata.title,
              //     created_at: response.data.metadata.created_at
              // }
        setUserId(response.data.userId);
              setHtmlContent(markup);
              setBlogMetaData(response.data.metadata);
          }catch(err){
              console.error(err);
          }finally {
              setIsLoading(false);
          }
      }
      const fetchPostLike=async ()=>{
          try{
              const response=await api.get(`/postLiked/${id}`);
              setIsPostLiked(response.data.liked);
          }catch(err){console.error(err);}
      }
      const fetchIsPostBookmarked=async ()=>{
          try{
              const response=await api.get(`/post/checkbookmark/${id}`);
              setIsBookmarked(response.data.value);
          }catch(err){console.error(err)}
      }
      fetchData();
      if(isAuthenticated){
          fetchPostLike();
          fetchIsPostBookmarked();
      }
  },[]);

    const handleBookmarkClick=async ()=>{
        if(!isAuthenticated){
            setShowAlert(true);
            setTimeout(()=>{
                setShowAlert(false);
            },2000);
            return;
        }
        //console.log('bookmark button clicked!');
        const response=await api.post(`/post/bookmark/${id}`, {isBookmarked});
        console.log(response);
        setIsBookmarked((isBookmarked)=>{return !isBookmarked});
    }
    const handleLikeClick=async ()=>{
        try{
            if(!isAuthenticated) {
                setShowAlert(true);
                setTimeout(()=>{
                  setShowAlert(false);
            },2000);
               return;
            }
            const response=(isPostLiked)?(await api.post(`/unlike/post/${id}`)):(await api.post(`/like/post/${id}`));
            console.log('likebtn response: ',response);
            setIsPostLiked((isPostLiked)=>{return !isPostLiked});
        }catch(err){console.error(err)}
    }
   
    //console.log(markup);
    if (isLoading) {
        return (
            <SkeletonShowBlog />       
        );
    }
    return (
        <div className="w-full h-full flex justify-center items-center bg-white relative">
            {showAlert && <Notification />}
            <div className='w-1/2'>
            <UserData 
              author={blogMetaData?.author} 
              created_at={blogMetaData?.created_at} 
              likes={blogMetaData?.likes}
              isPostLiked={isPostLiked}
              isBookmarked={isBookmarked}
              showMessages={showMessages}
              handleBookmarkClick={handleBookmarkClick} 
              handleLikeClick={handleLikeClick}
              handleMessageClick={()=>{setShowMessages(x=>!x)}}
            />
            <Content title={title} htmlContent={htmlContent} />
        </div>
        {showMessages && <CommentSection setShowAlert={setShowAlert} showMessages={showMessages} />}
     </div>
  );
}



