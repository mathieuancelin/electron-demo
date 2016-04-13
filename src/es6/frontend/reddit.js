import 'es6-shim';
import 'es7-shim';
import Elem from 'elemjs';

import { fetchSubreddits, fetchSubreddit } from './services/http';
import { Image } from './components/Image';
import { AllSubreddits } from './components/AllSubreddits';
import { Subreddit } from './components/Subreddit';

// ici les 3 fonctions de base exposées par l'application Reddit
// chaque fonction va monter un composant Elem dans le container #app
// puis lancer une requete ajax pour charger les données
// puis redessine le composant avec les doonées

// affichage de la vue listant tous les subreddits
export function showAllSubreddits(container) {
  // on affiche le composant AllSubreddits a vide, en indiquant que les données sont en train de charger
  Elem.render(<AllSubreddits subreddits={[]} loading={true} />, container);
  // on fait un appel ajax
  fetchSubreddits().then(data => {
    // on nettoie les données recues
    const subreddits = data.map(subreddit => subreddit.data);
    // on affiche le composant AllSubreddits avec les bonnes donnés en indiquant que les données sont chargées
    Elem.render(<AllSubreddits subreddits={subreddits} loading={false} />, container);
  });
}

// affichage de la vue listant les stories d'un subreddit
export function showSubreddit(subreddit, container) {
  // on affiche le composant Subreddit a vide, en indiquant que les données sont en train de charger
  Elem.render(<Subreddit subreddit={subreddit} stories={[]} loading={true} />, container);
  // on fait un appel ajax
  fetchSubreddit(subreddit).then(data => {
    // on nettoie les données recues
    const stories = data.map(story => story.data);
    // on affiche le composant Subreddit avec les bonnes donnés en indiquant que les données sont chargées
    Elem.render(<Subreddit subreddit={subreddit} stories={stories} loading={false} />, container);
  });
}

// affichage de la vue listant contenant l'image d'une story
export function showImage(url, container) {
  // on affiche le composant Image avec la bonne image
  Elem.render(<Image url={url} />, container);
}
