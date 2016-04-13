import Elem from 'elemjs';
import { ipcRenderer } from 'electron';

import { Loading } from './Loading';
import { Style } from './Style';
import { SubredditCell } from './SubredditCell';

// fonction permettant d'envoyer un message au main process,
function quit() {
  // lui indiquant de quitter l'application
  ipcRenderer.send('command', { type: 'quit-app' });
}

// fonction permettant d'envoyer un message au main process
function openSubreddit(subreddit) {
  // le message est une commande de type, ouverture d'une fenetre image
  ipcRenderer.send('command', {
    type: 'open-subreddit-window',
    // dans la payload on passe le nom du subreddit à afficher
    payload: {
      subreddit
    }
  });
}

// Ce composant affiche la liste des subreddit sur reddit
// ce composant doit être affiché seul dans une fenetre electron
export function AllSubreddits(props) {
  // si les données sont en court de chargement, on affiche un spinner
  if (props.loading) {
    return (
      <Loading what="All subreddits" />
    );
  }
  // sinon, on affiche simplement une liste de SubredditCell
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
