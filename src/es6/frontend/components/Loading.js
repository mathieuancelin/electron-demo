import Elem from 'elemjs';

import { Style } from './Style';

// Un simple composant pour rendre un écran composé d'un titre et d'un spinner
// le titre est paramétrable via les props du composant
export function Loading(props) {
  return (
    <div style={Style.container}>
      <div style={Style.title}><h3>{props.what}</h3></div>
      <div style={{ ...Style.content, alignItems: 'center', justifyContent: 'center' }}>
        <img style={{ marginTop: '100px', width: '200px' }} src={`file://${__dirname}/../../../static/ring.gif`}/>
      </div>
    </div>
  );
}
