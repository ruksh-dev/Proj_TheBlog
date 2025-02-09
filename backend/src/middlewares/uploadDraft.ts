// function getExcerpt(plainText, limit) {
//   let excerpt='';
//   const lines = plainText.split('\n');
//   console.log(lines+'\n');
//   for(let i=0;i<lines.length;i++) {
//       if(excerpt.length>=limit) break;
//       const lineChars=lines[i].length;
//       const charsLeft=limit-excerpt.length;
//       if(lineChars+1<=charsLeft) excerpt+=' '+lines[i].trim();
//       else{
//           excerpt+=' '+lines[i].substr(0,limit-excerpt.length-1).trim();
//       }
//   }
//   excerpt+='....';
//   return excerpt;
// }
export default async function uploadDraft(req:any,res:any,next:any) {
    try{
       

    }catch(err){
        next(err);
    }
}
    
