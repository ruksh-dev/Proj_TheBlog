import {useState} from 'react';
import { EditorState, Modifier, ContentState,ContentBlock,AtomicBlockUtils } from 'draft-js';
import { getSrc } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import "./editor.css";
export const IframeOption = (props ) => {
    const [expand,setExpand]=useState<boolean>(false);

    const createEntity=(src):void=>{
        const width="500";
        const height="300";
        const contentState = props.editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          'IFRAME',
          'IMMUTABLE',
          { src, width, height }
        );
        //console.log(contentStateWithEntity);
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    console.log(entityKey);
    const newEditorState=AtomicBlockUtils.insertAtomicBlock(props.editorState, entityKey, ' ');
    //console.log(newEditorState);
    props.onChange(newEditorState);
    }

  const insertIframe = (event) => {
    //event.stopPropagation();
    event.preventDefault();
    const formData=new FormData(event.target);
    const inputValue=formData.get('videoURL');
    console.log(inputValue);
    const src=inputValue;
    //const src = "https://www.youtube.com/embed/TOXTfogmxU0";
    createEntity(src);
    formData.set('videoURL','');
    setExpand(()=>{return false;});
  };
  return (
    <div>
    <div className='custom-video-class' onClick={()=>{setExpand((expand)=>{return (expand?false:true);})}} >
    <FontAwesomeIcon icon={faVideo} />
    </div>
    {expand && (
        <form onSubmit={insertIframe}>
        <input type='text' placeholder='enter video url...' name='videoURL'></input>
        <button type='submit'>Add</button>
        </form>
    )}
    </div>
  );
};


// Custom block renderer function
export const customBlockRenderer = (block:ContentBlock,contentState:ContentState) => {
    //console.log("custom block renderer running....")
    //console.log(block);
    if (block.getType() === 'atomic') {
      //const contentState = editorState.getCurrentContent();
      console.log("block type is atomic..")
      const entityKey = block.getEntityAt(0);
        if (!entityKey) return null;
        const entity = contentState.getEntity(entityKey);
        console.log("entity:",entity);
        if (entity && entity.getType() === 'IFRAME') {
          return {
            component: IframeComponent,
            editable: false,
            props: entity.getData(),
          };
        }
    }
    return null;
  };

// Component to render the iframe
export const IframeComponent = ( props ) => {
  const { src, width, height } = props.blockProps;
  const url=getSrc(src);
  console.log(url);
  if(url){
  return (
    <div className='video-class'>
    <iframe width={width} height={height} src={url}  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
  );

}
return (<video src={src} />);
};

