import React, { useState } from 'react';
import ImportModel from './ImportModel';

function ToolBox() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="toolbox-component">
      <div className="tab-buttons">
        <button
          className={activeTab === 0 ? 'active' : ''}
          onClick={() => handleTabClick(0)}
        >
          Import Model
        </button>
        <button
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => handleTabClick(1)}
        >
          Tab 2
        </button>
        <button
          className={activeTab === 2 ? 'active' : ''}
          onClick={() => handleTabClick(2)}
        >
          Tab 3
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 0 && <ImportModel/>}
        {activeTab === 1 && <div>Content of Tab 2</div>}
        {activeTab === 2 && <div>Content of Tab 3</div>}
      </div>
    </div>
  );
};

export default ToolBox;