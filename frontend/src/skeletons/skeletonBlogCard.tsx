import SkeletonElement from './skeletonElement';
import '../skeletons/skeleton.css';

const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
  )
}

const SkeletonBlogCard=()=>{
    return (
        <div className='blog-card-wrapper'>
        <div  className="blog-card">
        <div className="content-section">
         <div className='blog-header'>
            <SkeletonElement type='text' /> 
        </div> 
        <SkeletonElement type='title' />
        <SkeletonElement type='description' />
        <div className="meta">
          <div style={{display:'flex', alignItems:'center', color: '#797979'}}>
            {[1,2,3].map((index)=>(
                <SkeletonElement key={index} type="text" />
            ))}
        </div>
        </div>
      </div>
      </div>
      <Shimmer />
    </div>
    )
}
export default SkeletonBlogCard;

