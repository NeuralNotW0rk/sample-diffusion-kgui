import React, { useContext } from 'react';
import ViewDetails from './ViewDetails';
import ImportModel from './ImportModel';
import ExternalSource from './ExternalSource';
import Generation from './Generation';
import Variation from './Variation';
import UpdateAttributes from './UpdateAttributes';
import PlayAudio from './PlayAudio';
//import './Tools.css';

import { ToolContext } from "../App";


function ToolBox({ activeTool }) {

  return (
    <div className="toolbox-component">
      {activeTool === 'importModel' && <ImportModel />}
      {activeTool === 'externalSource' && <ExternalSource />}
      {activeTool === 'generation' && <Generation />}
      {activeTool === 'variation' && <Variation />}
      {activeTool === 'details' && <ViewDetails />}
      {activeTool === 'updateAttributes' && <UpdateAttributes />}
      {activeTool === 'playAudio' && <PlayAudio />}
    </div>
  );
};

export default ToolBox;