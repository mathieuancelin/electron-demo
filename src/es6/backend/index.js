import { ipcMain, BrowserWindow, app } from 'electron';

function values(obj) {
  return Object.keys(obj).map(k => obj[k]);
}

// cache des fenetres de type subreddit pour pouvoir leur redonner le focus
const subredditWindows = {};
// cache des fenetres de type image pour pouvoir leur redonner le focus
const imageWindows = {};
// mémorisation de la position de la dernière fenetre por faire un dégradé de fenetres
let lastPosition = {
  x: 0,
  y: 0,
};

// fonction generique pour ouvrir une fenetre
function openWindow(cache, key, value, command, width, height) {
  // ici on regarde si la fenetre n'est pas deja ouverte
  // si ce n'est pas le cas, on créé une nouvelle fenetre
  if (!cache[value]) {
    const newWindow = new BrowserWindow({
      width: width || 400,
      height: height || 600,
      resizable: false,
      ...lastPosition
    });
    lastPosition = { x: lastPosition.x + 30, y: lastPosition.y + 30 };
    // on lui demande de charger la vue désirée, dans notre cas le fichier index.html dans static
    newWindow.loadURL(`file://${__dirname}/../../static/index.html`);
    // on met la nouvelle fenetre dans le cache dédié
    cache[value] = newWindow;
    // on s'assure que le cache est nettoyé si la fenetre est fermée
    newWindow.on('closed', () => {
      delete cache[value];
      app.dock.setBadge(`${values(subredditWindows).concat(values(imageWindows)).length}`);
    });
    // lorsque la vue est chargée dans le renderer chrome
    newWindow.webContents.on('did-finish-load', () => {
      // on lui envoi un evenement pour lancer l'affichage désiré
      newWindow.webContents.send('command', { type: command, payload: { [key]: value } });
    });
    app.dock.setBadge(`${values(subredditWindows).concat(values(imageWindows)).length}`);
  } else {
    // si la fenetre est deja ouverte, on lui redonne le focus
    cache[value].focus();
  }
}

// lorsque toutes les fenetres de l'application sont fermées on quitte l'appliction
app.on('window-all-closed', () => app.quit());

// lorsque l'application est prete à démarrer
app.on('ready', () => {

  // on créé la fenetre principale de 400 par 600
  // on lui demande de charger la vue principale, dans notre cas le fichier index.html dans static
  // lorsque la vue est chargée dans le renderer chrome
  // on lui envoi un evenement pour lancer l'affichage désiré
  // TODO

  // si on recoit une commande venant d'un des renderer (fenetre)
  ipcMain.on('command', (sender, { type, payload }) => {
    // on vérifie le type
    switch (type) {
      case 'quit-app':
        // on broadcast un message a toutes les fenetres ouvertes pour dire que l'application se termine
        // TODO
        return;
      case 'open-subreddit-window':
        const { subreddit } = payload;
        // on ouvre une nouvelle fenetre pour afficher un subreddit particulier
        // TODO
        return;
      case 'open-image-window':
        const { url, width, height } = payload;
        // on ouvre une nouvelle fenetre pour afficher une image particuliere
        // TODO
        return;
      default:
        return null;
    }
  });
});
