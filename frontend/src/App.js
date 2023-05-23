import { useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import KnowledgeGraph from './graph_components/KnowledgeGraph';
import ToolBox from './tool_components/ToolBox';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <ToolBox/>
        <KnowledgeGraph/>
      </div>
    </div>
  );
}

export default App;
