import Elem from 'elemjs';
import { ipcRenderer } from 'electron';
import { Style } from '../Style';

export function StoryCell(props) {
  const { url, width, height } = props.story.preview.images[0].source;
  return (
    <div
      style={Style.storyCell}
      onclick={props.open.bind(null, url, width, height)}>
        <img style={{ width: '60px', height: '60px' }} src={props.story.thumbnail} />
        <p style={{ marginLeft: '10px' }}>
          {props.story.title}
        </p>
    </div>
  );
}
