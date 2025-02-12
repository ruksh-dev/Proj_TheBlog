import { OutlineBookmarkIcon,SolidBookMarkIcon } from "../../Icons/page";
const Bookmark=({open, handleClick}:{open: boolean})=>{
    return (
    <div onClick={handleClick}>
        {(open)?<SolidBookMarkIcon /> :
        <OutlineBookmarkIcon />}
    </div>
    )
}
export default Bookmark;