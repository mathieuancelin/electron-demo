import Elem from 'elemjs';
import { ipcRenderer } from 'electron';

import { Style } from '../Style';

export function SubredditCell(props) {
  return (
    <div
      style={Style.subredditCell}
      onclick={props.open.bind(null, props.subreddit.display_name)}>
        {props.subreddit.title}
    </div>
  );
}
