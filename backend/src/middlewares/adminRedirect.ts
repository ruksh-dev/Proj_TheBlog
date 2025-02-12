export default function adminRedirect(req:any,res:any,next:any) {
    if(req.isAuthenticated()) {
        res.redirect('/');
    }else {
        res.redirect('/admin/auth/google');
    }
}
