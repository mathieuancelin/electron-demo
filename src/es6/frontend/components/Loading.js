import Elem from 'elemjs';
import { Style } from '../Style';

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
