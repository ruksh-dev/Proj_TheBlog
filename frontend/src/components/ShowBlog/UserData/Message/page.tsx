import { OutlineMessageIcon,SolidMessageIcon } from "../../Icons/page"
const Message=({open, handleClick}:{open:boolean})=>{
    return (
    <div onClick={handleClick}>
        {(open)?<SolidMessageIcon  />:<OutlineMessageIcon  />}
    </div>
    )
}
export default Message;