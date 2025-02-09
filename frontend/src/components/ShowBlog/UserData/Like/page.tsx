import { OutlineLikeIcon,SolidLikeIcon } from "../../Icons/page";
const Like=({open, handleClick,likes}:{open:boolean})=>{
    return (
    <div className="w-1/7 flex items-center justify-between">
      <div onClick={handleClick}>
        {(open)?<SolidLikeIcon  />:
         <OutlineLikeIcon  />}
      </div>
      <div>{likes}</div>
    </div>
    )
}
export default Like;