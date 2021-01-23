const { app, BrowserWindow } = require('electron');
const fs = require('fs')
const path = require('path')
const moment = require('moment');
const notesdir = 'Notes'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 450,
    backgroundColor: "#AAAAAA",
    show: false,
    frame: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Read today's note and create it if one doesn't exist. 
  // Create the folder if this is the user's first time running this app. 
  if (!fs.existsSync(notesdir)) {
    fs.mkdirSync(notesdir)
  }

  var today = moment.now()
  var tempstring = new String();
  if (!fs.existsSync(path.join(notesdir, moment(today).format("YYYY-MM-DD") + ".txt"))) {
    tempstring = "Notes for " + moment(today).format("MMMM Do, YYYY") + " - " + moment(today).format("dddd") + "\n\n"
    fs.writeFile(path.join(notesdir, moment(today).format("YYYY-MM-DD") + ".txt"), tempstring, function (err) { if (err) console.log(err); })

  }

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Show window when page is ready


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
