import React from 'react';
//import './BlogItem.css';

interface BlogItemProps {
  title: string;
  author: string;
  date: string;
  readTime: string;
  imgSrc: string;
}

export const BlogItem: React.FC<BlogItemProps> = ({ title, author, date, readTime, imgSrc }) => {
  return (
    <div className="blog-item">
      <div className="blog-image">
        <img src={imgSrc} alt={title} />
      </div>
      <div className="blog-content">
        <h3>{title}</h3>
        <p className="author">{author}</p>
        <p className="description">
          I’m always trying to think of new and interesting business ideas by thinking of what I would want...
        </p>
        <div className="meta">
          <span>{date}</span>
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
};
