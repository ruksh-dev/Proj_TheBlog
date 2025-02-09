export default function userRedirect(req:any,res:any,next:any) {
    if(req.isAuthenticated()) {
        res.redirect('/');
    }else {
        res.redirect('/user/auth/google');
    }
}
