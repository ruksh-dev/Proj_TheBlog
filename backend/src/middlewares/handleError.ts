export function handleError(err:any, req:any, res:any, next:any) {
    console.error(err);
    return res.status(500).json({msg:'internal server error'});
}
