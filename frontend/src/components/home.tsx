
import {SearchBar} from './home/SearchBar';
import {Pagination} from './home/Pagination';
import {BlogList} from './home/BlogList';
import '../App.css';

export default function Home() { 
        return (
        <div className='home-container'>
            <div className="title-container">
               <h1 className="blog-title">THE BLOG</h1>
            </div>
            <div className='title-container-bottom'></div>
            <div className='mid-top'>
                <div className='mid-top-text'>Recent Posts</div>
                <SearchBar />
            </div>
            <BlogList />
            <Pagination />
        </div>
    )

}
