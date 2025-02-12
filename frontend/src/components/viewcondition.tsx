import React,{useState,useEffect,useRef} from 'react';
// like-icon
function calReadingTime(htmlContent) {
    const parser=new DOMParser();
    const doc=parser.parseFromString(htmlContent,'text/html');
    let textContent=doc.body.textContent || '';
    textContent=textContent.replace(/\s+/g, '');
    const characterCount=textContent.length;
    const wordCount = characterCount / 5; // Average word length
    const totalReadingTime = (wordCount / 200) * 60; // in seconds
    const thresholdTime=totalReadingTime*0.4;
    return thresholdTime;

}

export default function SetPostView(htmlContent) {
    const [isViewed,setIsViewed]=useState<boolean>(false);
    const timeoutId=useRef<null | NodeJS.Timeout>(null);
    useEffect(()=>{
        const thresholdTime=calReadingTime(htmlContent);
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId=setTimeout(()=>{
            setIsViewed(true);
        },thresholdTime);
    })
}
