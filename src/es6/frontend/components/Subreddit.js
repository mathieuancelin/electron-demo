import Elem from 'elemjs';
import { ipcRenderer } from 'electron';

import { Loading } from './Loading';
import { Style } from './Style';
import { StoryCell } from './StoryCell';

// fonction permettant d'envoyer un message au main process
function openImage(url, width, height) {
  // le message est une commande de type, ouverture d'une fenetre image
  ipcRenderer.send('command', {
    type: 'open-image-window',
    // dans la payload on passe l'url de l'image a afficher ainsi que sa taille
    payload: {
      url, width, height
    }
  });
}

// Ce composant affiche la liste des images d'un subreddit,
// ce composant doit être affiché seul dans une fenetre electron
export function Subreddit(props) {
  // si les données sont en court de chargement, on affiche un spinner
  if (props.loading) {
    return (
      <Loading what={`Subreddit ${props.subreddit}`} />
    );
  }
  // si les données sont vide, on affiche un message
  if (props.stories.length === 0) {
    return (
      <div style={Style.container}>
        <div style={Style.title}><h3>No images here, sorry :(</h3></div>
      </div>
    );
  }
  // sinon, on affiche simplement une liste de StoryCell
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
