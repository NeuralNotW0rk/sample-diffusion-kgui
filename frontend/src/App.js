import './App.css';

import KnowledgeGraph from './graph_components/KnowledgeGraph';

function App() {

  return (
    <div className="app-container">
      <header className='header'>
        <h1> Dance Diffusion KGUI </h1>
      </header>
      <KnowledgeGraph />
    </div>
  );
}

export default App;
