import React, { useState } from 'react';
import './App.css';
import reactLogo from '../react.svg';
import arduinoLogo from '../arduino.svg';
import { channels } from '../shared/constants';

const { ipcRenderer } = window; 

function App() {
  const [appName, setAppName] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [ports, setPorts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  ipcRenderer.send(channels.APP_INFO);
  ipcRenderer.on(channels.APP_INFO, (event, arg) => {
    ipcRenderer.removeAllListeners(channels.APP_INFO);
    setAppName(arg.appName);
    setAppVersion(arg.appVersion);
  });

  ipcRenderer.send(channels.SERIALPORT_LIST);
  ipcRenderer.on(channels.SERIALPORT_LIST, (event, { ports }) => {
    ipcRenderer.removeAllListeners(channels.SERIALPORT_LIST);
    setPorts(ports);
  });

  ipcRenderer.on(channels.SERIALPORT_CONNECTED, () => {
    setIsConnected(true);
  });

  const connect = (port) => {
    ipcRenderer.send(channels.SERIALPORT_CONNECT, port);
  }

  const renderPorts = () => (
    <ol>
      {
        ports.map((port) => (
          <li className="port" key={port.path}>
            <button onClick={() => connect(port)} type="button">Connect</button>
            {port.path}
          </li>
        ))
      }
    </ol>
  )

  return (
    <div className="App">
      <header>
        <img src={reactLogo} className="App-logo-react" alt="logo" />
        <img src={arduinoLogo} className="App-logo-arduino" alt="logo" />
      </header>
      {
        !isConnected && renderPorts()
      }
      <footer>
        <small>{appName} version {appVersion}</small>
      </footer>
    </div>
  );
}

export default App;
