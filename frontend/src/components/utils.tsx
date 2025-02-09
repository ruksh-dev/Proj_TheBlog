const YOUTUBEMATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const VIMEOMATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/; // eslint-disable-line no-useless-escape

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';

export function isYoutube(url: string): boolean {
  return YOUTUBEMATCH_URL.test(url);
}
export function isVimeo(url: string): boolean {
  return VIMEOMATCH_URL.test(url);
}

export type SourceType = 'youtube' | 'vimeo';
export interface SourceResult {
  srcID: string;
  srcType: SourceType;
  url: string;
}

export function getYoutubeSrc(url: string): SourceResult {
  const id = url && url.match(YOUTUBEMATCH_URL)![1];
  return {
    srcID: id,
    srcType: 'youtube',
    url,
  };
}
export function getVimeoSrc(url: string): SourceResult {
  const id = url.match(VIMEOMATCH_URL)![3];
  return {
    srcID: id,
    srcType: 'vimeo',
    url,
  };
}

export function getSrc(src: string ): string | undefined  {
    if (isYoutube(src)) {
      const { srcID } = getYoutubeSrc(src);
      return `${YOUTUBE_PREFIX}${srcID}`;
    }
    if (isVimeo(src)) {
      const { srcID } = getVimeoSrc(src);
      return `${VIMEO_PREFIX}${srcID}`;
    }
    return undefined;
  };
export interface customEntityTransformProps {
    type:string,
    data:{
        src:string,
        width:string,
        height:string
    }
}
  export function customEntityTransform({type,data}:customEntityTransformProps) {
    if(type==='IFRAME') {
         const {src,width,height}=data;
         console.log(type,src,width,height);
         const finalHtmlTag=`<iframe width=${width} height=${height} src=${src}  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>`;
         console.log(finalHtmlTag);
         return finalHtmlTag;
     }
     return;
  }

export function convertToPlainText(rawContent) {
    //console.log(rawContent.blocks);
    const mappedBlocks=rawContent.blocks.map(
        (block)=>(!block.text.trim() && '\n') || block.text
    );
    let plainText='';
    for(let i=0; i<mappedBlocks.length; i++) {
        const block=mappedBlocks[i];
        if(i===mappedBlocks.length-1) {
            plainText+=block;
        }else {
            if(block==='\n') plainText+=block;
            else plainText+=block+'\n';
        }
    }
    console.log(plainText);
}
