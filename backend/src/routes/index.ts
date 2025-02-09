import passport from 'passport';
import {Router} from 'express';
import createUser from '../middlewares/createUser';
import createAdmin from '../middlewares/createAdmin';
import checkAuthenticated from '../middlewares/checkAuthenticated';
import uploadMetaData from '../middlewares/uploadMetaData';
import saveBlog from '../middlewares/saveBlog';
import submitBlog from '../middlewares/submitBlog';
import showDrafts from '../middlewares/showdrafts';
import getDraft from  '../middlewares/getDraft';
import getPost from '../middlewares/getpost';
import getPosts from '../middlewares/getposts';
import isPostLiked from '../middlewares/ispostliked';
import likePost from '../middlewares/likepost';
import unLikePost from '../middlewares/unlikepost';
import checkBookmark from '../middlewares/checkbookmark';
import bookmark from '../middlewares/bookmark';
import getPostComments from '../middlewares/getpostcomments';
import postBlogComment from '../middlewares/postblogcomment';
import postReplyComment from '../middlewares/postreplycomment';
import {addPostComment,addCommentReply} from '../middlewares/addPostComment2';
import commentEventHandler from '../middlewares/comments_sse';
import getReplies from '../middlewares/getreplies';
import setpostview from '../middlewares/setpostview';
import {Signup, TokenVerifier, CheckUserStatus, Signin} from '../middlewares/auth1';
const router=Router();

// auth routes
router.get('/user/auth/google',createUser);
router.get('/admin/auth/google',createAdmin);
router.get('/auth/google/redirect',  
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res)=>{
    // Successful authentication, redirect home.
    //console.log(req.user,req.session); 
    res.redirect('http://localhost:5173/');
  });

router.get('/logout',(req,res,next)=>{
  if(!req.isAuthenticated()) res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'strict' });
    req.logout((err)=>{
        if(err) return next(err);
        req.session.destroy((err)=>{
            if(err) return next(err);
            res.clearCookie('connect.sid');
            res.clearCookie('authToken');
            res.redirect('/');
            });
        });
});
router.get('/auth/check',checkAuthenticated,(req:any,res:any)=>{
  return res.status(200).json({profile: req.body.profile});
});
// uploadMetaData
router.post('/uploadmetadata',checkAuthenticated,uploadMetaData);

//saveBlog
router.post('/saveblog',saveBlog);

//submitBlog
router.post('/submitblog',submitBlog);

//showdrafts
router.get('/user/showdrafts',checkAuthenticated,showDrafts);
//get a draft
router.get('/users/showdrafts/:id',getDraft);
router.get('/posts/:id', getPost);
router.get('/getposts',getPosts);
router.get('/postLiked/:id',isPostLiked);
router.post('/like/post/:id',likePost);
router.post('/unlike/post/:id',unLikePost);
router.get('/post/checkbookmark/:id',checkBookmark);
router.post('/post/bookmark/:id',bookmark);
router.get('/post/getcomments/:id', getPostComments);
router.post('/post/blogcomment/:id',postBlogComment);
router.post('/post/replycomment/:id',postReplyComment);

router.post('/postcomment/:id',addPostComment);
router.post('/commentreply/:id',addCommentReply)
router.get('/events/:id',commentEventHandler);
router.get('/getreplies/:id1/:id2',getReplies);
router.post('/setpostview/:id',setpostview);
router.post('/user/signup',Signup);
router.get('/verify/:token',TokenVerifier);
router.post('/user/signin',Signin);
router.post('/user/verify',CheckUserStatus);

export const allRoutes=router;
