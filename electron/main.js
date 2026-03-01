const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let serverProcess = null

function startBackendServer() {
  const isDev = !app.isPackaged;
  const serverPath = isDev 
    ? path.join(__dirname, '../server/index.js')
    : path.join(process.resourcesPath, 'server/index.js');

  // Start Node.js server as child process
  serverProcess = spawn('node', 
    [serverPath],
    { 
      env: { 
        ...process.env, 
        PORT: 5001,
        NODE_ENV: 'production'
      }
    }
  )
  serverProcess.stdout.on('data', (data) => {
    console.log('Server:', data.toString())
  })
  serverProcess.stderr.on('data', (data) => {
    console.error('Server error:', data.toString())
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'TriageFlow — Healthcare Triage System'
  })

  const isDev = !app.isPackaged;
  
  if (isDev) {
    // Development: load React dev server
    win.loadURL('http://localhost:5173')
  } else {
    // Production: load built React files
    win.loadFile(path.join(process.resourcesPath, 'client/dist/index.html'))
  }
}

app.whenReady().then(() => {
  if (app.isPackaged) {
    // Only start server in production build
    startBackendServer()
    // Wait 2 seconds for server to start then open window
    setTimeout(createWindow, 2000)
  } else {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  // Kill the backend server when app closes
  if (serverProcess) serverProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})
