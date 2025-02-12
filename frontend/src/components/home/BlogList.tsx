import React,{useEffect} from "react";
import { BlogCard, blogCardProps } from "./BlogCard";
import SkeletonBlogCard from '../../skeletons/skeletonBlogCard';
import {useRecoilState,useRecoilValue,useSetRecoilState} from 'recoil';
import {trendingPostsAtom,searchBarAtom,currentPageAtom,totalPagesAtom} from '../atoms';
import axios from 'axios';
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});
export const BlogList: React.FC = () => {
    const [trendingPosts,setTrendingPosts]=useRecoilState(trendingPostsAtom);
    const currentPage=useRecoilValue(currentPageAtom);
    const setTotalPages=useSetRecoilState(totalPagesAtom);
    const searchTerm=useRecoilValue(searchBarAtom);
    console.log("searchTerm: "+searchTerm+"currentPage: "+currentPage);
    useEffect(()=>{
        const fetchData=async ()=>{
            const response=await api.get('/getposts',{
                params: {
                    term: searchTerm,
                    page: currentPage,
                    limit: 4
                }
            });
            console.log(response.data);
            setTrendingPosts(response.data.result2.rows);
            setTotalPages(Math.ceil((response.data.result1.rows[0].total_count/4)));
        }
        fetchData();
    },[searchTerm, currentPage]);  
  return (
    <section className="blog-list">
        {trendingPosts && trendingPosts.map((post:blogCardProps)=>(
            <BlogCard key={post.id}
                id={post.id}
                created_at={post.created_at}
                title={post.title}
                description={post.description}
                tags={post.tags}
                author={post.author}
                like_count={post.like_count}
                // views={post.views}
            />
        ))}
        {!trendingPosts && [1,2,3,4].map((index)=>(
            <SkeletonBlogCard key={index} />
        ))}
    </section>
  );
};
