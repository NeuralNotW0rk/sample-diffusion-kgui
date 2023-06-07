import React, { useContext } from 'react';
import ViewDetails from './ViewDetails';
import ImportModel from './ImportModel';
import Generation from './Generation';
import Variation from './Variation';
import UpdateAttributes from './UpdateAttributes';
import PlayAudio from './PlayAudio';
import './Tools.css';

import { ToolContext } from '../graph_components/KnowledgeGraph';

function ToolBox({activeTool}) {

  const { setActiveTool } = useContext(ToolContext);

  return (
    <div className="toolbox-component">
      <div className="tab-buttons">
        <button
          className={activeTool === 0 ? 'active' : ''}
          onClick={() => setActiveTool('none')}
        >
          Clear
        </button>
      </div>
      <hr />
      <div className="tab-content">
        {activeTool === 'importModel' && <ImportModel />}
        {activeTool === 'generation' && <Generation />}
        {activeTool === 'variation' && <Variation />}
        {activeTool === 'details' && <ViewDetails />}
        {activeTool === 'updateAttributes' && <UpdateAttributes />}
        {activeTool === 'playAudio' && <PlayAudio />}
      </div>
    </div>
  );
};

export default ToolBox;