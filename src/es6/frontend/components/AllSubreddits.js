import Elem from 'elemjs';
import { ipcRenderer } from 'electron';

import { Loading } from './Loading';
import { Style } from '../Style';
import { SubredditCell } from './SubredditCell';

export function AllSubreddits(props) {
  const quit = () => ipcRenderer.send('command', { type: 'quit-app' });
  const openSubreddit = (subreddit) => ipcRenderer.send('command', {
    type: 'open-subreddit-window',
    payload: {
      subreddit
    }
  });
  if (props.loading) {
    return (
      <Loading what="All subreddits" />
    );
  }
  return (
    <div style={Style.container}>
      <div style={Style.title}>
        <h3>All subreddits</h3>
        <button
          onclick={quit}
          style={{ marginLeft: '10px', marginTop: '13px' }}
          type="button"
          className="btn btn-danger btn-xs">
            <span className="glyphicon glyphicon-off"></span>
        </button>
      </div>
      <div style={Style.content}>
        {
          props.subreddits.map(subreddit => <SubredditCell subreddit={subreddit} open={openSubreddit} />)
        }
      </div>
    </div>
  );
}
