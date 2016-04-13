# electron-demo

Un client Reddit très simple qui explore les possibilités de l'API `ipc` d'Electron ainsi que son mode multi fenêtre (`BrowserWindow`)

Pour essayer l'application, installez les dépendances et lancez la compilation ES6 -> ES5

```
npm install
npm run dev
```

et dans un autre terminal, lancez l'application

```
npm start
```

L'application fonctionne de la manière suivant

* Quand on lance l'application, une fenetre est affiché avec la liste des subreddits
* Quand on clique sur un subreddit, une nouvelle fenetre est lancée avec les liste des images de ce subreddit
  * si la fenetre du subreddit était déjà lancée, elle reprend le focus
  * la fenetre envoi un message au main process qui lance la nouvelle fenetre
* Quand on clique sur une image d'un subreddit, une nouvelle fenetre est lancée avec l'image selectionnée
  * si la fenetre de l'image était déjà lancée, elle reprend le focus
  * la fenetre envoi un message au main process qui lance la nouvelle fenetre
* Quand on clique sur le bouton `eteindre`, un voile gris apparait sur toutes les fenetres lancées (sauf la principale) puis l'application se ferme au bout de 2 secondes
  * la fenetre envoi un message au main process qui envoi un message a toutes les fenetres ouverte pour afficher le voile gris

Pour comprendre le fonctionnement de l'application, voici les 3 points d'entrées

* [le point d'entrée pour le main process](https://github.com/mathieuancelin/electron-demo/blob/master/src/es6/backend/index.js)
* [la vue html affichée par chaque renderer chrome](https://github.com/mathieuancelin/electron-demo/blob/master/src/static/index.html)
* [l'application javascript responsable de l'affichage de Reddit dans les renderer chrome](https://github.com/mathieuancelin/electron-demo/blob/master/src/es6/frontend/reddit.js)

![app](https://raw.githubusercontent.com/mathieuancelin/electron-demo/master/reddit.png)
