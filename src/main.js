import {app, BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';

// Don't store the app data in the roaming dir.
// https://github.com/electron/electron/issues/1404#issuecomment-194391247
if (process.platform === 'win32') {
  app.setAppUserModelId('com.spatialnetworks.fulcrum');
  app.setPath('appData', process.env.LOCALAPPDATA);
  app.setPath('userData', path.join(process.env.LOCALAPPDATA, 'Fulcrum'));
}

import './auto-updater';

let browserWindow = null;

function start() {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  function createWindow() {
    browserWindow = new BrowserWindow({width: 210, height: 114});

    // and load the index.html of the app.
    browserWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    // browserWindow.webContents.openDevTools({mode: 'detach'});

    browserWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      browserWindow = null;
    });
  }

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow === null) {
      createWindow();
    }
  });
}

start();
