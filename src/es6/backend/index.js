import { ipcMain, BrowserWindow, app } from 'electron';

function values(obj) {
  return Object.keys(obj).map(k => obj[k]);
}

const subredditWindows = {};
const imageWindows = {};
let lastPosition = {
  x: 0,
  y: 0,
};

function openWindow(cache, key, value, command, width, height) {
  if (!cache[value]) {
    const newWindow = new BrowserWindow({
      width: width || 400,
      height: height || 600,
      resizable: false,
      ...lastPosition
    });
    lastPosition = { x: lastPosition.x + 30, y: lastPosition.y + 30 };
    newWindow.loadURL(`file://${__dirname}/../../static/index.html`);
    cache[value] = newWindow;
    newWindow.on('closed', () => {
      delete cache[value];
    });
    newWindow.webContents.on('did-finish-load', () => {
      newWindow.webContents.send('command', { type: command, payload: { [key]: value } });
    });
  } else {
    cache[value].focus();
  }
}

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {

  const redditsWindow = new BrowserWindow({ width: 400, height: 600, resizable: false, ...lastPosition });
  lastPosition = { x: lastPosition.x + 30, y: lastPosition.y + 40 };
  redditsWindow.loadURL(`file://${__dirname}/../../static/index.html`);
  redditsWindow.webContents.on('did-finish-load', () => {
    redditsWindow.webContents.send('command', { type: 'show-allsubreddit' });
  });

  ipcMain.on('command', (sender, { type, payload }) => {
    // console.log('main process', type, payload);
    switch (type) {
      case 'quit-app':
        values(subredditWindows)
          .concat(values(imageWindows))
          .forEach(win => win.webContents.send('info', { type: 'will-quit' }));
        setTimeout(() => app.quit(), 2000);
        return;
      case 'open-subreddit-window':
        const { subreddit } = payload;
        openWindow(subredditWindows, 'subreddit', subreddit, 'show-subreddit');
        return;
      case 'open-image-window':
        const { url, width, height } = payload;
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
