import Message from "./Message/page";
import Bookmark from "./Bookmark/page";
import Like from "./Like/page";
const UserData=({author, created_at, likes, isPostLiked, isBookmarked, showMessages, handleBookmarkClick, handleLikeClick, handleMessageClick})=>{
    return (
        <div className="pr-4 pl-4 pb-1 rounded-full flex items-center justify-between bg-slate-600 shadow-md">
            <div className="flex-col items-center justify-between pl-2 text-white">
                <div className="tracking-widest text-2xl">{author}</div>
                <div className="text-sm text-gray-400">{created_at}</div>
            </div>
            <div className="w-1/3 flex items-center justify-between text-white">
                <Bookmark open={isBookmarked} handleClick={handleBookmarkClick} />
                <Like open={isPostLiked} handleClick={handleLikeClick} likes={likes} />
                <Message open={showMessages} handleClick={handleMessageClick} />
            </div>
        </div>
    )
}
export default UserData;



