import Elem from 'elemjs';

// un simple composant permettant d'afficher une image prenant toute la largeur de l'écran
// l'url de l'image est passée via les props
export function Image(props) {
  return (
    <img style={{ width: '100vw' }} src={props.url} />
  );
}
