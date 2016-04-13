import Elem from 'elemjs';

import { Style } from '../Style';

// un simple composant pour render une cellule dans une liste de subreddits
export function SubredditCell(props) {
  return (
    <div
      style={Style.subredditCell}
      onclick={() => props.open(props.subreddit.display_name)}>
        {props.subreddit.title}
    </div>
  );
}
