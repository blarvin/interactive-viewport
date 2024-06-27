import React from 'react';
import './App.css';
import RibbonComponent from './components/RibbonComponent';
import WorkspaceComponent from './components/WorkspaceComponent';

function App() {
  return (
    <div className="App">
      <RibbonComponent />
      <div className="workspace">
        <WorkspaceComponent />
      </div>
    </div>
  );
}

export default App;
