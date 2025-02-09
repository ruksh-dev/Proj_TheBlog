import CommentCard from "./CommentCard/page";
import {useState,useEffect,useRef} from 'react';
import { useParams } from "react-router-dom";
import { profileAtom, moreRepliesAtom } from "../../atoms";
import { useRecoilValue } from "recoil";
import './msg.css';

export interface commentProps {
    content: any;
    created_at: Date;
    formatted_created_at: string;
    id: number;
    user_id: string;
    username: string;
}

const CommentSection=({setShowAlert, showMessages})=>{
    const eventsRef=useRef<EventSource | null>(null);
    const profile=useRecoilValue(profileAtom);
    const moreReplies=useRecoilValue(moreRepliesAtom);
    const [comments,setComments]=useState<commentProps[] | null>(null);
    const {id}=useParams();
    console.log(moreReplies);
    
    const fetchComments=async ()=>{
        if(eventsRef && eventsRef.current) return
        try{
            eventsRef.current=new EventSource(`http://localhost:3000/events/${id}`,{withCredentials: true});
            eventsRef.current.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                setComments(parsedData);
            }

        }catch(err){
            console.error(err);
        }   
    }
    useEffect(()=>{
        fetchComments();
        return ()=>{
            if(eventsRef && eventsRef.current) {
                eventsRef.current.close();
                console.log('SSE connection closed');
            }
        }
    },[])
    if(moreReplies) {
        return (
            <div  className="absolute top-0  text-black self-start flex-col max-h-min m-2 ml-3 border-l border-gray-900 p-2 msg-animate">
                <div>MoreReplies:</div>
                {moreReplies.map((reply:commentProps)=>(
                    <CommentCard
                    key={reply.id}
                    postId={id}
                    parentCommentId={null}
                    comment={reply}
                    depth={0}
                    setShowAlert={setShowAlert}
                    profile={profile}
                    />
                ))}
            </div>
        )
    }

    return (
    <div  className="absolute z-2 top-0  text-black flex-col max-h-min m-2 ml-3 border-l border-gray-900 p-2 msg-animate">
        <div>Comments:</div>
        {comments && 
        comments.map((comment:commentProps)=>(
            <CommentCard
            key={comment.id}
            postId={id}
            parentCommentId={null}
            comment={comment}
            depth={0}
            setShowAlert={setShowAlert}
            profile={profile}
            />
        ))
        }
    </div>
    )
}

export default CommentSection;