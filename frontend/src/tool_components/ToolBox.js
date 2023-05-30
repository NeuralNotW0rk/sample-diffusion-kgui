import React, { useContext } from 'react';
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
          onClick={() => setActiveTool('default')}
        >
          Default panel
        </button>
    </div>
    <hr/>
    <div className="tab-content">
      {activeTool === 'default' && <div> Default panel </div>}
      {activeTool === 'importModel' && <ImportModel/>}
      {activeTool === 'generate' && <Generate/>}
    </div>
  </div>
  );
};

export default ToolBox;