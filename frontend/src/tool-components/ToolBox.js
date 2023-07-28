import React, { useContext } from 'react';

import ViewDetails from './ViewDetails';
import ImportModel from './ImportModel';
import ExternalSource from './ExternalSource';
import Generation from './Generation';
import Variation from './Variation';
import UpdateAttributes from './UpdateAttributes';
import PlayAudio from './PlayAudio';
import LoadProject from './LoadProject';


function ToolBox({ activeTool }) {

  return (
    <div className='toolbox-component'>
      {activeTool === 'loadProject' && <LoadProject />}
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