export default async function checkSession(req:any,res:any,next:any) {
    try{
        if(!req.session){
            await new Promise<void>((resolve,reject)=>{
                req.session.regenerate((err:any)=>{
                    if(err) return reject(err);
                    resolve();
                });
            });
        req.session.created_at=new Date();
        console.log('new session created successfully');
        next();
        }
        if(req.session.cookie.expires && new Date()>req.session.cookie.expires) {
          
            await new Promise<void>((resolve,reject)=>{
                req.session.destroy((err:any)=>{
                    if(err) reject(err);
                    req.session.regenerated((err:any)=>{
                        if(err) reject(err);
                        resolve();
                    });
                });
            });
            req.session.created_at=new Date();
            console.log('session destroyed & regenerated successfully');
        }
    }catch(err){
        next(err);
    }
}
