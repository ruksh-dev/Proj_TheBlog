import SkeletonElement from './skeletonElement';
import './skeleton.css';
const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
  )
}
const SkeletonShowBlog=()=>{

    return (
        <div className="skeleton-blog-main-wrapper">
            <div className='skeleton-blog-main'>
            <div className="skeleton-blog-user-container">
                <div className='skeleton-buc-top'>
                    <SkeletonElement  type='text' />
                    <SkeletonElement type='text' />
                </div>
                <div className='skeleton-buc-top-right'>
                <SkeletonElement type='icon' /> 
                <SkeletonElement type='icon' />
                <div className='skeleton-buc-likes'>
                    <SkeletonElement type='icon' />    
                </div>
                </div>
            </div>
                <div className='skeleton-bc-title'><SkeletonElement type='title' /></div>
            <div className="skeleton-htmlContainer"  >
                <SkeletonElement type='post' />
            </div>
        </div>
            <Shimmer />
     </div>
    )
}

export default SkeletonShowBlog;
