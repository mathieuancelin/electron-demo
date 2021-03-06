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

  // on créé la fenetre principale
  const redditsWindow = new BrowserWindow({ width: 400, height: 600, resizable: false });
  // on lui demande de charger la vue principale, dans notre cas le fichier index.html dans static
  redditsWindow.loadURL(`file://${__dirname}/../../static/index.html`);
  // lorsque la vue est chargée dans le renderer chrome
  redditsWindow.webContents.on('did-finish-load', () => {
    // on lui envoi un evenement pour lancer l'affichage désiré
    redditsWindow.webContents.send('command', { type: 'show-allsubreddit' });
  });

  // si on recoit une commande venant d'un des renderer (fenetre)
  ipcMain.on('command', (sender, { type, payload }) => {
    // console.log('main process', type, payload);
    // on vérifie le type
    switch (type) {
      case 'quit-app':
        // on broadcast un message a toutes les fenetres ouvertes pour dire que l'application se termine
        values(subredditWindows)
          .concat(values(imageWindows))
          .forEach(win => win.webContents.send('info', { type: 'will-quit' }));
        setTimeout(() => app.quit(), 2000); // on quitte l'application au bout de 2 secondes
        return;
      case 'open-subreddit-window':
        const { subreddit } = payload;
        // on ouvre une nouvelle fenetre pour afficher un subreddit particulier
        openWindow(subredditWindows, 'subreddit', subreddit, 'show-subreddit');
        return;
      case 'open-image-window':
        const { url, width, height } = payload;
        // on ouvre une nouvelle fenetre pour afficher une image particuliere
        if (width > height) {
          openWindow(imageWindows, 'url', url, 'show-image', 600, 400);
        } else {
          openWindow(imageWindows, 'url', url, 'show-image', 400, 600);
        }
        return;
      default:
        return null;
    }
  });
});
