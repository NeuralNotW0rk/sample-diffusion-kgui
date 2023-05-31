import React, { useContext } from 'react';
import ViewDetails from './ViewDetails';
import ImportModel from './ImportModel';
import Generate from './Generate';

import { ToolContext } from '../graph_components/KnowledgeGraph';

function ToolBox() {

  const {activeTool, setActiveTool} = useContext(ToolContext);

  return (
  <div className="toolbox-component">
    <div className="tab-buttons">
        <button
          className={activeTool === 0 ? 'active' : ''}
          onClick={() => setActiveTool('importModel')}
        >
          Import Model
        </button>
    </div>
    <hr/>
    <div className="tab-content">
      {activeTool === 'default' && <div> Default panel </div>}
      {activeTool === 'details' && <ViewDetails/>} 
      {activeTool === 'importModel' && <ImportModel/>}
      {activeTool === 'generate' && <Generate/>}
    </div>
  </div>
  );
};

export default ToolBox;