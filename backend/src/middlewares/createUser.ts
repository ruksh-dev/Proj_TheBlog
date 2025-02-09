import passport from 'passport';
export default async function createUser(req:any,res:any,next:any) { 
           passport.authenticate('google',{
            scope:['profile','email'],
            state: 'user'
        })(req,res,next);
}
