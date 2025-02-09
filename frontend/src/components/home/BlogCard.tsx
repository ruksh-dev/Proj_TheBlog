import React from "react";
import "./BlogCard.css";
import {Link, LinkProps} from 'react-router-dom';
import clap_icon from "./assets/clap.png";
export interface blogCardProps{
    id: number;
    author: string;
    created_at: string;
    title: string;
    description: string;
    tags: string[];
    like_count: number;
    // views: number;
}


export const BlogCard: React.FC<blogCardProps> = (props) => {
    return (
        <Link 
            key={props.id} 
            to={`/posts/${props.id}`} 
            state={{ 
                created_at: '2024-11-02 21:43:13', 
                likes: props.like_count, 
                author: props.author,
                title: props.title
            }} 
            style={{textDecoration: 'none'}} > 
        <div className="blog-card">
        <div className="content-section">
         <div className='blog-header'>
          <div className='blog-header-section'>
            <span className="blog-header-text">{props.author}</span>
            <div className='dot'></div>
            <span className="blog-header-text">{props.created_at}</span>
        </div>
         <div className='blog-header-section'>
        <div className="likes">
            <img src={clap_icon} alt="likes" className="like-icon" />
            <p className="like-text">{props.like_count}</p>
         </div>
        </div>
        </div> 
        <h3 className="blog-card-title">
            {props.title}
        </h3>
        <p className="description">
            {props.description}
        </p>
        <div className="meta">
          <div style={{display:'flex', alignItems:'center', color: '#797979'}}>
            {props.tags.map((tag, index)=>(
                <div key={index} className="tag">{tag}</div>
            ))}
        </div>
        </div>
      </div>
  </div>
  </Link>
  );
};
