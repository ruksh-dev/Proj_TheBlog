export default function logout(req:any,res:any,next:any) {

    req.logout((err:any)=>{
        if(err) return next(err);
        req.session.destroy((err:any)=>{
            if(err) return next(err);
            res.clearCookie('connect.sid');
            res.clearCookie('authToken');
            res.redirect('/');
        });
    })
}
