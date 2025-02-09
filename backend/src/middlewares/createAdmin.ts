import passport from 'passport';
export default async function createAdmin(req:any,res:any,next:any) { 
        passport.authenticate('google',{
            scope:['profile','email'],
            state: 'admin'
        })(req,res,next);
}
