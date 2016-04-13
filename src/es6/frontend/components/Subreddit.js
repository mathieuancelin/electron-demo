import Elem from 'elemjs';
import { ipcRenderer } from 'electron';

import { Loading } from './Loading';
import { Style } from '../Style';
import { StoryCell } from './StoryCell';

export function Subreddit(props) {
  const openImage = (url, width, height) => ipcRenderer.send('command', {
    type: 'open-image-window',
    payload: {
      url, width, height
    }
  });
  if (props.loading) {
    return (
      <Loading what={`Subreddit ${props.subreddit}`} />
    );
  }
  if (props.stories.length === 0) {
    return (
      <div style={Style.container}>
        <div style={Style.title}><h3>No Images :(</h3></div>
      </div>
    );
  }
  return (
    <div style={Style.container}>
      <div style={Style.title}><h3>{`Subreddit ${props.subreddit}`}</h3></div>
      <div style={Style.content}>
        {
          props.stories.map(story => <StoryCell story={story} open={openImage} />)
        }
      </div>
    </div>
  );
}
