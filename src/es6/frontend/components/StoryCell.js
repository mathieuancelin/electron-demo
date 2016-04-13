import Elem from 'elemjs';

import { Style } from '../Style';

// un simple composant pour render une cellule dans une liste de d'histoire d'un subreddit
export function StoryCell(props) {
  const { url, width, height } = props.story.preview.images[0].source;
  return (
    <div
      style={Style.storyCell}
      onclick={() => props.open(url, width, height)}>
        <img style={{ width: '60px', height: '60px' }} src={props.story.thumbnail} />
        <p style={{ marginLeft: '10px' }}>
          {props.story.title}
        </p>
    </div>
  );
}
